const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", function connection(ws) {
  console.log("💡 Thiết bị vừa kết nối");

  // Gửi lệnh cho client (ESP8266)
  ws.send("active");

  ws.on("message", function incoming(message) {
    console.log("📩 ESP gửi:", message);
  });

  ws.on("close", () => {
    console.log("❌ Thiết bị ngắt kết nối");
  });
});

console.log("🚀 WebSocket server chạy tại ws://your-server-ip:8080");
