import axios from 'axios';
   
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL, // URL backend
    withCredentials: true, // Gửi cookie trong request
    timeout: 10000,
});

    
export default api;
