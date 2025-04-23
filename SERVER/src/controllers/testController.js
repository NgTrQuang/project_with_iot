const client = require ("../mqtt/mqttClient");

exports.controlDevice = (req, res) => {
    const { deviceSerialNumber, deviceStatus } = req.body;
  
    if (!deviceSerialNumber || !deviceStatus) {
      return res.status(400).json({ message: "Thiếu tham số deviceSerialNumber hoặc status" });
    }
  
    const topic = `home/device/${deviceSerialNumber}`;
  
    client.publish(topic, deviceStatus, () => {
      console.log(`📡 Gửi lệnh ${deviceStatus} đến thiết bị ${deviceSerialNumber}`);
      res.json({ message: `Đã gửi lệnh ${deviceStatus} đến thiết bị ${deviceSerialNumber}` });
    });
};