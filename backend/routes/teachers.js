const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Teachers = require('../models/Teachers');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const jwt = require('jsonwebtoken');
const fetchUser = require('../middleware/fetchUser');
const { upload } = require('../middleware/multer.middleware');
const { uploadOnCloud } = require('../utils/cloudinary');
const fs = require('fs');

// ROUTE 1: Register a teacher
router.post("/register/teacher", upload.single('teacherImage'), [
    body('name', "Enter a valid name").isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Enter a valid password').isLength({ min: 5 })
], async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ success: false, error: result.array() });
    }
    try {
        let teacher = await Teachers.findOne({ email: req.body.email });
        if (teacher) {
            return res.status(400).json({ success: false, message: "Email already exists." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashPass = await bcrypt.hash(req.body.password, salt);

        const localFilePath = req.file.path;
        const teacherImageUpload = await uploadOnCloud(localFilePath);
        fs.unlinkSync(localFilePath);

        if (!teacherImageUpload) {
            return res.status(500).json({ success: false, message: "Image upload failed." });
        }

        teacher = await Teachers.create({
            name: req.body.name,
            teacherImage: teacherImageUpload.secure_url,
            email: req.body.email,
            password: hashPass,
            phoneNumber: req.body.phoneNumber,
            subject: req.body.subject,
            chargesPerHour: req.body.chargesPerHour,
            bio: req.body.bio,
            location: req.body.location
        });

        const data = { teacher: { id: teacher._id.toString() } };
        const authToken = jwt.sign(data, process.env.JWT_SECRET);

        res.json({ success: true, message: "Account created successfully", teacher, authToken });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});

// ROUTE 2: Login a teacher
router.post("/login/teacher", [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Enter a valid password').isLength({ min: 5 })
], async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ success: false, error: result.array() });
    }
    try {
        const { email, password } = req.body;
        const teacher = await Teachers.findOne({ email });
        if (!teacher) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, teacher.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const data = { teacher: { id: teacher._id.toString() } };
        const authToken = jwt.sign(data, process.env.JWT_SECRET);

        res.json({ success: true, message: "Logged in successfully", teacher, authToken });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});

// ROUTE 3: Get all teachers
router.post('/getteacher', fetchUser, async (req, res) => {
    try {
        const teacher = await Teachers.find();
        res.json({ success: true, teacher });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});

// ROUTE 4: Get a teacher by ID
router.post('/get/:teacherid', async (req, res) => {
    try {
        const teacher = await Teachers.findById(req.params.teacherid);
        if (!teacher) {
            return res.status(404).json({ success: false, message: "Teacher not found" });
        }
        res.status(200).json({ success: true, teacher });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});

// ROUTE 5: Edit a teacher profile
router.put('/teacher/editprofile/:teacherid', async (req, res) => {
    try {
        const { name, bio, location, chargesPerHour, phoneNumber } = req.body;
        const teacher = await Teachers.findById(req.params.teacherid);

        if (!teacher) {
            return res.status(404).json({ success: false, message: "Teacher not found" });
        }

        teacher.name = name || teacher.name;
        teacher.bio = bio || teacher.bio;
        teacher.location = location || teacher.location;
        teacher.chargesPerHour = chargesPerHour || teacher.chargesPerHour;
        teacher.phoneNumber = phoneNumber || teacher.phoneNumber;

        await teacher.save();

        res.status(200).json({ success: true, message: "Profile updated", teacher });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

//ROUTE 6: get teacher wrt location '/getTeacherByLocation'
router.post('/getTeacherByLocation', fetchUser, async (req, res) => {
    try {
        const location = req.body.location;
        const teacher = await Teachers.find({location:location});
        if(!teacher){
            return res.status(400).json({message:"No teacher is found in that location"});
        }
        res.status(200).json({ success: true, teacher });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});

module.exports = router;