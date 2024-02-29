const mongoose = require("mongoose")
const User = require("./User")

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
        type:mongoose.Schema.Types.ObjectId, ref: User,
        required:[true],
       
    }
})

const Feedback = mongoose.model("Feedback", feedBackSchema)
module.exports = Feedback