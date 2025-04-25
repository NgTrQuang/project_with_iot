import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

const Dashboard = () => {
  return (
    <div>
      <nav className="mb-4 text-sm text-gray-500">
        <Link to="/" className="text-blue-500 hover:underline">Home</Link> &gt; 
        <span className="text-gray-700 ml-1">Trang chủ</span>
      </nav>
      <h1 className='text-lg font-bold mb-4'>Trang chủ</h1>
      <p>Chào mừng đến với trang chủ</p>
      <ToastContainer/>
    </div>
  );
};

export default Dashboard;
