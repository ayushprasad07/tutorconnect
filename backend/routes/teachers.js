const express = require('express');
const router = express.Router();
const {body,validationResult} = require('express-validator');
const Teachers = require('../models/Teachers');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
var jwt = require('jsonwebtoken');
const fetchUser = require('../middleware/fetchUser');
const {upload} = require('../middleware/multer.middleware');
const {uploadOnCloud} = require('../utils/cloudinary');
const fs = require('fs');


// ROUTE 1: register a teacher using: POST "/api/teachers/register/teacher". No login required
router.post("/register/teacher", upload.single('teacherImage'),async(req,res)=>{
    const result = validationResult(req);
    if(!result.isEmpty()){
        return res.status(400).json({error:result.array()});
    }
    try {
        let teacher = await Teachers.findOne({email:req.body.email});
        let success = false;
        if(teacher){
            return res.status(400).json({success,error:"Sorry this email already exists."});
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashPass = await bcrypt.hash(req.body.password,salt);

        const localFilePath = req.file.path;
        const teacherImageUpload = await uploadOnCloud(localFilePath);
        fs.unlinkSync(localFilePath);

        if(!teacherImageUpload){
            return res.status(500).json({success:false,message:"Image was not upladed"});
        }

        teacher = await Teachers.create({
            name:req.body.name,
            teacherImage:teacherImageUpload.secure_url,
            email:req.body.email,
            password:hashPass,
            phoneNumber:req.body.phoneNumber,
            subject:req.body.subject,
            chargesPerHour:req.body.chargesPerHour,
            bio:req.body.bio,
            location:req.body.location
        });
        const data = {
            teacher:{
                id:teacher.id
            }
        }
        const authToken = jwt.sign(data, process.env.JWT_SECRET); // TODO : Add a  { expiresIn: '1h' } attribute.
        console.log("Loaded JWT_SECRET:", process.env.JWT_SECRET);
        success = true;
        res.json({success,teacher,authToken});
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({success:false,error:"Please login with correct credentials"});
    }
})

//ROUTER 2: login a teacher using: POST "/api/teachers/login/teacher". No login required
router.post("/login/teacher",[
    body('email','Enter a valid email').isEmail(),
    body('password', 'Enter a vlaid password').isLength({ min : 5 }),
],async(req,res)=>{
    const result = validationResult(req);
    if(!result.isEmpty()){
        return res.status(404).json({error: result.array()});
    }
    try {
        const {email,password} = req.body;
        const teacher = await Teachers.findOne({email});
        let success = false;
        if(!teacher){
            return res.status(400).json({message:"Login in with correct credentials",success,error:"Please login in with correct credentials"});
        }
        const passCompare = await bcrypt.compare(password,teacher.password);
        if(!passCompare){
            return res.status(400).json({message:"Login in with correct credentials",error:"Please try to login with corrrect credentials"});
        }
        const data = {
            teacher:{
                id:teacher.id
            }
        }
        const authToken = jwt.sign(data, process.env.JWT_SECRET);
        success = true
        res.json({message:"Logged in successfully",success,teacher,authToken});
    } catch (error) {
        return res.status(500).json({message:"Some internal error occured",success:false,error:"Sorry! internal error occured"});
    }
})

//ROUTER 3: get all teacher using: POST "/api/teachers/getteacher". Login required
router.post('/getteacher', fetchUser, async (req, res) => {
    try {
        const teacher = await Teachers.find();
        res.send({success:true,teacher});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({success:false, error: "Internal server error" });
    }
});

//ROUTER 4: get a teacher using POST: '/get/:teacherid';
router.post('/get/:teacherid', async (req, res) => {
    try {
      const teacher = await Teachers.findById(req.params.teacherid);
      if (!teacher) {
        return res.status(400).json({ message: "Teacher not found", error: "Teacher not found" });
      }
      res.status(200).json({ teacher });
    } catch (error) {
      return res.status(500).json({ error: "Internal Server error" });
    }
  });

// ROUTE 5  : edit a teachers profile '/teacher/editprofile/:teacherid'
router.put('/teacher/editprofile/:teacherid',async(req,res)=>{
    try {
        const {name,bio,location,chargesPerHour,phoneNumber} = req.body;
        const teacherid = req.params.teacherid;
        const teacher = await Teachers.findById(teacherid);
        if(!teacher){
            return res.status(400).json({message:"teacher not found"});
        }

        teacher.name = name || teacher.name;
        teacher.bio = bio || teacher.bio;
        teacher.location = location || teacher.location;
        teacher.chargesPerHour = chargesPerHour || teacher.chargesPerHour;
        teacher.phoneNumber = phoneNumber || teacher.phoneNumber;

        await teacher.save();
        return res.status(200).json({message:"Successfully updated",teacher});
    } catch (error) {
        return res.status(500).json({message:"Some Internal error Occured"})
    }
})
  

module.exports = router;