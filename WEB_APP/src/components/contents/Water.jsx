import { Link } from "react-router-dom";
const Water = () => {
    return (
      <div>
        {/* Dòng điều hướng */}
        <nav className="mb-4 text-sm text-gray-500">
          <Link to="/" className="text-blue-500 hover:underline">Home</Link> &gt; 
          <span className="text-gray-700 ml-1">Quản lý nước sinh hoạt</span>
        </nav>
        {/* <h1>Quản lý nước sinh hoạt</h1> */}
        <p>Sắp ra mắt...</p>
      </div>
    );
  };
  
export default Water;
  