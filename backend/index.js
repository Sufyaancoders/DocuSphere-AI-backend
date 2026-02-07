require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');

const mongoose = require('./config/database');
mongoose.connectDB();

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://your-frontend-domain.vercel.app', // Add your Vercel domain
    'https://your-custom-domain.com',
    'https://docu-sphere-ai.vercel.app', // Add any custom domains
  ], // adjust to your frontend URL/port
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use("/api/v1", require("./routes/user"));
app.use("/api/v1/gemini", require("./routes/assistant"));

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
