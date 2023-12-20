const mongoose = require("mongoose")

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
        type:String,
        required:true
    }
})
const WatchTime = mongoose.model("WatchTime", watchTimeSchema)
module.exports = WatchTime;