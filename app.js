const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/dbConfig');
const uploadRoutes = require('./routes/routes'); // Correctly import router

const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: '*' }));

connectDB(); // Connect to the database

// Use router with a base path
app.use(uploadRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get('/', async (req, res) => {
  res.send('Hello from BookBazaar');
});
