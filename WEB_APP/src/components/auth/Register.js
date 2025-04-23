import React, { useState } from 'react';
import RegisterPersonal from './RegisterPersonal';
import RegisterBusiness from './RegisterBusiness';

const Register = () => {
  const [userType, setUserType] = useState('');

  const handleUserTypeSelection = (type) => {
    setUserType(type);
  };

  return (
    <div className="container py-16">
      {!userType ? (
        <div className="max-w-lg mx-auto shadow px-6 py-7 rounded overflow-hidden text-center">
          <h2 className="text-2xl uppercase font-medium mb-4">Đăng ký</h2>
          <p className="text-gray-600 mb-6">Bạn muốn đăng ký với tư cách nào?</p>
          <div className="flex justify-around">
            <button
              className="py-2 px-4 bg-primary text-white rounded hover:bg-secondary transition"
              onClick={() => handleUserTypeSelection('personal')}
            >
              Cá nhân
            </button>
            <button
              className="py-2 px-4 bg-primary text-white rounded hover:bg-secondary transition"
              onClick={() => handleUserTypeSelection('business')}
            >
              Doanh nghiệp
            </button>
          </div>
        </div>
      ) : userType === 'personal' ? (
        <RegisterPersonal />
      ) : (
        <RegisterBusiness />
      )}
    </div>
  );
};

export default Register;
