import { Link } from 'react-router-dom';
import { useUserContext } from './context/UserContext';

const Notifications = () => {
  const { user } = useUserContext();
  const trialExpirationDate = user.trialExpirationDate 
  ? new Date(user.trialExpirationDate).toLocaleString('vi-VN') 
  : null

  return (
    <div>
      <nav className="mb-4 text-sm text-gray-500">
        <Link to="/" className="text-blue-500 hover:underline">Home</Link> &gt; 
        <span className="text-gray-700 ml-1">Thông báo</span>
      </nav>
      <h1 className="text-lg font-bold mb-4">Thông báo</h1>
      {trialExpirationDate ? (
        <p>Thời gian dùng thử của bạn sẽ hết hạn vào: <strong>{trialExpirationDate}</strong></p>
      ) : (
        <p>Không có thông tin về ngày hết hạn dùng thử.</p>
      )}
      {/* <h1>Thông báo</h1> */}
      {/* <p>Sắp ra mắt...</p> */}
    </div>
    );
  };
  
  export default Notifications;
  