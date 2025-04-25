import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../../api/api";

const UpdateUserForm = () => {
  const { userId } = useParams(); // Lấy userId từ URL
  const [businesses, setBusinesses] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullName: "",
    address: "",
    phoneNumber: "",
    gender: "male",
    business: "",
    role: "",
  });

  // Lấy dữ liệu người dùng
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get(`/api/users/${userId}`);
        const userData = response.data.user;
        setFormData({
          username: userData.username,
          email: userData.email,
          fullName: userData.fullName,
          address: userData.address,
          phoneNumber: userData.phoneNumber,
          gender: userData.gender,
          business: userData.business || "",
          role: userData.role || "",
        });
        setLoading(false);
      } catch (error) {
        toast.error("Không thể tải thông tin người dùng!");
        setLoading(false);
      }
    };

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

    fetchUserData();
    fetchBusinesses();
    fetchRoles();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/users/${userId}`, formData);
      toast.success("Cập nhật thông tin người dùng thành công!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Đã xảy ra lỗi, vui lòng kiểm tra lại!");
    }
  };

  return (
    <>
      <nav className="mb-4 text-sm text-gray-500">
        <Link to="/" className="text-blue-500 hover:underline">Home</Link> &gt;
        <Link to="/users" className="text-blue-500 hover:underline"> Quản lý người dùng</Link> &gt;
        <span className="text-gray-700 ml-1">Cập nhật người dùng</span>
      </nav>
      <div className="max-w-lg mx-auto bg-white shadow-2xl rounded-lg p-8 mt-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Cập nhật người dùng</h2>
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
                    {business?.businessName}
                  </option>
                ))
              )}
            </select>
          </div>
          <div className="mb-4">
            <select
              name="role"
              value={formData?.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Chọn vai trò</option>
              {roles.map((role) => (
                <option key={role?._id} value={role?._id}>
                  {role?.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Cập nhật
            </button>
          </div>
        </form>
      </div>
      <ToastContainer/>
    </>
  );
};

export default UpdateUserForm;
