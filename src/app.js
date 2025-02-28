const express = require('express');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser'); 
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});