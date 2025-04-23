import { useUserContext } from "../../context/UserContext";
import { useEffect, useState } from "react";
import api from "../../../api/api";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ElectricityData = () => {
  const { userId } = useUserContext();

  const [electricityUsageUsers, setElectrityUsageUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    fetchElectricityUsageUsers();
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
      {/* <Calendar 
        startDate={startDate} 
        setStartDate={setStartDate} 
        endDate={endDate} 
        setEndDate={setEndDate}
      /> */}
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
    </div>
  );
};
  
export default ElectricityData;
  