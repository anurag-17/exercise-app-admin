const mongoose = require("mongoose");
const User = require("./User");

const watchTimeSchema = new mongoose.Schema({
    "URL":{
        type:String,
        required:true,
    },
    "date":{
        type : String,
        required: true,
        
    },
    "userID":{
        type:mongoose.Schema.Types.ObjectId, ref: User,
        required:true
    }
})
const WatchTime = mongoose.model("WatchTime", watchTimeSchema)
module.exports = WatchTime;