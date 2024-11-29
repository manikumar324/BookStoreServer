const LoginModel = require("../model/loginModel");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const Otp = require("otp-generator");
const nodeMailer = require("nodemailer");
const path = require("path");
const ejs = require("ejs");

//OTP GENERATOR

const generateOtp = () => {
  return Otp.generate(4, {
    specialChars: false,
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
  });
};

const renderTemplate = (templatePath, data) => {
  return new Promise((resolve, reject) => {
    ejs.renderFile(templatePath, data, (err, html) => {
      if (err) {
        return reject(err);
      }
      resolve(html);
    });
  });
};

exports.Login = async (req, res) => {
  const { name, email } = req.body;
  console.log(req.body); // to see whether the input fields are coming to backend or not.

  if (!name || !email) {
    return res.status(400).json({ message: "All Fields Required" });
  }

  let user = await LoginModel.findOne({ email });

  const OTP = generateOtp();

  if (user) {
    user.otp = OTP;
  } else {
    user = new LoginModel({
      email: email,
      otp: OTP,
    });
  }
  await user.save();

  const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.Email_User,
      pass: process.env.Email_Pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const userTemplatePath = path.join(__dirname, "../views", "LoginMail.ejs");

  try {
    const htmlContent = await renderTemplate(userTemplatePath, { otp: OTP });

    await transporter.sendMail({
        from : process.env.Email_User,
        to: email,
        subject : "Your Login OTP",
        html : htmlContent,
    })
    res.status(200).json({message : "OTP sent suceesfully" , data :OTP , mail : email})
  } catch (error) {
    console.log("Error sending OTP email" , error);
    res.status(500).json({message : "Error Sending OTP email" , error})
  }
};

exports.resendOtp = async ( req , res ) =>{
    const { email } = req.body
    console.log(req.body)

    if( !email ){
        return res.status(400).json({message : "Email is Required"})
    }

    try{

        let user = await LoginModel.findOne({ email })

        if(!user){
            return res.status(401).json({message : "User not found"})
        }

        const newOtp = generateOtp()

        user.otp = newOtp
        await user.save();

        const transporter = nodeMailer.createTransport({
            host : "smtp.gmail.com",
            port : 587 ,
             secure : false ,
             auth : {
                user : process.env.Email_User,
                pass : process.env.Email_Pass,
             },
             tls : {
                rejectUnauthorized : false ,
             },
        });

        const userTemplatePath = path.join(__dirname, "../views" , "LoginMail.ejs")

        const htmlContent = await renderTemplate( userTemplatePath , { otp : newOtp })

        await transporter.sendMail({
            from : process.env.Email_User,
            to : email,
            subject : "Your New Login OTP",
            html : htmlContent
        })
        res.status(200).json({sucess : true ,message : "OTP Re-Sent successfully"})
        
    }
    catch(error){
        console.log("Error sending OTP" , error)
        res.status(500).json({success : false , message : "Error sending OTP", error})
    }
}


exports.ValidateOtp = async ( req , res ) =>{
    const { Email , enteredOtp } = req.body
    console.log(req.body)

    if( !Email || !enteredOtp ){
        return res.status(404).json({message :  "OTP and Email Required"})
    }

    let user = await LoginModel.findOne({email : Email})

    if(!user){
        return res.status(404).json({message : "User Not Found"})
    }
    
    if(user.otp == enteredOtp){
        const token = jwt.sign({ Email },"Bookstore", {expiresIn : "1h"})
        res.status(200).json({success : true , message : "OTP verified successfully" , token : token})
    }
    else{
        console.log("Invalid OTP")
        res.status(400).json({success: false , message : "Invalid OTP"})
    }
};