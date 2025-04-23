import { Link } from "react-router-dom";
import { useUserContext } from "../../context/UserContext";
import { useEffect, useState } from "react";
import api from "../../../api/api";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const TableCurrentData = () => {
  const { userId } = useUserContext();

  const [electricityUsageUsersCurrent, setElectrityUsageUserCurrent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchElectricityUsageUsersCurrent();
    }, 5 * 60 * 1000); // 5 phút = 5 * 60 * 1000 milliseconds
  
    // Gọi lần đầu ngay khi component được render
    fetchElectricityUsageUsersCurrent();
  
    // Dọn dẹp interval khi component bị unmount hoặc userId thay đổi
    return () => clearInterval(interval);
  }, [userId]);

  const fetchElectricityUsageUsersCurrent = async () => {
    try {
      const response = await api.get(`/api/electricity-usage/${userId}/current`);
      console.log(response?.data?.data);
      setElectrityUsageUserCurrent(response?.data?.data);
    } catch (error) {
      setError(error.response?.data?.message || "Lỗi khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <p>Đang tải dữ liệu...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      {/* Dòng điều hướng */}
      <nav className="mb-4 text-sm text-gray-500">
        <Link to="/" className="text-blue-500 hover:underline">Home</Link> &gt; 
        <span className="text-gray-700 ml-1">Quản lý điện dân dụng</span>
      </nav>
      {/* <h1>Quản lý điện dân dụng</h1> */}
      {/* Biểu đồ */}
      
      <h2 className="text-lg font-semibold mb-2">Dữ liệu cập nhật mỗi 5 phút</h2>
      <table className="text-sm min-w-full border-collapse border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left">Công suất tức thời</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Điện áp</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Dòng điện</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Tần số</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Tổng điện năng</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Mã thiết bị</th>
            <th className="border border-gray-300 px-4 py-2 text-center">Trạng thái thiết bị</th>
            <th className="border border-gray-300 px-4 py-2 text-center">Trạng thái kết nối mạng</th>
          </tr>
        </thead>
        <tbody>
          <tr className="hover:bg-gray-100">
            <td className="border border-gray-300 px-4 py-2">{electricityUsageUsersCurrent?.power} kWh</td>
            <td className="border border-gray-300 px-4 py-2">{electricityUsageUsersCurrent?.voltage} V</td>
            <td className="border border-gray-300 px-4 py-2">{electricityUsageUsersCurrent?.current} A</td>
            <td className="border border-gray-300 px-4 py-2">{electricityUsageUsersCurrent?.frequency} Hz</td>
            <td className="border border-gray-300 px-4 py-2">{electricityUsageUsersCurrent?.energy} kWh</td>
            <td className="border border-gray-300 px-4 py-2">{electricityUsageUsersCurrent?.deviceId?.deviceSerialNumber}</td>
            <td className="border border-gray-300 px-4 py-2 text-center">{electricityUsageUsersCurrent?.deviceId?.deviceStatus}</td>
            <td className="border border-gray-300 px-4 py-2 text-center">{electricityUsageUsersCurrent?.deviceId?.wifiStatus}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
  
export default TableCurrentData;
  