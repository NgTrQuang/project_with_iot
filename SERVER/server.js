const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const businessRoutes = require('./src/routes/businessRoutes');
const roleRoutes = require('./src/routes/roleRoutes');
const deviceRoutes = require('./src/routes/deviceRoutes');
const electricityUsageRoutes = require('./src/routes/electricityUsageRoutes');
const bankAccountRoutes = require('./src/routes/bankAccountRoutes');
const testController = require('./src/routes/testRoutes');
// deploy
const path = require('path');

dotenv.config();
connectDB();

const app = express();

const allowedOrigins = ['https://project-with-iot.onrender.com', 'http://localhost:5173', 'http://localhost:3001'];

app.use(express.json());
app.use(cookieParser());

// Chỉ bật CORS trong môi trường phát triển
app.use(cors({
  origin: function (origin, callback) {
    // Cho phép nếu origin nằm trong danh sách hoặc không có origin (vd: curl, Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Chỉ cho phép các phương thức cần thiết
  allowedHeaders: ['Content-Type', 'Authorization'], // Chỉ các header cần thiết
  // exposedHeaders: ['Content-Length'], // Các header có thể được truy cập từ frontend
  credentials: true, // Nếu sử dụng cookie
  // optionsSuccessStatus: 200 // Mã trạng thái cho preflight requests
}));

if (process.env.NODE_ENV === 'production') {
  console.log('Running in production mode');
}

// Định nghĩa các route
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/businesses', businessRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/electricity-usage', electricityUsageRoutes);
app.use('/api/bank-account', bankAccountRoutes);
app.use('/api/test', testController);

// Health check cho Render
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Serve React build nếu là production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../WEB_APP/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../WEB_APP', 'build', 'index.html'));
  });
}

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {                    //  '0.0.0.0',
  console.log(`Server running on http://localhost:${PORT}`);
});
