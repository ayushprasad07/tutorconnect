const { type } = require('@testing-library/user-event/dist/type');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const teacherSchema = new Schema({
    name: { type: String, required: true },
    teacherImage:{ type:String, required:true},
    email: { type: String, required: true },
    password: { type: String, required: true },
    phoneNumber: { type: Number, required: true },
    subject: { type: String, required: true },
    chargesPerHour: { type: Number, required: true },
    bio: { type: String, required: true },
    location: { type: String, required: true },
    availability:{type:String, enum : ['unavailable','available'],default:'available'}
});

const Teachers = mongoose.model("Teachers", teacherSchema);
module.exports = Teachers;
