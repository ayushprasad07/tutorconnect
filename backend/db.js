const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://ayushprasad2110:wumrWLDh5102fM4K@mongotute.xesle.mongodb.net/tutorConnect?retryWrites=true&w=majority&appName=MongoTute";

const connectToMongo = ()=>{
    mongoose.connect(mongoURI,{})
    console.log("Connected to mongo Successfully");
}

module.exports = connectToMongo;