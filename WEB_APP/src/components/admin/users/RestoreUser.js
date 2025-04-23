import React, { useEffect, useState } from 'react';
import { useUserContext } from '../../context/UserContext';
import { Link } from 'react-router-dom';
import api from '../../../api/api';
import { toast } from 'react-toastify';

const RestoreUser = () => {
  const { user } = useUserContext();

  const [users, setUsers] = useState([]); // State lưu danh sách người dùng
  const [loading, setLoading] = useState(true); // State hiển thị trạng thái tải

  const [isDisabled, setIsDisabled] = useState(""); // Trạng thái tài khoán
  const [businessFilter, setBusinessFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [roles, setRoles] = useState([]);
  const [businesses, setBusinesses] = useState([]);

  useEffect(() => {
    fetchBusinesses();
    fetchRoles();
    getListUser();
  }, [businessFilter, roleFilter, isDisabled]);

  const fetchBusinesses = async () => {
    try {
      const response = await api.get('/api/businesses');
      const businessData = response.data?.businesses;
      const businesses = Array.isArray(businessData) ? businessData : [businessData];
      setBusinesses(businesses);
    } catch (error) {
      toast.error("Không thể tải danh sách doanh nghiệp!");
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await api.get('/api/roles');
      const roleData = response.data?.roles;
      const roles = Array.isArray(roleData) ? roleData : [roleData];
      setRoles(roles);
    } catch (error) {
      toast.error("Không thể tải danh sách vai trò!");
    }
  };
  
  const getListUser = async () => {
    try {
      let response;
      
      // Truyền tham số vào URL query
      const queryParams = {};
    
      queryParams.isDeleted = true;
      // Thêm các tham số vào URL query nếu có
      if (businessFilter) queryParams.business = businessFilter;
      if (roleFilter) queryParams.role = roleFilter;
      if (isDisabled) queryParams.isDisabled = isDisabled;     

      const queryString = new URLSearchParams(queryParams).toString();

      if(user?.role?.code === 1 || user?.role?.code === 2){
        response = await api.get(`/api/users/?${queryString}`);
      } else {
        response = await api.get(`/api/users/user_business/?${queryString}`);
      }
      
      console.log(response?.data?.users);
      setUsers(response?.data?.users); // Đảm bảo rằng API trả về danh sách người dùng ở `response.data`     
      setLoading(false);
      console.log(users);
    } catch (error) {
      toast.error(error.response?.data?.message || "Lấy danh sách thất bại!");
    }
  };

  const handleRestore = async (userId) => {
    try {
        console.log('Restore for user with ID:', userId);
        // Gọi API để cập nhật trạng thái isDeleted thành false
        const response = await api.put(`/api/users/${userId}/restore`, {
          isDeleted: false
        });
    
        // Nếu khôi phục thành công, thông báo và cập nhật lại danh sách người dùng
        toast.success(response.data?.message);
        // Loại bỏ người dùng khỏi danh sách hiện tại
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      } catch (error) {
        // Xử lý lỗi khi gọi API
        toast.error(error.response?.data?.message || 'Lỗi khi khôi phục tài khoản!');
      }    
  };

  // Hàm lọc người dùng theo từ khóa tìm kiếm
  const filteredUsers = users.filter(user =>
    user?.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user?.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user?.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user?.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <p>Đang tải danh sách...</p>;
  }

  return (
    <>
    {/* Dòng điều hướng */}
    <nav className="mb-4 text-sm text-gray-500">
      <Link to="/" className="text-blue-500 hover:underline">Home</Link> &gt; 
      <span className="text-gray-700 ml-1">Khôi phục tài khoản</span>
    </nav>
    
    <div className="p-4">
      <div className="text-sm mb-6 flex space-x-6">
        {/* Dropdown cho lọc doanh nghiệp */}
        {(user?.role?.code === 1 || user?.role?.code === 2) &&
        <div className="flex flex-col items-center">
          <label htmlFor="business" className="font-semibold text-gray-700 mb-2">Doanh nghiệp/tổ chức:</label>
          <select
            id="business"
            value={businessFilter || ''}
            onChange={(e) => setBusinessFilter(e.target.value)}
            className="text-sm border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả</option>
              {loading ? (
                <option disabled>Đang tải...</option>
              ) : (
                businesses.map((business) => (
                  <option key={business?._id} value={business?._id}>
                    {business?.businessName}
                  </option>
                ))
              )}
          </select>
        </div>
        }
        {/* Dropdown cho Trạng thái tài khoản */}
        <div className="flex flex-col items-center">
          <label htmlFor="roles" className="font-semibold text-gray-700 mb-2">Vị trí/vai trò:</label>
          <select
            id="roles"
            value={roleFilter || ''}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="text-sm border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả</option>
              {roles.map((role) => (
                <option key={role?._id} value={role?._id}>
                  {role?.name}
                </option>
              ))}
          </select>
        </div>

        {/* Dropdown cho vai trò */}
        <div className="flex flex-col items-center">
          <label htmlFor="account-status" className="font-semibold text-gray-700 mb-2">Trạng thái tài khoản:</label>
          <select
            id="account-status"
            value={isDisabled}
            onChange={(e) => setIsDisabled(e.target.value)}
            className="text-sm border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả</option>
            <option value="true">Đã khóa</option>
            <option value="false">Đang hoạt động</option>
          </select>
        </div>
      </div>
      <h1 className="text-xl font-bold mb-4 flex justify-between items-center">
        <span>Danh sách người dùng đã xóa (tự động xóa sau 30 ngày)</span>
        {/* Thanh tìm kiếm */}
        <div className="flex-1 px-4">
          <input
            type="text"
            placeholder="Tìm kiếm người dùng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-sm border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          />
        </div>
      </h1>
      {filteredUsers.length > 0 ? 
        (
        <table className="text-sm min-w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
            <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">Username</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Thông tin</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Vị trí</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Khôi phục</th>
            </tr>
            </thead>
            <tbody>
            {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">{user?.username}</td>
                <td className="border border-gray-300 px-4 py-2">
                    Email: {user?.email} <br />
                    Họ và tên: {user?.fullName} <br />
                    Điện thoại: {user?.phoneNumber} <br />
                    Địa chỉ: {user?.address} <br />
                    Doanh nghiệp/tổ chức: {user?.business?.businessName}
                </td>
                <td className="border border-gray-300 px-4 py-2">{user?.role?.name}</td>
                <td className="border border-gray-300 px-4 py-2 text-center space-x-3">
                    <button
                    onClick={() => handleRestore(user?._id)}
                    className="text-green-500 hover:text-green-700"
                    title="Khôi phục"
                    >
                    <i class="fa-solid fa-rotate"></i>
                    </button>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        ) : "Không có người dùng để khôi phục."}  
    </div>
    </>
  );
};

export default RestoreUser;
