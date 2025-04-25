import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Để lấy thông tin từ URL
import api from '../../../api/api';

const UserDetails = () => {
  const { userId } = useParams();  // Lấy userId từ URL
  const [userInfo, setUserInfo] = useState(null);
  const [userBusiness, setBusinesses] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // Gọi API để lấy thông tin người dùng
        const response = await api.get(`/api/users/${userId}`);
        setUserInfo(response.data?.user);
      } catch (error) {
        console.error('Lỗi khi tải thông tin người dùng:', error);
      }
    };

    if (userId) {
      fetchUserInfo();
    }
  }, [userId]); // Chỉ gọi API khi userId thay đổi

  useEffect(() => {
    if (userInfo) {
      const fetchBusinessAndRole = async () => {
        try {
          // Gọi API để lấy thông tin doanh nghiệp
          const responseBusinesses = await api.get(`api/businesses/details/${userInfo.business}`);

          setBusinesses(responseBusinesses?.data?.business);

          // Gọi API để lấy thông tin vai trò người dùng
          const responseRoles = await api.get(`/api/roles/details/${userInfo.role}`);

          setUserRole(responseRoles?.data?.role);
        } catch (error) {
          console.error('Lỗi khi tải thông tin doanh nghiệp hoặc vai trò:', error);
        }
      };

      fetchBusinessAndRole();
    }
  }, [userInfo]);

  if (!userInfo) {
    return <div>Đang tải thông tin người dùng...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Thông tin người dùng</h1>
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            <img 
                src={userInfo?.avatar ? userInfo?.avatar : 'https://via.placeholder.com/150'} 
                alt="Avatar" 
                className="w-12 h-12 rounded-full" 
            />
          </div>
          <div>
            <p className="text-lg font-medium text-gray-700">{userInfo?.fullName}</p>
            <p className="text-sm text-gray-500">{userInfo?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <p><strong className="font-semibold">Họ tên:</strong> {userInfo?.fullName}</p>
            <p><strong className="font-semibold">Email:</strong> {userInfo?.email}</p>
            <p><strong className="font-semibold">Vai trò:</strong> {userRole?.name}</p>
            <p><strong className="font-semibold">Giới tính:</strong> {userInfo?.gender === 'female' ? 'Nữ' : 'Nam'}</p>
          </div>
          <div>
            <p><strong className="font-semibold">Doanh nghiệp:</strong> {userBusiness?.businessName}</p>
            <p><strong className="font-semibold">Địa chỉ tài khoản:</strong> {userInfo?.address}</p>
            <p><strong className="font-semibold">Số điện thoại:</strong> {userInfo?.phoneNumber}</p>
            <p><strong className="font-semibold">Ngày tham gia:</strong> {new Date(userInfo?.createdAt).toLocaleString()}</p>
          </div>
        </div>

        <div className="space-y-2">
          <p><strong className="font-semibold">Trạng thái tài khoản:</strong> {userInfo?.isDisabled === false ? 'Đang hoạt động' : 'Đã khóa'}</p>
          <p><strong className="font-semibold">Người tạo:</strong> {userInfo?.createdBy === null ? 'Đăng ký tài khoản' : userInfo?.createdBy?.username}</p>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
