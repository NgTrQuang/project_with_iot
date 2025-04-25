import React from 'react';
import { Link } from 'react-router-dom';

const AboutUs = () => {
  return (
    <>
    {/* Dòng điều hướng */}
    <nav className="mb-4 text-sm text-gray-500">
      <Link to="/" className="text-blue-500 hover:underline">Home</Link> &gt; 
      <span className="text-gray-700 ml-1">Về chúng tôi</span>
    </nav>
    <section
      className="bg-gray py-10"
      id="section3"
      style={{
        backgroundImage: `url('assets/images/logo.jpg')`,
        backgroundPosition: 'bottom center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backgroundBlendMode: 'color-dodge',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Chào mừng đến với chúng tôi!</h2>
        <p className="text-lg mb-6">
        Chúng tôi rất hân hạnh được làm việc với hàng trăm doanh nghiệp tuyệt vời có công nghệ hàng đầu thế giới.
        </p>
        <img
          src="assets/images/logo.jpg"
          alt="About Our Shop"
          className="mx-auto mb-6 w-full max-w-lg rounded shadow-lg"
        />
        <h3 className="text-xl font-semibold mb-2">Tại sao lại chọn chúng tôi?</h3>
        <ul className="list-disc list-inside mb-4 text-left mx-auto max-w-md">
          <li>Hỗ trợ khách hàng ngay khi khách hàng liên lạc với chúng tôi</li>
          <li>Thời gian làm việc chính từ 7h - 17h hằng ngày</li>
          <li>Tất cả các trường hợp phát sinh lỗi do chúng tôi, Quý khách sẽ được hỗ trợ miễn phí</li>
        </ul>
        {/* <p className="text-lg">
          Discover your unique style with us today!
        </p> */}
      </div>
    </section>
    </>
  );
};

export default AboutUs;
