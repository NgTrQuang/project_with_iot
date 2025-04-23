import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';
import 'react-toastify/dist/ReactToastify.css';
import PersonalInfo from '../account/PersonalInfo';
import AddressSelector from '../account/AddressAll';
import ChangePassword from '../account/ChangePassword';

const Profile = () => {
  const { user } = useUserContext();
  const [activeTab, setActiveTab] = useState('personalInfo');

  return (
    <>
    {/* Dòng điều hướng */}
    <nav className="mb-4 text-sm text-gray-500">
      <Link to="/" className="text-blue-500 hover:underline">Home</Link> &gt; 
      <span className="text-gray-700 ml-1">Thông tin cá nhân</span>
    </nav>
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-16">
      
      {/* Layout with responsive grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white shadow-md rounded-md p-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-shrink-0">
                <img 
                  src={user?.avatar} 
                  alt="profile"
                  className="rounded-full w-16 h-16 border border-gray-200 p-1 object-cover" 
                />
              </div>
              <div>
                <p className="text-gray-600">Xin chào,</p>
                <h4 className="text-gray-800 font-medium">{user?.fullName || 'Guest'}</h4>
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <a 
                  href="#" 
                  className={`block ${activeTab === 'personalInfo' ? 'text-primary' : 'text-gray-600'} transition`}
                  onClick={() => setActiveTab('personalInfo')}
                >
                  Thông tin tài khoản
                </a>
                <a 
                  href="#" 
                  className={`block ${activeTab === 'address' ? 'text-primary' : 'text-gray-600'} transition`}
                  onClick={() => setActiveTab('address')}
                >
                  Thay đổi địa chỉ
                </a>
                <a 
                  href="#" 
                  className={`block ${activeTab === 'changePassword' ? 'text-primary' : 'text-gray-600'} transition`}
                  onClick={() => setActiveTab('changePassword')}
                >
                  Đổi mật khẩu
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="md:col-span-2">
          {activeTab === 'personalInfo' && <PersonalInfo />}
          {activeTab === 'address' && <AddressSelector />}
          {activeTab === 'changePassword' && <ChangePassword/>}
        </div>
      </div>
    </div>
    </>
  );
};

export default Profile;
