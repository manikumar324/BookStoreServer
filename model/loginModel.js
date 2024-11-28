const mongoose = require('mongoose')

const Login = new mongoose.Schema ({
    email : {
        type : String,
        require : true
    },
    otp : {
        type : Number
    }
})

const LoginModel = mongoose.model ("User", Login)

module.exports = LoginModel;