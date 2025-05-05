#include <ESP8266WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WebServer.h>
#include <SoftwareSerial.h>
#include <ModbusMaster.h>
#include <ArduinoJson.h>
#include "LittleFS.h"

#define CONFIG_FILE "/config.json"

#define RX_PIN 14  // GPIO14 (D5 trên NodeMCU)
#define TX_PIN 12  // GPIO12 (D6 trên NodeMCU)
#define RE_DE_PIN 4     // GPIO4 (D2 trên NodeMCU)
#define RE_RE_PIN 5     // GPIO5 (D1 trên NodeMCU)

#define METER_ADDRESS 0x00

int ledPin = 2;

// Thông tin Access Point mà ESP8266 phát ra
const char* apSSID = "ESP_Config";
const char* apPassword = "12345678";  // Ít nhất 8 ký tự

String serverAddress = "bill.hpkvietnam.vn";
String endpoint = "/api/webhooks/hpk6868vi/receive";

// Biến lưu thông tin WiFi cấu hình
String wifiSSID = "";
String wifiPass = "";

struct Config {
    String ssid;
    String password;
    String server;              // ip wan thiết bị khi đã kết nối với wifi thành công
    String busCode;
    String busName;
    String signature;
    String deviceSerialNumber;  // id name của thiết bị ví dụ: EM113+MST, EM114+MST, ...

    String ip;          // IP tĩnh (VD: 192.168.1.241)
    String gateway;     // "192.168.1.1"
    String subnet;      // "255.255.255.0"
    String dns;         // "8.8.8.8"
    String dnsSecond;   // "8.8.4.4"
    int port;           // 26868
} config;   

const char* ssid = "Dien Mat Troi PHU HUNG";
const char* password = "phuhung$$";

const char* mqtt_server = "53052f65a6404b3b90d30c8b2fdcf5b1.s1.eu.hivemq.cloud";
const int mqtt_port = 8883;

// Username & Password của HiveMQ Cloud của bạn
const char* mqtt_user = "hivemq.webclient.1745053412141";
const char* mqtt_pass = "WR.aZBu?6tD0%4qk*5Ig";

// Lệnh bật/tắt (như bên Python)
const byte switchOnCommand[]  = {0x00, 0x10, 0x00, 0x10, 0x00, 0x01, 0x02, 0x55, 0x55, 0x56, 0x3F};
const byte switchOffCommand[] = {0x00, 0x10, 0x00, 0x10, 0x00, 0x01, 0x02, 0xAA, 0xAA, 0x57, 0x8F};

const unsigned long interval = 20000; // 20 seconds
unsigned long previousMillis = 0;

ESP8266WebServer server(80);

SoftwareSerial RS485Serial(RX_PIN, TX_PIN);  // UART giả lập để giao tiếp RS485
ModbusMaster node;

WiFiClientSecure espClient;
PubSubClient client(espClient);

const char* deviceSerialNumber = "EM113"; // tạm thời cấu hình cứng tại thiết bị

// Đọc dữ liệu cho form ban đầu
void loadConfig() {
    if (!LittleFS.exists(CONFIG_FILE)) {
        Serial.println("⚠️ Không tìm thấy config, dùng mặc định.");
        return;
    }

    File configFile = LittleFS.open(CONFIG_FILE, "r");
    if (!configFile) {
        Serial.println("⚠️ Mở file config thất bại.");
        return;
    }

    StaticJsonDocument<512> doc;
    DeserializationError error = deserializeJson(doc, configFile);
    if (error) {
        Serial.println("⚠️ Lỗi đọc JSON.");
        Serial.println(error.c_str());  // <-- In rõ lý do lỗi
        return;
    }

    config.ssid      = String(doc["ssid"]      | "");
    config.password  = String(doc["password"]  | "");
    config.ip        = String(doc["ip"]        | "192.168.1.241");
    config.gateway   = String(doc["gateway"]   | "192.168.1.1");
    config.subnet    = String(doc["subnet"]    | "255.255.255.0");
    config.dns       = String(doc["dns"]       | "8.8.8.8");
    config.port      = doc["port"]             | 26868;
    config.server    = String(doc["server"]    | "");
    config.busCode   = String(doc["busCode"]   | "");
    config.busName   = String(doc["busName"]   | "");
    config.signature = String(doc["signature"] | "");


    configFile.close();

    Serial.println("📖 Đã tải config:");
    Serial.println("SSID: " + config.ssid);
    Serial.println("Password: " + config.password);
    Serial.println("IP Address: " + config.ip);
    Serial.println("Gateway: " + config.gateway);
    Serial.println("Subnet mask: " + config.subnet);
    Serial.println("DNS Server: " + config.dns);
    Serial.println("Server port: " + String(config.port));
    Serial.println("Server ip WAN: " + config.server);
    Serial.println("Bus Code/Username: " + config.busCode);
    Serial.println("Bus Name: " + config.busName);
    Serial.println("Signature: " + config.signature);
}

// Hàm thiết lập AP mode
void startAP() {
    WiFi.softAP(apSSID, apPassword);
    IPAddress IP = WiFi.softAPIP();
    Serial.print("📡 AP IP Address: ");
    Serial.println(IP);
}

// Hàm thiết lập WiFi Station mode để kết nối WiFi
void connectWiFi(const char* ssid, const char* password) {
    Serial.println("\n🔍 Bắt đầu kết nối WiFi...");
    IPAddress local_IP, gateway, subnet, dns;

    if (ssid != "" && password != ""
        && local_IP.fromString(config.ip) 
        && gateway.fromString(config.gateway) 
        && subnet.fromString(config.subnet) 
        && dns.fromString(config.dns)) {

        WiFi.begin(ssid, password);
        // cấu hình tạo IP tĩnh chưa phát triển
        // IPAddress local_IP(192.168.1.241);
        // IPAddress gateway(192.168.1.1);
        // IPAddress subnet(255.255.255.0);
        // IPAddress primaryDNS(8.8.8.8); // Google DNS
        // IPAddress secondaryDNS(8.8.4.4); nếu cần fromstring đã giúp chuyển về dạng (0,0,0,0) từ 1 chuỗi

        // WiFi.config(local_IP, gateway, subnet, primaryDNS, secondaryDNS);

        // WiFi.config(local_IP, gateway, subnet, dns);

        Serial.print("🔗 Đang kết nối tới WiFi: ");
        Serial.println(ssid);

        unsigned long startAttemptTime = millis();
        const unsigned long wifiTimeout = 10000; // 10 giây timeout

        while (WiFi.status() != WL_CONNECTED && millis() - startAttemptTime < wifiTimeout) {
            Serial.print(".");
            delay(500);
        }

        if (WiFi.status() == WL_CONNECTED) {
            Serial.println("\n✅ Kết nối thành công!");
            Serial.print("📶 IP Address: ");
            Serial.println(WiFi.localIP());
            return;
        } else {
            Serial.println("\n❌ Kết nối thất bại. Bật lại AP.");
            startAP();
        }
    }
    // Nếu không có config hoặc kết nối thất bại
    Serial.println("📡 Bật Access Point mặc định: ESP_Config");
    WiFi.softAP("ESP_Config");
    Serial.println("📶 IP AP: " + WiFi.softAPIP().toString());
}

// Get ip wan
void getPublicIP() {
    if (WiFi.status() == WL_CONNECTED) {
        HTTPClient http;
        WiFiClientSecure client;

        client.setInsecure();  // Bỏ kiểm tra chứng chỉ SSL (cho đơn giản)

        http.begin(client, "https://api.ipify.org/");
        int httpCode = http.GET();

        if (httpCode > 0) {
            String payload = http.getString();
            Serial.print("🌐 Public IP của thiết bị là: ");
            Serial.println(payload);
            config.server = payload;
            updateFieldConfig("server", payload.c_str());
        } else {
            Serial.print("❌ Lỗi khi lấy Public IP: ");
            Serial.println(http.errorToString(httpCode).c_str());
        }

        http.end();
    } else {
        Serial.println("⚠️ Chưa kết nối WiFi.");
    }
}

// Giao diện HTML đơn giản cho trang config
void handleConfigPage() {
    String html = R"rawliteral(
    <!DOCTYPE html>
    <html lang="vi">
    <head>
        <meta charset="UTF-8">
        <title>Cấu hình thiết bị</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f0f8ff;
                padding: 40px;
                color: #333;
            }
            h2 {
                color: #007BFF;
                text-align: center;
            }
            form {
                max-width: 500px;
                margin: 0 auto;
                background: #fff;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }
            label {
                display: block;
                margin-top: 15px;
                font-weight: bold;
            }
            input[type='text'],
            input[type='password'] {
                width: 100%;
                padding: 10px;
                margin-top: 5px;
                border: 1px solid #ccc;
                border-radius: 5px;
                box-sizing: border-box;
            }
            input[type='submit'] {
                margin-top: 20px;
                background-color: #007BFF;
                color: white;
                border: none;
                padding: 12px 20px;
                font-size: 16px;
                border-radius: 5px;
                cursor: pointer;
                width: 100%;
            }
            input[type='submit']:hover {
                background-color: #0056b3;
            }
            .back-link {
                text-align: center;
                margin-top: 20px;
            }
            .back-link a {
                text-decoration: none;
                color: #007BFF;
            }
            .back-link a:hover {
                text-decoration: underline;
            }
        </style>
    </head>
    <body>
        <h2>🔧 Device Configuration</h2>
        <form action="/save-config" method="POST">
            <label for="ssid">WiFi SSID:</label>
            <input type="text" id="ssid" name="ssid" value=")rawliteral" + config.ssid + R"rawliteral(" required>

            <label for="password">WiFi Password:</label>
            <input type="text" id="password" name="password" value=")rawliteral" + config.password + R"rawliteral(" required>

            <label for="ip">IP Address:</label>
            <input type="text" id="ip" name="ip" value=")rawliteral" + config.ip + R"rawliteral(">

            <label for="gateway">Gateway:</label>
            <input type="text" id="gateway" name="gateway" value=")rawliteral" + config.gateway + R"rawliteral(">

            <label for="subnet">Subnet mask:</label>
            <input type="text" id="subnet" name="subnet" value=")rawliteral" + config.subnet + R"rawliteral(">

            <label for="dns">DNS Server:</label>
            <input type="text" id="dns" name="dns" value=")rawliteral" + config.dns + R"rawliteral(">

            <label for="port">Server Port:</label>
            <input type="number" id="port" name="port" value=")rawliteral" + config.port + R"rawliteral(" min="1" max="65535">

            <label for="server">IP WAN Current:</label>
            <input type="text" id="server" name="server" value=")rawliteral" + config.server + R"rawliteral(">

            <label for="busCode">Bus Code/ Username:</label>
            <input type="text" id="busCode" name="busCode" value=")rawliteral" + config.busCode + R"rawliteral(">

            <label for="busName">Bus Name:</label>
            <input type="text" id="busName" name="busName" value=")rawliteral" + config.busName + R"rawliteral(">

            <label for="signature">Signature:</label>
            <input type="text" id="signature" name="signature" value=")rawliteral" + config.signature + R"rawliteral(">

            <input type="submit" value="💾 Save">
        </form>

        <div class="back-link">
            <p><a href="/">← Go to back</a></p>
        </div>
    </body>
    </html>
    )rawliteral";

    server.send(200, "text/html; charset=UTF-8", html);
}

// Xử lý khi người dùng gửi thông tin WiFi
void handleSaveConfig() {
    if (server.method() != HTTP_POST) {
        server.send(405, "text/plain", "Phương thức không hỗ trợ");
        return;
    }

    String newSsid      = server.arg("ssid");
    String newPass      = server.arg("password");
    String newIp        = server.arg("ip");
    String newGateway   = server.arg("gateway");
    String newSubnet    = server.arg("subnet");
    String newDns       = server.arg("dns");
    int newPort         = server.arg("port").toInt();
    String newServer    = server.arg("server");
    String newBusCode   = server.arg("busCode");
    String newBusName   = server.arg("busName");
    String newSignature = server.arg("signature");

    Serial.println("📥 Nhận cấu hình mới:");
    Serial.println("SSID: " + newSsid);
    Serial.println("Password: " + newPass);
    Serial.println("Ip Address: " + newIp);
    Serial.println("Gateway: " + newGateway);
    Serial.println("Subnet mask: " + newSubnet);
    Serial.println("DNS server: " + newDns);
    Serial.println("Server port");
    Serial.println("Server: " + newServer);
    Serial.println("Bus Code: " + newBusCode);
    Serial.println("Bus Name: " + newBusName);
    Serial.println("Signature: " + newSignature);

    // 📌 Ở đây có thể lưu vào EEPROM hoặc file JSON trên LittleFS
    StaticJsonDocument<256> doc;
    doc["ssid"]         = newSsid;
    doc["password"]     = newPass;
    doc["ip"]           = newIp;
    doc["gateway"]      = newGateway;
    doc["subnet"]       = newSubnet;
    doc["dns"]          = newDns;
    doc["port"]         = newPort;
    doc["server"]       = newServer;
    doc["busCode"]      = newBusCode;
    doc["busName"]      = newBusName;
    doc["signature"]    = newSignature;

    File configFile = LittleFS.open(CONFIG_FILE, "w");
    if (!configFile) {
        server.send(500, "text/plain", "Lỗi ghi file config");
        return;
    }

    serializeJson(doc, configFile);
    configFile.close();

    server.send(200, "text/html; charset=UTF-8", "<p>Đã lưu cấu hình. Khởi động lại thiết bị để áp dụng.</p><a href='/wifi.htm'>Quay lại</a>");
    delay(1000);
    ESP.restart();
}

// Cập nhật config 
void updateFieldConfig(const char* key, const char* value) {
    if (!LittleFS.exists("/config.json")) {
        Serial.println("⚠️ File config chưa tồn tại.");
        return;
    }

    File file = LittleFS.open("/config.json", "r");
    if (!file) {
        Serial.println("❌ Không thể mở file config để đọc!");
        return;
    }

    StaticJsonDocument<512> doc;
    DeserializationError error = deserializeJson(doc, file);
    file.close();

    if (error) {
        Serial.println("❌ Lỗi khi parse config file!");
        return;
    }

    // Cập nhật giá trị field
    doc[key] = value;

    // Ghi lại file
    file = LittleFS.open("/config.json", "w");
    if (!file) {
        Serial.println("❌ Không thể mở file config để ghi!");
        return;
    }

    serializeJson(doc, file);
    file.close();

    Serial.println("✅ Đã cập nhật giá trị trong config!");
}

// Hàm kiểm tra Internet (đã sửa lỗi HTTPClient::begin) // chưa past qua V3
void testInternet() {
    if (WiFi.status() != WL_CONNECTED) {
        Serial.println("⚠️ WiFi chưa kết nối!");
        return;
    }

    Serial.println("🌐 Kiểm tra kết nối Internet...");
    Serial.print("IP: "); Serial.println(WiFi.localIP());                   // Địa chỉ IP của ESP8266 trong mạng WiFi hiện tại.
    updateFieldConfig("ip", WiFi.localIP().toString().c_str());

    Serial.print("Gateway: "); Serial.println(WiFi.gatewayIP());            // Địa chỉ IP của Gateway (thường là router trong mạng).
    updateFieldConfig("gateway", WiFi.gatewayIP().toString().c_str());

    Serial.print("DNS: "); Serial.println(WiFi.dnsIP());                    // Địa chỉ IP của DNS server.
    updateFieldConfig("dns", WiFi.dnsIP().toString().c_str());

    Serial.print("MAC Address: "); Serial.println(WiFi.macAddress());       // Địa chỉ MAC của ESP8266 (có thể dùng để nhận dạng thiết bị).
    Serial.print("SSID: "); Serial.println(WiFi.SSID());                    // Tên của mạng WiFi mà ESP8266 đang kết nối.
    // In địa chỉ MAC của Access Point
    uint8_t* bssid = WiFi.BSSID();
    Serial.print("BSSID: ");
    for (int i = 0; i < 6; i++) {
        if (i > 0) {
            Serial.print(":");
        }
        // In mỗi byte dưới dạng thập lục phân và chuyển sang chữ thường
        if (bssid[i] < 16) {
            Serial.print("0");  // Đảm bảo in đủ 2 chữ số với giá trị nhỏ hơn 16
        }
        Serial.print(bssid[i], HEX);  // In từng byte ở dạng thập lục phân
    }
    Serial.println();

    Serial.print("Channel: "); Serial.println(WiFi.channel());              // Kênh WiFi mà Access Point sử dụng.
    Serial.print("RSSI: "); Serial.println(WiFi.RSSI());                    // Độ mạnh tín hiệu (Received Signal Strength Indicator)
    Serial.print("IP Subnet Mask: "); Serial.println(WiFi.subnetMask());    // Subnet mask của mạng WiFi.
    // Kiểm tra trạng thái DHCP dựa trên địa chỉ IP hợp lệ
    if (WiFi.localIP() != (IPAddress(0, 0, 0, 0))) {
        Serial.println("DHCP Status: Enabled");
    } else {
        Serial.println("DHCP Status: Disabled");
    }

    WiFiClient client;
    HTTPClient http;

    http.begin(client, "http://neverssl.com"); // ip của gg "http://142.250.72.36"

    int httpCode = http.GET();
    if (httpCode > 0) {
        Serial.println("✅ Kết nối Internet OK!");
    } else {
        Serial.println("❌ Không có Internet!");
    }
    http.end();
}

// Hàm kiểm tra kết nối đến server
bool testConnection() {
    WiFiClient client;
    if (client.connect(serverAddress.c_str(), 8000)) {
      client.stop();
      return true;
    } else {
      return false;
    }
}

void preTransmission() {
    digitalWrite(RE_DE_PIN, HIGH); // Bật chế độ truyền
    digitalWrite(RE_RE_PIN, HIGH); // Bật chế độ truyền
}

void postTransmission() {
    digitalWrite(RE_DE_PIN, LOW);  // Quay lại chế độ nhận
    digitalWrite(RE_RE_PIN, LOW);  // Quay lại chế độ nhận
}

// send lệnh đến thiết bị 
void sendModbusCommand(const byte *command, int length) {
  preTransmission();
  RS485Serial.write(command, length);
  RS485Serial.flush();  // Đảm bảo gửi xong

  delay(10);     // Delay 0.01s để chờ phản hồi
  postTransmission();
  delay(100);

  while (RS485Serial.available() > 0) {
    byte response = RS485Serial.read();
    Serial.print("Received: ");
    Serial.println(response, HEX);
  }
}

// Đóng
void handleTurnOnLed() {
  sendModbusCommand(switchOnCommand, sizeof(switchOnCommand));
}
// Ngắt
void handleTurnOffLed() {
  sendModbusCommand(switchOffCommand, sizeof(switchOffCommand));
}

void setup() {
    Serial.begin(115200);

    if (!LittleFS.begin()) {
        Serial.println("⚠️ Không khởi động được LittleFS");
        return;
    }

    loadConfig();
    // server = ESP8266WebServer(config.port);
    // Bật AP
    startAP();
    Serial.println("Access Point đã bật. Kết nối WiFi với tên 'ESP_Config'");

    // Cấu hình GPIO sau khi kết nối WiFi
    pinMode(ledPin, OUTPUT);
    digitalWrite(ledPin, HIGH);

    WiFi.mode(WIFI_AP_STA);

    // Gọi hàm connectWiFi với config.ssid và config.password
    connectWiFi(config.ssid.c_str(), config.password.c_str());

    testInternet(); 

    getPublicIP();

    RS485Serial.begin(9600);  // Baudrate của đồng hồ
    Serial.println("✅ Khởi tạo RS485 Serial xong");

    pinMode(RE_DE_PIN, OUTPUT);
    pinMode(RE_RE_PIN, OUTPUT);
    
    postTransmission();
    
    Serial.println("📡 Đang cấu hình ModbusMaster...");
    // Gán địa chỉ thiết bị và cổng truyền
    node.begin(METER_ADDRESS, RS485Serial);  // Địa chỉ Modbus của đồng hồ là 0x00
    node.preTransmission(preTransmission);
    node.postTransmission(postTransmission);

    Serial.println("🔌 Đang kiểm tra kết nối Modbus...");

    // Đọc thử 2 thanh ghi đầu tiên
    uint8_t result = node.readInputRegisters(0x0000, 2);

    delay(1000);

    if (result == node.ku8MBSuccess) {
        Serial.println("✅ Kết nối thành công với thiết bị.");
    } else {
        Serial.println("❌ Không thể kết nối tới thiết bị. Kiểm tra dây nối và địa chỉ.");
        Serial.print("📟 Mã lỗi: ");
        Serial.println(result);
    }  

    // Thiết lập webserver
    server.on("/wifi.htm", HTTP_GET, handleConfigPage);

    server.on("/save-config", HTTP_POST, handleSaveConfig);
    
    server.begin();
    Serial.println("🌐 Webserver đã khởi động");

    // Tạm thời tắt verify cert cho dễ dev
    espClient.setInsecure();

    client.setServer(mqtt_server, mqtt_port);
    client.setCallback(callback);

    Serial.println("Đang kết nối đến MQTT Cloud...");

    while (!client.connected()) {
        Serial.print("Kết nối MQTT...");
        // Thêm username/password
        if (client.connect(deviceSerialNumber, mqtt_user, mqtt_pass)) {
        Serial.println(" Thành công");
        String subTopic = "home/device/" + String(deviceSerialNumber);
        client.subscribe(subTopic.c_str());
        Serial.print("Đã subscribe topic: ");
        Serial.println(subTopic);
        } else {
        Serial.print(" Thất bại, lỗi code: ");
        Serial.print(client.state());
        Serial.println(" thử lại sau 5s");
        delay(5000);
        }
    }
}

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("\n📩 Tin nhắn từ [");
  Serial.print(topic);
  Serial.print("]: ");

  String message;
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  Serial.println(message);

  if (message == "active") {
    handleTurnOnLed();
    Serial.println("⚡ Đèn bật");
  } else if (message == "inactive") {
    handleTurnOffLed();
    Serial.println("💤 Đèn tắt");
  } else {
    Serial.println("❓ Lệnh không hợp lệ");
  }
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Đang reconnect MQTT...");
    if (client.connect(deviceSerialNumber, mqtt_user, mqtt_pass)) {
      Serial.println(" Thành công");
      String subTopic = "home/device/" + String(deviceSerialNumber);
      client.subscribe(subTopic.c_str());
    } else {
      Serial.print(" Thất bại, lỗi: ");
      Serial.println(client.state());
      delay(5000);
    }
  }
}

void loop() {
  server.handleClient();
  Serial.println("Chạy vòng lặp kết nối...");
  digitalWrite(ledPin, LOW);
  delay(1000);
  digitalWrite(ledPin, HIGH);
  delay(1000);

  unsigned long currentMillis = millis();

  if (currentMillis - previousMillis >= interval) {
      previousMillis = currentMillis;
      if (testConnection()) {
          Serial.println("Kết nối đến server thành công!");
          // setupDataSend("03", "0043440", "0002000", "0021720");
      } else{
          Serial.println("Không thể kết nối đến server 8000!");
      }
  }

  if (!client.connected()) {
    reconnect();
  }
  client.loop();
}
