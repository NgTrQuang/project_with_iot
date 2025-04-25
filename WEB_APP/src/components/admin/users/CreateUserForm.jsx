import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../../api/api';

const CreateUserForm = () => {
    const [businesses, setBusinesses] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);

    // Lấy danh sách doanh nghiệp từ API
    useEffect(() => {
        const fetchBusinesses = async () => {
        try {
            const response = await api.get('/api/businesses');
            const businessData = response.data?.businesses;
            const businesses = Array.isArray(businessData) ? businessData : [businessData];
            setBusinesses(businesses); // Cập nhật danh sách doanh nghiệp
            setLoading(false);
        } catch (error) {
            toast.error('Không thể tải danh sách doanh nghiệp!');
            setLoading(false);
        }
        };
        const fetchRoles = async () => {
            try {
                const response = await api.get('/api/roles');
                setRoles(response.data?.roles); // Cập nhật danh sách vai trò
            } catch (error) {
                toast.error('Không thể tải danh sách vai trò!');
            }
        };
        fetchBusinesses();
        fetchRoles();
    }, []);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        fullName: '',
        address: '',
        phoneNumber: '',
        gender: 'male',
        business: '',
        role: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/users/create', formData);
            toast.success('Người dùng đã được tạo thành công!');
            setFormData({
                username: '',
                email: '',
                password: '',
                fullName: '',
                address: '',
                phoneNumber: '',
                gender: 'male',
                business: '',
                role: '',
            });
        } catch (error) {
        toast.error(error.message || 'Đã xảy ra lỗi, vui lòng kiểm tra lại!');
        }
    };

  return (
    <>
    <nav className="mb-4 text-sm text-gray-500">
        <Link to="/" className="text-blue-500 hover:underline">Home</Link> &gt; 
        <Link to="/users" className="text-blue-500 hover:underline"> Quản lý người dùng</Link> &gt; 
        <span className="text-gray-700 ml-1">Thêm người dùng mới</span>
    </nav>
    <div className="max-w-lg mx-auto bg-white shadow-2xl rounded-lg p-8 mt-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Thêm người dùng mới</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input 
            type="text" 
            name="username" 
            value={formData?.username} 
            onChange={handleChange} 
            placeholder="Username" 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
          />
        </div>
        <div className="mb-4">
          <input 
            type="email" 
            name="email" 
            value={formData?.email} 
            onChange={handleChange} 
            placeholder="Email" 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
          />
        </div>
        <div className="mb-4">
          <input 
            type="password" 
            name="password" 
            value={formData?.password} 
            onChange={handleChange} 
            placeholder="Mật khẩu" 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
          />
        </div>
        <div className="mb-4">
          <input 
            type="text" 
            name="fullName" 
            value={formData?.fullName} 
            onChange={handleChange} 
            placeholder="Họ và tên" 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
          />
        </div>
        <div className="mb-4">
          <input 
            type="text" 
            name="address" 
            value={formData?.address} 
            onChange={handleChange} 
            placeholder="Địa chỉ" 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
          />
        </div>
        <div className="mb-4">
          <input 
            type="text" 
            name="phoneNumber" 
            value={formData?.phoneNumber} 
            onChange={handleChange} 
            placeholder="Số điện thoại" 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
          />
        </div>
        <div className="mb-4">
          <select 
            name="gender" 
            value={formData?.gender} 
            onChange={handleChange} 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
          </select>
        </div>
        <div className="mb-4">
          <select
            name="business"
            value={formData?.business}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Chọn doanh nghiệp/Tổ chức</option>
            {loading ? (
              <option disabled>Đang tải...</option>
            ) : (
              businesses.map((business) => (
                <option key={business?._id} value={business?._id}>
                  {business?.businessName} {/* Sử dụng tên doanh nghiệp */}
                </option>
              ))
            )}
          </select>
        </div>
        <div className="mb-4">
            <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
            <option value="">Chọn vai trò</option>
            {roles.map((role) => (
                <option key={role._id} value={role._id}>
                {role.name} {/* Sử dụng tên vai trò */}
                </option>
            ))}
            </select>
        </div>
        <div>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300">
            Tạo
          </button>
        </div>
      </form>
    </div>
    <ToastContainer/>
    </>
  );
};

export default CreateUserForm;
