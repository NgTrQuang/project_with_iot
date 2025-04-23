import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you for reaching out! We will get back to you as soon as possible.');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <>
    {/* Dòng điều hướng */}
    <nav className="mb-4 text-sm text-gray-500">
      <Link to="/" className="text-blue-500 hover:underline">Home</Link> &gt; 
      <span className="text-gray-700 ml-1">Liên hệ</span>
    </nav>
    <section className="bg-gray-100 py-10" id="section4">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-semibold mb-4">Liên hệ với chúng tôi</h2>
        <p className="text-lg mb-6">
        Chúng tôi trân trọng phản hồi và đánh giá cao những bình luận của bạn. 
        Hãy chia sẻ suy nghĩ của bạn với chúng tôi để phục vụ khách hàng tốt hơn cũng như góp phần giúp cải thiện công ty của chúng tôi.
        </p>
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label className="block text-left font-medium mb-1" htmlFor="name">Họ và tên</label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-green-500"
              placeholder="Hãy nhập tên đầy đủ của bạn"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-left font-medium mb-1" htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-green-500"
              placeholder="Địa chỉ email của bạn"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-left font-medium mb-1" htmlFor="phone">Số điện thoại</label>
            <input
              type="tel"
              name="phone"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-green-500"
              placeholder="Số điện thoại liên hệ"
            />
          </div>
          <div className="mb-4">
            <label className="block text-left font-medium mb-1" htmlFor="message">Nội dung</label>
            <textarea
              name="message"
              id="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-green-500"
              rows="4"
              placeholder="Và dòng phản hồi ý kiến từ bạn..."
              required
            />
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-200"
          >
            Gửi ngay
          </button>
        </form>
      </div>
    </section>
    </>
  );
};

export default Contact;
