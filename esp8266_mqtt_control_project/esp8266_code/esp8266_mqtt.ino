#include <ESP8266WiFi.h>
#include <PubSubClient.h>

const char* ssid = "your_wifi";
const char* password = "your_password";
const char* mqtt_server = "192.168.1.100";

WiFiClient espClient;
PubSubClient client(espClient);

void setup_wifi() {
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) delay(500);
}

void callback(char* topic, byte* payload, unsigned int length) {
  String message;
  for (int i = 0; i < length; i++) message += (char)payload[i];
  if (message == "ON") digitalWrite(D1, HIGH);
  else if (message == "OFF") digitalWrite(D1, LOW);
}

void setup() {
  pinMode(D1, OUTPUT);
  setup_wifi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
  client.connect("esp8266-01");
  client.subscribe("home/device/esp8266-01/cmd");
}

void loop() {
  client.loop();
}
