const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookingSchema = new Schema({
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teachers', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    bookingDateTime: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
});

const Booking = mongoose.model('booking',bookingSchema);
module.exports = Booking;