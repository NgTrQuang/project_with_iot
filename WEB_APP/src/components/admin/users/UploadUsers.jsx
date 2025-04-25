import React, { useState } from 'react';
import api from '../../../api/api';

const UploadUsers = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage('Vui lòng chọn file!');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/api/users/upload-users', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage(response.data.message);
    } catch (error) {
      console.error(error);
      setMessage('Lỗi tải file: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="text-sm bg-white rounded-lg p-4">
      <h1 className="font-semibold mb-4 text-gray-700">
        <i className="fa-solid fa-file-import"></i> Import file Excel
      </h1>
      <form onSubmit={handleUpload} className="flex items-center space-x-4">
        <input
          type="file"
          accept=".xlsx"
          onChange={handleFileChange}
          className="text-sm text-gray-700 border border-gray-300 rounded p-2"
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Tải lên
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UploadUsers;
