const User = require('../models/user');
const Role = require('../models/role');
const Business = require('../models/business');
const XLSX = require('xlsx');
const fs = require('fs');

// API để lấy thông tin người dùng từ token
const getUserFromToken = async (req, res) => {
  try {
    // req.user sẽ có thông tin người dùng từ token sau khi middleware đã giải mã
    const user = await User.findById(req.user.id).populate('role');

    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    // Trả về thông tin người dùng
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Lấy danh sách tất cả người dùng
const getUsers = async (req, res) => {
  try{
  // Lấy thông tin tài khoản đăng nhập từ req.user
  const user = await User.findById(req.user.id).populate('role');

  if (!user) {
    throw new Error('Người dùng không tồn tại');
  }

  // Kiểm tra nếu không có doanh nghiệp liên kết
  if (!user.business) {
    return res.status(403).json({ message: 'Không có quyền truy cập!' });
  }

  // Kiểm tra role trước khi truy cập vào role.code
  if (!user.role || !user.role.code) {
    return res.status(400).json({ message: 'Người dùng không có quyền hợp lệ!' });
  }

  const { isDeleted, isDisabled, role, business } = req.query;  // Nhận tham số từ query
  const filter = {}; // Lấy trạng thái từ query

  if (isDeleted){
    filter.isDeleted = isDeleted;
  }

  if (isDisabled !== undefined) {
    filter.isDisabled = isDisabled === 'true';
  }
  
  if (role) {
    filter.role = role;  // Giả sử role._id là số
  }

  if (business) {
    filter.business = business;  // Lọc theo doanh nghiệp
  }

  let users;

  // Kiểm tra nếu là superadmin, lấy tất cả người dùng
  if (user.role.code === 1) {
    users = await User.find(filter).populate('role').populate('business');
    users = users.filter(user => user.role && user.role.code !== 1);
  } else if (user.role.code === 2) {
    // Nếu là admin, loại bỏ tài khoản superadmin
    users = await User.find(filter).populate('role').populate('business');
    users = users.filter(user => user.role && user.role.code !== 1 && user.role.code !== 2);
  } else {
    // Nếu không phải superadmin hay admin, trả về danh sách người dùng bình thường
    users = await User.find(filter).populate('role').populate('business');
    users = users.filter(user => user.role && user.role.code === 0);
  }
    // if (user.role.code === 2){
    //   users = await User.find().populate('role');
    // } else {
    //   users = await User.find().populate('role');
    //   users = users.filter(user => user.role.code !== 1);
    // }

  return res.json({ users });

  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Lấy người dùng theo doanh nghiệp
const getUsersByBusiness = async (req, res) => {
  try {
    // Lấy thông tin tài khoản đăng nhập từ req.user
    const user = await User.findById(req.user.id).populate('role');

    if (!user) {
      throw new Error('Người dùng không tồn tại');
    }

    // Kiểm tra nếu không có doanh nghiệp liên kết
    if (!user.business) {
      return res.status(403).json({ message: 'Không có quyền truy cập!' });
    }

    // Kiểm tra role trước khi truy cập vào role.code
    if (!user.role || !user.role.code) {
      return res.status(400).json({ message: 'Người dùng không có quyền hợp lệ!' });
    }

    const { isDeleted, isDisabled, role } = req.query; // Lấy trạng thái từ query
    const filter = {};

    filter.business = user.business;
    if (isDeleted){
      filter.isDeleted = isDeleted;
    }
  
    if (isDisabled !== undefined) {
      filter.isDisabled = isDisabled === 'true';
    }
    
    if (role) {
      filter.role = role;  // Giả sử role._id là số
    }

    // Tìm người dùng có cùng business
    let users;
    if (user.role.code === 4) {
      users = await User.find(filter).populate('role').populate('business'); //{ business: user.business }
      users = users.filter(user =>user.role && user.role.code === 0);  // Lọc ra chỉ những người có role là 0
    } else {
      users = await User.find(filter).populate('role').populate('business'); //{ business: user.business }
      users = users.filter(user =>user.role && user.role.code !== 3);
    }

    // Trả về danh sách người dùng
    return res.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Lấy thông tin người dùng theo ID
const getUserById = async (req, res) => {
  try {
    // Tìm người dùng theo ID và populate role
    const user = await User.findById(req.params.id).populate('createdBy');

    // Kiểm tra nếu không tìm thấy người dùng
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng!' });
    }

    // Trả về thông tin người dùng
    res.status(200).json({ user, message: 'Lấy thông tin người dùng thành công!' });
  } catch (error) {
    // Ghi lỗi và trả về phản hồi lỗi
    console.error(error);
    res.status(500).json({
      message: "Đã xảy ra lỗi khi lấy thông tin người dùng!",
      error: error.message,
    });
  }
};

// Thêm người dùng mới
const createUser = async (req, res) => {
  try {
    const { username, email, password, fullName, address, phoneNumber, gender, business, role } = req.body;

    // Kiểm tra xem email hoặc username đã tồn tại chưa
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Email hoặc tên người dùng đã tồn tại' });
    }

    // Kiểm tra nếu là người dùng đầu tiên (super admin)
    const userCount = await User.countDocuments(); // Kiểm tra số lượng người dùng trong database
    let createdBy = null;  // Người đầu tiên sẽ không có createdBy
    
    if (userCount > 0) {
      createdBy = req.user._id;  // Gán username người tạo cho người dùng mới
    }

    const dependentBusiness = await Business.findById(business).populate('businessManager');
    const trialExpirationDate = dependentBusiness.businessManager.trialExpirationDate;

    if (!trialExpirationDate) {
      return res.status(400).json({ message: 'Người tạo không có thông tin về ngày dùng thử' });
    }

    console.log("user account: :", req.user);
    // Tạo người dùng mới
    const user = new User({
      username,
      email,
      password,
      fullName,
      address,
      phoneNumber,
      gender,
      type: 'business_user',
      business,
      role,
      createdBy,
      trialExpirationDate: trialExpirationDate
    });

    await user.save();

    res.status(201).json({ message: 'Người dùng đã được tạo thành công', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi tạo người dùng', error: error.message });
  }
};

// Thêm người dùng mới bằng file excel
const addUsersFromExcel = async (req, res) => {
  try {
    // Kiểm tra file upload
    if (!req.file) {
      return res.status(400).json({ message: 'Vui lòng tải lên file Excel' });
    }

    console.log("Tài khoản: ", req.user);

    // Đọc file Excel
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Duyệt qua từng hàng trong file Excel
    const usersToCreate = [];
    for (const row of sheetData) {
      let { username, email, password, fullName, address, phoneNumber, gender } = row;

      // Chuyển đổi phoneNumber thành chuỗi và thêm số 0 nếu cần
      phoneNumber = phoneNumber ? phoneNumber.toString() : "";
      if (phoneNumber && phoneNumber.length < 10) {
        phoneNumber = phoneNumber.padStart(10, "0");
      }
      // Chuyển đổi giá trị giới tính
      gender = gender && gender.trim().toLowerCase() === "x" ? "female" : "male";

      // Kiểm tra nếu email hoặc username đã tồn tại
      const existingUser = await User.findOne({ $or: [{ email }, { username }] });
      if (existingUser) {
        console.log(`Bỏ qua: ${email} hoặc ${username} đã tồn tại`);
        continue;
      }

      if (!req.user.business){
        return res.status(400).json({ message: "Lỗi không tồn tại người truy cập!"});
      }

      const role = await Role.findOne({ code: 0 });

      // Lấy thông tin business
      const dependentBusiness = await Business.findById(req.user.business).populate('businessManager');
      if (!dependentBusiness) {
        console.log(`Bỏ qua: Business ID không hợp lệ (${req.user.business})`);
        continue;
      }

      const trialExpirationDate = dependentBusiness.businessManager.trialExpirationDate || null;

      // Mã hóa mật khẩu trước khi lưu vào database
      const hashedPassword = await bcrypt.hash(password, 10);

      // Thêm vào danh sách
      usersToCreate.push({
        username,
        email,
        password: hashedPassword,
        fullName,
        address,
        phoneNumber,
        gender,
        type: 'business_user',
        business: req.user.business,
        role: role._id,
        createdBy: req.user._id,
        trialExpirationDate
      });
    }

    // Lưu tất cả người dùng vào database
    const createdUsers = await User.insertMany(usersToCreate);

    // Xóa file sau khi xử lý
    fs.unlinkSync(req.file.path);

    res.status(201).json({
      message: `Thêm thành công ${createdUsers.length} người dùng`,
      users: createdUsers
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi xử lý file Excel', error: error.message });
  }
};

const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    // Lấy thông tin người dùng từ token
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại." });
    }

    // Kiểm tra mật khẩu hiện tại
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu hiện tại không đúng." });
    }

    // Cập nhật mật khẩu
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Thay đổi mật khẩu thành công." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Đã xảy ra lỗi khi thay đổi mật khẩu." });
  }
};

// Cập nhật thông tin tài khoản
const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, req.body, { new: true }).populate('role');
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    // Trả về kết quả thành công
    res.status(200).json({ 
      user, 
      message: "Cập nhật thành công!" 
    });
  } catch (error) {
    // Ghi lỗi và trả về phản hồi lỗi
    console.error(error);
    res.status(500).json({
      message: "Đã xảy ra lỗi trong quá trình cập nhật!",
      error: error.message,
    });
  }
};

// Cập nhật thông tin người dùng theo id
const updateUserById = async (req, res) => {
  try{
    const account = await User.findById(req.user.id).populate('role');
    if (!account) {
      return res.status(404).json({ message: 'Không tìm thấy tài khoản!' });
    }

    const user = await User.findById(req.params.id).populate('role');
    
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng!' });
    }

    if (user.role.code !== 0){
      if (account.role.code > user.role.code){
        return res.status(403).json({ message: 'Không có quyền truy cập người dùng này!' });
      }
    } 

    // Kiểm tra xem nếu business đã có giám đốc thì không thể thay đổi người khác thành giám đốc
    const roleCode = await Role.findById(req.body.role);

    if (req.body.role && roleCode.code === 3) {  // Nếu thay đổi thành giám đốc
      const usersInBusiness = await User.find({ business: user.business }).populate('role');
      const existingDirector = usersInBusiness.find(user => user.role && user.role.code === 3);

      if (existingDirector && user._id !== existingDirector._id) {
        return res.status(400).json({ message: 'Một doanh nghiệp/tổ chức chỉ có duy nhất 1 giám đốc!' });
      }

      // console.log('account ', account);
      // console.log('user ', user);
      // console.log('existingDirector ', existingDirector);
    }

    const updateUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('role');
    // Trả về kết quả cập nhật thành công
    return res.status(200).json({
      message: 'Cập nhật thành công!',
      user: updateUser,
    });
  } catch (error){
    console.error(error); // Ghi lại lỗi để kiểm tra
    return res.status(500).json({
      message: 'Đã xảy ra lỗi trong quá trình cập nhật!',
      error: error.message,
    });
  }
};

// Cập nhật khôi phục tài khoản
const restoreUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { isDeleted: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại!' });
    }

    return res.status(200).json({ message: 'Khôi phục tài khoản thành công!'});
  } catch (error) {
    return res.status(500).json({ message: 'Đã xảy ra lỗi!'});
  }
}

// Xóa mềm người dùng 
const softDeleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { 
        isDeleted: true,
        deletedAt: new Date()
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại!' });
    }

    return res.status(200).json({ message: 'Xóa tài khoản thành công!'});
  } catch (error) {
    return res.status(500).json({ message: 'Đã xảy ra lỗi!'});
  }
}

// // Xóa người dùng
// const deleteUser = async (req, res) => {
//   const user = await User.findByIdAndDelete(req.params.id);
//   if (!user) {
//     return res.status(404).json({ message: 'Không tìm thấy người dùng' });
//   }
//   res.json({ message: 'Đã xóa' });
// };

module.exports = { 
  getUserFromToken, 
  getUsers, 
  getUsersByBusiness,
  getUserById, 
  createUser,
  addUsersFromExcel, 
  updateUser, 
  updateUserById,
  restoreUser,
  softDeleteUser,
  changePassword
};

// const User = require('../models/users');

// API để lấy thông tin người dùng từ token
// const getUserFromToken = async (req, res) => {
//   try {
//     // req.user sẽ có thông tin người dùng từ token sau khi middleware đã giải mã
//     const user = await User.findById(req.user.id);

//     if (!user) {
//       return res.status(404).json({ message: 'Người dùng không tồn tại' });
//     }

//     // Trả về thông tin người dùng
//     res.json({ user });
//   } catch (error) {
//     res.status(500).json({ message: 'Lỗi server' });
//   }
// };

// // Chức năng nâng cấp tài khoản từ Customer lên Admin
// const upgradeToAdmin = async (req, res) => {
//   const { userId } = req.params;

//   try {
//     // Tìm người dùng theo ID
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: 'Người dùng không tồn tại' });
//     }

//     // Kiểm tra xem người dùng đã là admin chưa
//     if (user.role === 2) {
//       return res.status(400).json({ message: 'Người dùng này đã là admin' });
//     }

//     // Cập nhật vai trò người dùng thành admin
//     user.role = 2;
//     await user.save();

//     res.status(200).json({ message: 'Đã nâng cấp người dùng thành admin thành công', user });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Lỗi trong quá trình nâng cấp', error });
//   }
// };

// // API để lấy tất cả người dùng (Chỉ dành cho Admin)
// const getAllUsers = async (req, res) => {
//     try {
//       // Kiểm tra nếu người dùng là Admin
//       if (req.user.role === "admin") {
//         return res.status(403).json({ message: 'Không có quyền truy cập' });
//       }
  
//       const users = await User.find(); // Tìm tất cả người dùng trong DB
//       res.json({ users });
//     } catch (error) {
//       res.status(500).json({ message: 'Lỗi server' });
//     }
// };

// const createUser = async (req, res) => {
//   try {
//     const { username, email, password, fullName } = req.body;

//     // Kiểm tra xem email có tồn tại chưa
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: 'Email đã tồn tại' });
//     }

//     // Tạo người dùng mới
//     const newUser = new User({
//       username,
//       email,
//       password, // Đảm bảo đã mã hóa mật khẩu trong middleware hoặc model
//       fullName
//     });

//     await newUser.save();
//     res.status(201).json({ message: 'Người dùng đã được tạo thành công', user: newUser });
//   } catch (error) {
//     res.status(500).json({ message: 'Lỗi server' });
//   }
// };

// const updateUser = async (req, res) => {
//   try {
//     const { fullName, email, phoneNumber, address } = req.body;

//     // Check if any field is missing
//     if (!fullName && !email && !phoneNumber && !address) {
//       return res.status(400).json({ message: 'No fields to update' });
//     }

//     const user = await User.findById(req.user.id); // req.user.id từ token
//     if (!user) {
//       return res.status(404).json({ message: 'Người dùng không tồn tại' });
//     }

//     // Cập nhật thông tin
//     user.fullName = fullName || user.fullName;
//     user.email = email || user.email;
//     user.phoneNumber = phoneNumber || user.phoneNumber;
//     user.address = address || user.address;

//     await user.save();
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ message: 'Lỗi server', error: error });
//   }
// };

// const deleteUser = async (req, res) => {
//   try {
//     // Chỉ admin mới có quyền xóa
//     if (req.user.role !== 2) {
//       return res.status(403).json({ message: 'Không có quyền truy cập' });
//     }

//     const user = await User.findById(req.params.id);
//     if (!user) {
//       return res.status(404).json({ message: 'Người dùng không tồn tại' });
//     }

//     await user.remove();
//     res.json({ message: 'Người dùng đã bị xóa' });
//   } catch (error) {
//     res.status(500).json({ message: 'Lỗi server' });
//   }
// };

// const changePassword = async (req, res) => {
//   try {
//     const { oldPassword, newPassword } = req.body;

//     const user = await User.findById(req.user.id);
//     if (!user) {
//       return res.status(404).json({ message: 'Người dùng không tồn tại' });
//     }

//     // Kiểm tra mật khẩu cũ
//     const isMatch = await user.comparePassword(oldPassword);
//     if (!isMatch) {
//       return res.status(400).json({ message: 'Mật khẩu cũ không chính xác' });
//     }

//     // Đổi mật khẩu
//     user.password = newPassword; // Đảm bảo mã hóa mật khẩu trước khi lưu
//     await user.save();

//     res.json({ message: 'Mật khẩu đã được thay đổi thành công' });
//   } catch (error) {
//     res.status(500).json({ message: 'Lỗi server' });
//   }
// };

// const getUserById = async (req, res) => {
//   try {
//     // Chỉ admin mới có quyền xem thông tin người dùng
//     if (req.user.role !== 2) {
//       return res.status(403).json({ message: 'Không có quyền truy cập' });
//     }

//     const user = await User.findById(req.params.id);
//     if (!user) {
//       return res.status(404).json({ message: 'Người dùng không tồn tại' });
//     }

//     res.json({ user });
//   } catch (error) {
//     res.status(500).json({ message: 'Lỗi server' });
//   }
// };

// const toggleUserStatus = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const { isDisabled } = req.body; // Truyền trạng thái isDisabled (true hoặc false)

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }

//     user.isDisabled = isDisabled; // Cập nhật trạng thái vô hiệu hóa
//     await user.save();

//     res.status(200).json({ success: true, message: `User status updated to ${isDisabled ? 'disabled' : 'enabled'}` });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Failed to update user status' });
//   }
// };

// module.exports = {
//   getUserFromToken,
//   getAllUsers,
//   createUser,
//   updateUser,
//   deleteUser,
//   changePassword,
//   getUserById,
//   toggleUserStatus,
//   upgradeToAdmin,
// };

