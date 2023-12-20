const mongoose = require("mongoose")

const feedBackSchema = new mongoose.Schema({
    "name":{
        type:String,
        required:[true],
       
    },
    "email":{
        type:String,
        required:[true],
       
    },
    "contact":{
        type:String,
        required:[true],
       
    },
    "message":{
        type:String,
        required:[true],
       
    },
    "userID":{
        type:String,
        required:[true],
       
    }
})

const Feedback = mongoose.model("Feedback", feedBackSchema)
module.exports = Feedback