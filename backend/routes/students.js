const express = require('express');
const router =  express.Router();
const Students = require('../models/Student');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const jwt = require('jsonwebtoken');
const {body, validationResult} = require('express-validator');

// ROUTE 1: register a student using: POST "/api/students/register/student". No login required
router.post("/register/student",[
    body('name',"Enter a valid name").isLength({min:3}),
    body('email','Enter a valid email').isEmail(),
    body('password', 'Enter a vlaid password').isLength({ min : 5 }),
],async(req,res)=>{
    const result = validationResult(req);
    if(!result.isEmpty()){
        return res.status(500).json({error: result.array()});
    }
    try {
        let student = await Students.findOne({email:req.body.email});
        let success = false;
        if(student){
            return res.status(400).json({success,error:"Sorry this email already exists"});
        }
        const salt = await bcrypt.genSalt(10);
        const hashPass = await bcrypt.hash(req.body.password,salt);
        student = await Students.create({
            name:req.body.name,
            email:req.body.email,
            password:hashPass,
            phoneNumber:req.body.phoneNumber,
            location:req.body.location,
            fatherName: req.body.fatherName,
            guardianNumber: req.body.guardianNumber
        })
        const data = {
            student:{
                id: student.id
            }
        }
        const authToken = jwt.sign(data, process.env.JWT_SECRET);
        success = true;
        res.json({success,student,authToken});
    } catch (error) {
        console.error("Registration error:", error);  
        return res.status(500).json({error:"Internal Server error"});
    }
})

// ROUTE 2: login a teacher using: POST "/api/teachers/login/student". No login required
router.post("/login/student",[
    body('email','Enter a valid email').isEmail(),
    body('password', 'Enter a vlaid password').isLength({ min : 5 }),
],async (req,res)=>{
    const result = validationResult(req);
    if(!result.isEmpty()){
        return res.status(400).json({error: result.array()});
    }
    try {
        const {email,password} = req.body;
        const student = await Students.findOne({email});
        let success = false;
        if(!student){
            return res.status(400).json({message:"Try to login with correct credentials",success,error:"Please authenticate the user"});
        }
        const passCompare = await bcrypt.compare(password,student.password);
        if(!passCompare){
            return res.status(400).json({message:"Try to login with correct credentials",error:"Try to login with correct credentials"});
        }
        const data = {
            student:{
                id:student.id
            }
        }
        const authToken = jwt.sign(data,process.env.JWT_SECRET);
        success = true;
        res.json({message:"Logged in succcessfully",success,student,authToken});
    } catch (error) {
        return res.status(500).json({success:false,error:"Sorry! internal error occured."})
    }
})

// ROUTE 3 : get the student '/api/student/:studentid'
router.post('/:studentid',async (req,res)=>{
    try {
        const student = await Students.findById(req.params.studentid);
        res.json(student);
    } catch (error) {
        return res.status(500).json({error:"Internal server error."})
    }
})

//ROUTE 4: update a student profile '/update/:studentid'
router.put('/update/:studentid',async(req,res)=>{
    try {
        const {name,location,phoneNumber} = req.body;
        const studentId = req.params.studentid;
        const student = await Students.findById(studentId);
        if(!student){
            return res.status(400).json({message:"Student was not found"});
        }
        student.name = name || student.name;
        student.location = location || student.location;
        student.phoneNumber = phoneNumber || student.phoneNumber;

        await student.save();
        res.status(200).json({message:"Updated Successfully",student});
    } catch (error) {
        return res.status(500).json({message:"Internal Servre Error"})
    }
})

module.exports = router;