const express = require('express');
const router = express.Router();
const { sendConfirmationEmail } = require('../utils/email');
const Booking = require('../models/Bookings');
const Teachers = require('../models/Teachers');
const Student = require('../models/Student');

//ROUTE 1: get the booking done by the student '/' ;
router.post('/',async(req,res)=>{
    try {
        const {teacherId,studentId,bookingDateTime} = req.body;
        console.log("Booking POST called with body:", req.body);
        const booking = await  Booking.create({teacher:teacherId,student:studentId,bookingDateTime:bookingDateTime});
        // await booking.save();
        res.json({message:"Booking request sent",booking});
    } catch (error) {
        console.log(error);
        return res.status(501).json({error: "Internal server error"});
    }
})

//ROUTE 2: get all bookins for the student '/student/:studentid';
router.get('/student/:studentid',async(req,res)=>{
    try {
        console.log("Student ID received:", req.params.studentid);
        const booking = await Booking.find({student: req.params.studentid}).populate('teacher');
        res.json({booking});
    } catch (error) {
        console.log("Error in getting bookings:", error); 
        return res.status(500).json({error:"Internal server error"});
    }
})

//ROUTE 3 : get all the bookings for the teacher '/teacher/:teacherid';
router.get('/teacher/:teacherid',async(req,res)=>{
    try {
        console.log("Got teacher id" , req.params.teacherid);
        const booking = await Booking.find({teacher: req.params.teacherid}).populate('student');
        res.json({booking});
    } catch (error) {
        console.log("An error occured : ",error);
        return res.status(500).json({error:"Internal server error"});
    }
})

//ROUTE 4: cancel the booking by the teacher '/cancel/:bookingid';
router.put('/cancel/:bookingid',async(req,res)=>{
    try {
        const booking = await Booking.findById(req.params.bookingid);
        if(!booking){
            return res.status(500).json({error:"Boking was not created"});
        }
        booking.status = "cancelled";
        await booking.save();
        res.json({message:"Booking Cancelled",booking});
    } catch (error) {
        return res.status(501).json({error:"Internal error occured"})
    }
})

//ROUTE 5: accept the booking by the tutor '/accept/:bookingid';
router.put('/accept/:bookingid', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.bookingid).populate('teacher');

        if (!booking) {
            return res.status(400).json({ message: "Booking not found" });
        }

        booking.status = "confirmed";
        await booking.save();

        const student  = await Student.findById(booking.student);
        const teacher = await Teachers.findById(booking.teacher);

        if (!student || !teacher) {
            return res.status(404).json({ message: "Student or Teacher not found" });
        }

        // Format date and time properly
        const formattedDate = new Date(booking.bookingDateTime).toLocaleString('en-IN', {
            dateStyle: 'medium',
            timeStyle: 'short',
            timeZone: 'Asia/Kolkata'
        });

        sendConfirmationEmail(
            student.email,
            student.name,
            teacher.name,
            booking.teacher.subject,
            formattedDate
        );

        res.json({ message: "Booking confirmed successfully and mail sent successfully", booking });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error occurred" });
    }
});

//ROUTE 5: get all teh bookings done by the student '/xgetbooking/:studentid'
router.post('/getbooking/:studentid',async (req,res)=>{
    try {
        const studentId = req.params.studentid;
        const student = await Student.findById(studentId);
        if(!student){
            return res.status(400).json({message:"Student not found",error:"Student not found"});
        }
        const booking  = await Booking.find({student:studentId}).populate('teacher','name subject');
        res.status(200).json({message:"Booking fetched",booking});
    } catch (error) {
        return res.status(500).json({message : "Some error occured",error:"Internal Server error"})
    }
})

// ROUTE 6 : Get all the bookings done by the teacher '/getbooking/:teacherid'
router.post('/getbooking/teacher/:teacherid', async (req, res) => {
    try {
        const teacherId = req.params.teacherid;
        const teacher =  await Teachers.findById(teacherId);
        if(!teacher){
            return res.status(400).json({message:"Teacher not found",error:"Teacher was not found"});
        }
        const bookings = await Booking.find({ teacher: teacherId }).populate('student');
        res.status(200).json({ message: "Teacher bookings fetched", bookings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Some internal error occurred", error: error.message });
    }
});



module.exports = router;