const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan'); 

const authRoutes = require('./routes/authRoutes');
const protectedRoutes = require('./routes/protectedRoutes');
const usersRoutes = require('./routes/usersRoutes');

const app = express();

app.use(morgan('dev'));

app.use(express.json());
app.use(cookieParser());

const NODE_ENV = process.env.NODE_ENV || 'development';

if (NODE_ENV === 'development' || NODE_ENV === 'local') {
  app.use(cors({
    origin: 'http://localhost:3001',
    credentials: true,
  }));
} else {
  app.use(cors({
    origin: process.env.FRONTEND_URL, 
    credentials: true,
  }));
}

app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);
app.use('/api/users', usersRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack); 
  res.status(500).json({ error: 'Algo salió mal en el servidor.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT} en modo ${NODE_ENV}`);
});