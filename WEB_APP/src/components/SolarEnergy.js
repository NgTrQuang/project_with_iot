import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUserContext } from './context/UserContext';
import api from "../api/api";

const SolarEnergy = () => {
  const { userId } = useUserContext();
  const [devices, setDevices ] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDevices();
  }, [userId]);

  const fetchDevices = async () => {
    try {
      const response = await api.get(`/api/devices`);
      console.log(response?.data?.data);
      setDevices(response?.data?.data);
    } catch (error) {
      setError(error.response?.data?.message || "Lỗi khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  // Hàm điều khiển thiết bị
  const controlDevice = (deviceSerialNumber, deviceStatus) => {
    console.log(`Điều khiển thiết bị ${deviceSerialNumber} sang trạng thái ${deviceStatus}`);
    
    // Ở đây ta sẽ call API đến backend để điều khiển thiết bị
    fetch("http://localhost:3000/api/test/control-device", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        deviceSerialNumber,
        deviceStatus,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Kết quả từ server:", data);
      })
      .catch((error) => {
        console.error("Lỗi khi gửi lệnh:", error);
      });
  };

  return (
    <div>
      <nav className="mb-4 text-sm text-gray-500">
        <Link to="/" className="text-blue-500 hover:underline">Home</Link> &gt; 
        <span className="text-gray-700 ml-1">Năng lượng mặt trời</span>
      </nav>
      {/* <h1>Cài đặt</h1>  deviceSerialNumber: EM113*/}
      <p>Test điều khiển thiết bị từ xa</p>
      <button 
        onClick={() => controlDevice(devices[0].deviceSerialNumber, 'active')}
        className="bg-green-500 text-white px-4 py-2 rounded mr-2"
      >
        Bật đèn
      </button>

      <button 
        onClick={() => controlDevice(devices[0].deviceSerialNumber, 'inactive')}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Tắt đèn
      </button>
    </div>
  );
};

export default SolarEnergy;
  