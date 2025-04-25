import { Link } from "react-router-dom";

const Payments = () => {
    return (
      <div>
        <nav className="mb-4 text-sm text-gray-500">
          <Link to="/" className="text-blue-500 hover:underline">Home</Link> &gt; 
          <span className="text-gray-700 ml-1">Thanh toán</span>
        </nav>
        {/* <h1>Cài đặt</h1> */}
        <p>Sắp ra mắt...</p>
      </div>
    );
  };
  
  export default Payments;
  