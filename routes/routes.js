const express = require('express');
const Login = require('../controller/LoginController')
const Payment = require("../controller/paymentController")
const router = express.Router();



// Route for fetching books
router.get('/books', Payment.getBooks);

// // Route for serving files
// router.get('/files/:id', getFile);


router.post("/login",Login.Login)

router.post("/resend-otp", Login.resendOtp);

router.post("/validate-otp" ,Login.ValidateOtp)


router.post("/payment",Payment.initiatePayment)
router.post("/orders",Payment.getOrders)

module.exports = router;