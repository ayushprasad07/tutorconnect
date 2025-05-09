const mongoose = require('mongoose');
const {sendNotificationMail} = require('../utils/notificationEmail');
const cron = require('node-cron');
const Schedule = require('../models/Schedule');
// const Teachers = require('../models/Teachers');

cron.schedule('* * * * *',async()=>{
    try {
        const now = new Date();
        const oneMinuteLater = new Date(now.getTime()+1*60*1000);
        const schedules = await Schedule.find({
            date: {$gte:now, $lt: oneMinuteLater},
            notified: false
        }).populate('teacherId');
        for (const schedule of schedules){
            const teacher = schedule.teacherId;
            if(teacher?.email){
                sendNotificationMail(
                    teacher.email,
                    teacher.name,
                    schedule.date.toLocaleString(),
                    teacher.subject
                );
            }
            schedule.notified = true;
            await schedule.save();
        }  
    } catch (error) {
        console.log("Some error occured : ",error);
    }
})