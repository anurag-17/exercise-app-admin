const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
    "name":{
        type:String,
        required:[true, "Please provide user name."]
    },
    "email":{
        type:String,
        required:[true, "Please provide user email."],
        unique:[true, "Email already exist."]
    },
    "contact":{
        type:String,
        required:[true, "Please provide user contact number."],
        unique:[true, "Contact number already exist."]
    },
    "password":{
        type:String,
    }
})
const User = mongoose.model("User", userSchema)
module.exports = User;