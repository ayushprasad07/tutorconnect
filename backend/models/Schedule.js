const mongoose = require('mongoose');
const Teachers = require('./Teachers');
const Student = require('./Student');
const { Schema } = mongoose;

const scheduleSchema = new Schema({
  teacherId:{type: mongoose.Schema.Types.ObjectId, ref: Teachers},
  studentId:{type: mongoose.Schema.Types.ObjectId, ref: Student},
  date: {type: Date, required:true},
  status:{type: String, default:'upcoming'},
  notified:{type: String, default:false}
});

const Schedule = mongoose.model('Schedule',scheduleSchema);
module.exports = Schedule;