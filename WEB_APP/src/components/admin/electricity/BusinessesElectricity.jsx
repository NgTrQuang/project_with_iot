// Cần chỉnh sửa
import { Link } from "react-router-dom";
import { useUserContext } from "../../context/UserContext";
import { useEffect, useState } from "react";
import api from "../../../api/api";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const BusinessesElectricity = () => {
  const { user, userId } = useUserContext();

  const [electricityUsageUsers, setElectrityUsageUsers] = useState([]);
  const [electricityUsageUsersCurrent, setElectrityUsageUserCurrent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchElectricityUsageUsers();
    fetchElectricityUsageUsersCurrent();
  }, [userId]);

  const fetchElectricityUsageUsers = async () => {
    try {
      const response = await api.get(`/api/electricity-usage/${userId}`);
      console.log(response?.data?.data);
      setElectrityUsageUsers(response?.data?.data);
    } catch (error) {
      setError(error.response?.data?.message || "Lỗi khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  } 

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
  // Biểu đồ dữ liệu
  
  const chartData = (data, label, color) => {

    const sortedData = data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    return {
      labels: sortedData.map(record => new Date(record?.timestamp).toLocaleTimeString()), // Sử dụng thời gian làm nhãn
      datasets: [
        {
          label: label,
          data: data.map(record => record[label.toLowerCase()]), // Công suất
          borderColor: color,
          backgroundColor: `${color}80`,
          fill: true,
        }
      ]
    };
  };

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
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Biểu đồ công suất */}
        <div className="col-span-1">
          {/* <h2 className="text-lg font-semibold mb-2">Biểu đồ Công suất sử dụng</h2> */}
          <Line data={chartData(electricityUsageUsers, 'Power', 'rgba(75, 192, 192, 1)')} options={{
            responsive: true,
            plugins: {
              title: { display: true, text: 'Biểu đồ Công suất sử dụng' },
              tooltip: { mode: 'index', intersect: false },
            },
          }} />
        </div>

        {/* Biểu đồ điện áp */}
        <div className="col-span-1">
          {/* <h2 className="text-lg font-semibold mb-2">Biểu đồ Điện áp</h2> */}
          <Line data={chartData(electricityUsageUsers, 'Voltage', 'rgba(255, 99, 132, 1)')} options={{
            responsive: true,
            plugins: {
              title: { display: true, text: 'Biểu đồ Điện áp' },
              tooltip: { mode: 'index', intersect: false },
            },
          }} />
        </div>

        {/* Biểu đồ dòng điện */}
        <div className="col-span-1">
          {/* <h2 className="text-lg font-semibold mb-2">Biểu đồ Dòng điện</h2> */}
          <Line data={chartData(electricityUsageUsers, 'Current', 'rgba(153, 102, 255, 1)')} options={{
            responsive: true,
            plugins: {
              title: { display: true, text: 'Biểu đồ Dòng điện' },
              tooltip: { mode: 'index', intersect: false },
            },
          }} />
        </div>

        {/* Biểu đồ năng lượng */}
        <div className="col-span-1">
          {/* <h2 className="text-lg font-semibold mb-2">Biểu đồ Năng lượng</h2> */}
          <Line data={chartData(electricityUsageUsers, 'Energy', 'rgba(255, 159, 64, 1)')} options={{
            responsive: true,
            plugins: {
              title: { display: true, text: 'Biểu đồ Năng lượng' },
              tooltip: { mode: 'index', intersect: false },
            },
          }} />
        </div>
      </div>
      {/* Bảng */}
      {/* <table className="text-sm min-w-full border-collapse border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left">Username</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Thông tin</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Mã thiết bị</th>
            <th className="border border-gray-300 px-4 py-2 text-center">Trạng thái thiết bị</th>
            <th className="border border-gray-300 px-4 py-2 text-center">Trạng thái kết nối mạng</th>
          </tr>
        </thead>
        <tbody>
          {electricityUsageUsers.map((record) => (
            <tr key={record._id} className="hover:bg-gray-100">
              <td className="border border-gray-300 px-4 py-2">{user.username}</td>
              <td className="border border-gray-300 px-4 py-2">
                Thời gian: {new Date(record?.timestamp).toLocaleString()} <br />
                Công suất: {record?.power} kWh <br />
                Điện thế: {record?.voltage} V <br />
                Điện áp: {record?.current} A <br />
                Năng lượng: {record?.energy}
              </td>
              <td className="border border-gray-300 px-4 py-2">{record?.deviceId?.deviceSerialNumber}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{record?.deviceId?.deviceStatus}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{record?.deviceId?.wifiStatus}</td>
            </tr>
          ))}
        </tbody>
      </table> */}
    </div>
  );
};
  
export default BusinessesElectricity;
  