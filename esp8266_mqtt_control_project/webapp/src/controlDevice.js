import mqtt from "mqtt";
import axios from "axios";

const client = mqtt.connect("ws://192.168.1.100:9001");

export const controlDevice = (userId, deviceId, action) => {
  client.publish(`home/device/${deviceId}/cmd`, action);
  axios.post("http://192.168.1.100:3000/api/control-log", {
    user_id: userId,
    device_id: deviceId,
    action: action,
    time: new Date().toISOString()
  });
};
