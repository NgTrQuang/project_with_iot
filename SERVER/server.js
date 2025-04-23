const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const mqttClient = require('./src/mqtt/mqttClient');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const businessRoutes = require('./src/routes/businessRoutes');
const roleRoutes = require('./src/routes/roleRoutes');
const deviceRoutes = require('./src/routes/deviceRoutes');
const electricityUsageRoutes = require('./src/routes/electricityUsageRoutes');
const bankAccountRoutes = require('./src/routes/bankAccountRoutes');
const testController = require('./src/routes/testRoutes');

dotenv.config();
connectDB();

const app = express();

const allowedOrigins = ['http://localhost:3001'];

app.use(express.json());
app.use(cookieParser());
// app.use(cors());
app.use(cors({
  origin: allowedOrigins, // Chỉ định frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Chỉ cho phép các phương thức cần thiết
  allowedHeaders: ['Content-Type', 'Authorization'], // Chỉ các header cần thiết
  // exposedHeaders: ['Content-Length'], // Các header có thể được truy cập từ frontend
  credentials: true, // Nếu sử dụng cookie
  // optionsSuccessStatus: 200 // Mã trạng thái cho preflight requests
}));

app.post('/device/:id/control', (req, res) => {
  const deviceId = req.params.id;
  const { status } = req.body;

  const topic = `home/device/${deviceId}/cmd`;
  mqttClient.publish(topic, status);
  
  res.json({ message: `Đã gửi ${status} đến thiết bị ${deviceId}` });
});

// Định nghĩa các route
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/businesses', businessRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/electricity-usage', electricityUsageRoutes);
app.use('/api/bank-account', bankAccountRoutes);
app.use('/api/test', testController);

const PORT = process.env.PORT;
app.listen(PORT, () => {                    //  '0.0.0.0',
  console.log(`Server running on http://localhost:${PORT}`);
});
