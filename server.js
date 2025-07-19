const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const formRoutes = require('./routes/forms');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// MongoDB Connection
mongoose.connect('mongodb+srv://abhi:abhi8820@cluster0.hlefiai.mongodb.net?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/forms', formRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});