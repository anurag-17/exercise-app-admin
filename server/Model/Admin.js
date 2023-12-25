const mongoose = require("mongoose")

const adminSchema = new mongoose.Schema({
    "email":{
        type:String,
        required:[true, "Please provide user email."],
        unique :  true,
    },
    "password":{
        type : String,
        required: [true, "Provide passcode"],
        
    },
    "role":{
        type:String,
        default: "Admin"
    },
    "activeToken":{
        type:String
    }
})
const Admin = mongoose.model("Admin", adminSchema)
module.exports = Admin;