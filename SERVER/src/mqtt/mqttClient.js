const mqtt = require("mqtt");

// Cấu hình kết nối HiveMQ Cloud
const options = {
  port: 8883,     // 8883
  host: "53052f65a6404b3b90d30c8b2fdcf5b1.s1.eu.hivemq.cloud", // 192.168.2.12 ip của máy chủ server cần cấu hình mosquitto   // "53052f65a6404b3b90d30c8b2fdcf5b1.s1.eu.hivemq.cloud"
  protocol: "mqtts", // dùng mqtts khi cổng 8883 (TLS)
  username: "hivemq.webclient.1745053412141",
  password: "WR.aZBu?6tD0%4qk*5Ig",
};

const client = mqtt.connect(options);

client.on("connect", () => {
  console.log("✅ Backend kết nối MQTT HiveMQ Cloud thành công");    // HiveMQ Cloud
});

client.on("error", (err) => {
  console.error("❌ Lỗi kết nối MQTT:", err);
});

module.exports = client;
