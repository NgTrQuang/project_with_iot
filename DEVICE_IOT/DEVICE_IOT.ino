#include <ESP8266WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>

const char* ssid = "Dien Mat Troi PHU HUNG";
const char* password = "phuhung$$";

const char* mqtt_server = "53052f65a6404b3b90d30c8b2fdcf5b1.s1.eu.hivemq.cloud";
const int mqtt_port = 8883;

// Username & Password của HiveMQ Cloud của bạn
const char* mqtt_user = "hivemq.webclient.1745053412141";
const char* mqtt_pass = "WR.aZBu?6tD0%4qk*5Ig";

WiFiClientSecure espClient;
PubSubClient client(espClient);

const char* deviceSerialNumber = "EM113";

void setup() {
  Serial.begin(115200);
  Serial.println("Khởi động thiết bị...");

  WiFi.begin(ssid, password);
  Serial.print("Đang kết nối WiFi");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi đã kết nối thành công");

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
    Serial.println("⚡ Đèn bật");
  } else if (message == "inactive") {
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
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
}
