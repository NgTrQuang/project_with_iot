const mongoose = require('mongoose');
const Business = require('../models/business'); // Đảm bảo bạn đã định nghĩa model Business
const User = require('../models/user');

// Lấy danh sách doanh nghiệp theo quyền của người dùng
const getBusinesses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('role');

    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    // if (!user.role || ![2, 1].includes(user.role.code)) {
    //   return res.status(403).json({ message: 'Bạn không có quyền truy cập!' });
    // }
    const userRoleCode = user.role.code;

    let businesses;

    if (userRoleCode === 3 || userRoleCode === 4) {
      businesses = await Business.findById(user.business);
    } else {
      businesses = await Business.find();
    }

    if (!businesses || businesses.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy doanh nghiệp nào!' });
    }

    res.json({ businesses });
  } catch (error) {
    console.error('Error in getBusinesses:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Lấy danh sách người dùng theo doanh nghiệp
const getUsersByBusinessId = async (req, res) => {
  try {
    const { businessId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(businessId)) {
      return res.status(400).json({ message: 'ID doanh nghiệp không hợp lệ!' });
    }

    const currentUser = await User.findById(req.user.id).populate('role');
    if (!currentUser) {
      return res.status(404).json({ message: 'Người dùng không tồn tại!' });
    }

    if (!currentUser.role || ![2, 1].includes(currentUser.role.code)) {
      return res.status(403).json({ message: 'Bạn không có quyền truy cập!' });
    }

    const users = await User.find({ business: businessId }).populate('role');
    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'Không có người dùng nào được tìm thấy!' });
    }

    res.json({ users });
  } catch (error) {
    console.error('Error in getUsersByBusinessId:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Lấy thông tin doanh nghiệp theo id
const getBusinessById = async (req, res) => {
  try {
    const { businessId } = req.params;
  // Kiểm tra xem businessId có được cung cấp không
  if (!businessId) {
    return res.status(400).json({ message: 'Vui lòng cung cấp businessId' });
  }

  // Kiểm tra xem businessId có phải là ObjectId hợp lệ không
  if (!mongoose.Types.ObjectId.isValid(businessId)) {
    return res.status(400).json({ message: 'businessId không hợp lệ' });
  }

  // Tìm doanh nghiệp theo ID
  const business = await Business.findById(businessId)
    .populate('businessManager')
    .populate('electricityRate')
    .populate('waterRate');

  // Kiểm tra nếu không tìm thấy doanh nghiệp
  if (!business) {
    return res.status(404).json({ message: 'Không tìm thấy doanh nghiệp với ID đã cung cấp' });
  }
    return res.status(200).json({ business });
  } catch (error) {
    console.error('Error: ', error);
    return res.status(500).json({ message: 'Lỗi khi lấy thông tin doanh nghiệp', error });
  }
}

// Tạo doanh nghiệp mới
const createBusiness = async (req, res) => {
  try {
    const newBusiness = new Business({
      ...req.body,
      businessManager: req.user.id // Lấy userId từ token JWT
    });

    await newBusiness.save();
    res.status(201).json({
      message: 'Business created successfully.',
      business: newBusiness
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while creating business.' });
  }
};

// Lấy tất cả doanh nghiệp
const getAllBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find().populate('businessManager').populate('electricityRate').populate('waterRate');
    if (!businesses || businesses.length === 0) {
      return res.status(404).json({ message: 'No businesses found.' });
    }

    res.status(200).json(businesses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching businesses.' });
  }
};

// Tìm kiếm doanh nghiệp theo từ khóa 
const searchBusinesses = async (req, res) => {
  try {
    const { searchTerm } = req.query;

    if (!searchTerm) {
      return res.status(400).json({ message: 'Search term is required.' });
    }

    // Tạo query tìm kiếm
    const query = {
      $or: [
        { businessName: { $regex: searchTerm, $options: 'i' } },
        { email: { $regex: searchTerm, $options: 'i' } },
        { taxId: { $regex: searchTerm, $options: 'i' } },
        { address: { $regex: searchTerm, $options: 'i' } }
      ]
    };

    // Thực hiện tìm kiếm
    const businesses = await Business.find(query)
      .populate('businessManager', 'name email')
      .populate('electricityRate', 'rateName rateValue')
      .populate('waterRate', 'rateName rateValue');

    if (!businesses || businesses.length === 0) {
      return res.status(404).json({ message: 'No businesses found matching the search term.' });
    }

    res.status(200).json(businesses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while searching businesses.' });
  }
};

// Tìm kiếm theo filter
const filterBusinesses = async (req, res) => {
  try {
    const { businessName, email, taxId, isActive, electricityRate, waterRate } = req.query;

    // Tạo đối tượng query linh hoạt
    const query = {};

    if (businessName) {
      query.businessName = { $regex: businessName, $options: 'i' };
    }

    if (email) {
      query.email = { $regex: email, $options: 'i' };
    }

    if (taxId) {
      query.taxId = taxId;
    }

    if (isActive) {
      query.isActive = isActive === 'true';
    }

    if (electricityRate) {
      query.electricityRate = electricityRate;
    }

    if (waterRate) {
      query.waterRate = waterRate;
    }

    // Thực hiện lọc
    const businesses = await Business.find(query)
      .populate('businessManager', 'name email')
      .populate('electricityRate', 'rateName rateValue')
      .populate('waterRate', 'rateName rateValue');

    if (!businesses || businesses.length === 0) {
      return res.status(404).json({ message: 'No businesses found matching the filters.' });
    }

    res.status(200).json(businesses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while filtering businesses.' });
  }
};

// Tìm kiếm và filter kết hợp 
const filterAndSearchBusinesses = async (req, res) => {
  try {
    const {
      businessName,
      email,
      taxId,
      isActive,
      electricityRate,
      waterRate,
      searchTerm
    } = req.query;

    // Tạo đối tượng query linh hoạt
    const query = {};

    if (businessName) {
      query.businessName = { $regex: businessName, $options: 'i' }; // Tìm kiếm không phân biệt hoa thường
    }

    if (email) {
      query.email = { $regex: email, $options: 'i' };
    }

    if (taxId) {
      query.taxId = taxId;
    }

    if (isActive) {
      query.isActive = isActive === 'true'; // Chuyển đổi giá trị thành Boolean
    }

    if (electricityRate) {
      query.electricityRate = electricityRate; // Lọc theo `electricityRate` ID
    }

    if (waterRate) {
      query.waterRate = waterRate; // Lọc theo `waterRate` ID
    }

    if (searchTerm) {
      query.$or = [
        { businessName: { $regex: searchTerm, $options: 'i' } },
        { email: { $regex: searchTerm, $options: 'i' } },
        { taxId: { $regex: searchTerm, $options: 'i' } },
        { address: { $regex: searchTerm, $options: 'i' } }
      ];
    }

    // Thực hiện tìm kiếm với điều kiện lọc
    const businesses = await Business.find(query)
      .populate('businessManager', 'name email') // Lấy tên và email của người quản lý
      .populate('electricityRate', 'rateName rateValue') // Lấy thông tin giá điện
      .populate('waterRate', 'rateName rateValue'); // Lấy thông tin giá nước

    if (!businesses || businesses.length === 0) {
      return res.status(404).json({ message: 'No businesses found matching the criteria.' });
    }

    res.status(200).json(businesses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while filtering and searching businesses.' });
  }
};

// Cập nhật thông tin doanh nghiệp
const updateBusiness = async (req, res) => {
  try {
    const business = await Business.findByIdAndUpdate(req.params.businessId, req.body, { new: true });
    if (!business) {
      return res.status(404).json({ message: 'Business not found.' });
    }

    res.status(200).json({
      message: 'Business updated successfully.',
      business
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while updating business.' });
  }
};

// Xóa doanh nghiệp
const deleteBusiness = async (req, res) => {
  try {
    const business = await Business.findByIdAndDelete(req.params.businessId);
    if (!business) {
      return res.status(404).json({ message: 'Business not found.' });
    }

    res.status(200).json({ message: 'Business deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while deleting business.' });
  }
};

// Lọc doanh nghiệp theo trạng thái hoạt động
const getBusinessesByStatus = async (req, res) => {
  try {
    const { isActive } = req.query;
    const businesses = await Business.find({ isActive: isActive === 'true' })
      .populate('businessManager')
      .populate('electricityRate')
      .populate('waterRate');
    
    if (!businesses || businesses.length === 0) {
      return res.status(404).json({ message: 'No businesses found with the specified status.' });
    }

    res.status(200).json(businesses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while filtering businesses by status.' });
  }
};

module.exports = { 
  getBusinessById, 
  getBusinesses, 
  getUsersByBusinessId, 
  searchBusinesses, 
  filterBusinesses, 
  filterAndSearchBusinesses, 
  createBusiness, 
  getAllBusinesses, 
  updateBusiness, 
  deleteBusiness, 
  getBusinessesByStatus, 
};
