import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../../api/api';
// Tạo Context
const UserContext = createContext();

// Tạo Provider Component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  
  useEffect(() => {
    fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    try {
      const response = await api.get('/api/users/me');
      setUser(response.data?.user);
      setUserId(response.data?.user?._id);
      console.log(response.data?.user);
      console.log(response.data?.user?._id);
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  };
  
  const login = (userData) => {
    setUser(userData);
    setUserId(userData?._id);
  };

  const logout = () => {
    setUser(null);
    setUserId(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, userId, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom Hook để sử dụng Context
export const useUserContext = () => {
  return useContext(UserContext);
};
