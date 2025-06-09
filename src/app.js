const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes');
const protectedRoutes = require('./routes/protectedRoutes');
const usersRoutes = require('./routes/usersRoutes');
const rolesRouter = require('./routes/rolesRoutes');
const creditRoutes = require('./routes/creditRoutes');
const installmentRoutes = require('./routes/installmentRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();

app.use(morgan('dev'));

app.use(express.json());
app.use(cookieParser());

const NODE_ENV = process.env.NODE_ENV || 'development';

if (NODE_ENV === 'development') {
  app.use(cors({
    origin: 'http://localhost:3001',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
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
app.use('/api/roles', rolesRouter);
app.use('/api/credits', creditRoutes);
app.use('/api/installments', installmentRoutes);
app.use('/api/upload', uploadRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal en el servidor.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT} en modo ${NODE_ENV}`);
});