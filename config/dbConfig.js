require('dotenv').config();
const mongoose = require('mongoose');

console.log('MongoDB URL:', process.env.MONGO_URL);


const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL ,{
    });
    console.log("MongoDB connected Successfully");
  } catch (error) {
    console.error(`Mongoose Connection Error :- ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
