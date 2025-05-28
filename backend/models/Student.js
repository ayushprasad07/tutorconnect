const mongoose = require('mongoose');
const { Schema } = mongoose;


const studentSchema = new Schema({
  name : {type:String , required:true},
  studentImage:{type:String,default:''},
  email : {type:String, required:true},
  password : {type:String, required:true},
  phoneNumber : {type:Number, required : true},
  location : {type:String, required : true},
  fatherName:{type:String, required: true},
  guardianNumber:{type:Number, required: true}
});

const Students = mongoose.model('Student',studentSchema);
module.exports = Students;