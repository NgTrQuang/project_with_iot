import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';

const Calendar = ({ startDate, setStartDate, endDate, setEndDate }) => {
  // const [startDate, setStartDate] = useState(null);
  // const [endDate, setEndDate] = useState(null);
  const [error, setError] = useState(""); // Để lưu thông báo lỗi

  // Giả sử startDate và endDate là đối tượng Date
  const handleStartDateChange = (date) => {
    // Chuyển sang UTC và cập nhật startDate
    if (endDate && endDate < date){
      const parseStartDate = moment(endDate).utcOffset(7, true).startOf('day').toDate();
      setStartDate(parseStartDate);
    } else {
      const correctedStartDate = moment(date).utcOffset(7, true).startOf('day').toDate();
      setStartDate(correctedStartDate);
    }
  };

  const handleEndDateChange = (date) => {
    // Chuyển sang UTC và cập nhật endDate
    if (startDate && date < startDate){
      const parseEndDate = moment(startDate).utcOffset(7, true).endOf('day').toDate();
      setEndDate(parseEndDate);
    } else {
      const correctedEndDate = moment(date).utcOffset(7, true).endOf('day').toDate();
      setEndDate(correctedEndDate);
    }
  };

  const handleSubmit = () => {
    if (!startDate || !endDate) {
      setError("Vui lòng chọn ngày bắt đầu và ngày kết thúc.");
      return;
    }

    if (startDate > endDate) {
      setError("Ngày bắt đầu phải trước ngày kết thúc.");
      return;
    }

    setError(""); // Xóa thông báo lỗi nếu dữ liệu hợp lệ
    
    // const correctedStartDate = moment(endDate).add(1, 'day').toDate();
    // const correctedEndDate = moment(endDate).add(1, 'day').toDate();

    const jsonData = {
      startDate: startDate.toISOString(), //formatDate(startDate)
      endDate: endDate.toISOString(), //formatDate(endDate)
    };

    console.log(jsonData);
    // Gửi JSON này đến server hoặc xử lý tiếp

  };

  return (
    <div className="pt-2 pb-2">
      <h3 className="pt-2 pb-2">Chọn ngày lọc dữ liệu</h3>
      <div className="flex p-2 border rounded-md">
        <DatePicker
          selected={startDate}
          onChange={handleStartDateChange}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          maxDate={new Date()} // Đảm bảo ngày bắt đầu không lớn hơn ngày kết thúc
          placeholderText="Chọn ngày bắt đầu"
          popperPlacement="bottom-start"
          className="mr-2"
        />
        <DatePicker
          selected={endDate}
          onChange={handleEndDateChange}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate} // Đảm bảo ngày kết thúc không nhỏ hơn ngày bắt đầu
          maxDate={new Date()}
          placeholderText="Chọn ngày kết thúc"
          popperPlacement="bottom-start"
        />
        {/* <button onClick={handleSubmit}>
          <span className="ml-2 rounded hover:text-primary"> 
            Tìm kiếm
          </span>
        </button> */}
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Calendar;
