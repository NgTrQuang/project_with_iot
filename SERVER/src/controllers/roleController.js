const Role = require('../models/role');

// Lấy danh sách roles
const getRoles = async (req, res) => {
    try {
        // Giả sử thông tin người đăng nhập được lưu trong req.user
        const userRole = req.user.role; // Hoặc lấy từ token JWT nếu cần
        console.log(userRole);

        const userRoleDetails = await Role.findById(userRole);
        console.log(userRoleDetails);
        // Lọc các vai trò có quyền lớn hơn quyền người đăng nhập
        const roles = await Role.find({
            code: { $gt: userRoleDetails.code } // Lọc các vai trò có quyền lớn hơn người đăng nhập
        });

        // Thêm luôn vai trò 'user' (0) vào danh sách
        const userRoleUser = await Role.findOne({ code: 0 }); // Tìm vai trò user
        if (userRoleUser) {
            roles.unshift(userRoleUser); // Thêm vào đầu mảng (giữ user luôn hiển thị)
        }

        // Trả về danh sách vai trò
        return res.status(200).json({ roles });
    } catch (error) {
        console.error('Lỗi lấy danh sách vai trò:', error);
        res.status(500).json({ message: "Lỗi lấy danh sách vai trò" });
    }
};

// Lấy role theo ID
const getRoleById = async (req, res) => {
    try {
      const { roleId } = req.params; // Lấy roleId từ URL
  
      // Tìm role trong database
      const role = await Role.findById(roleId);
      if (!role) {
        return res.status(404).json({ message: 'Không tìm thấy vai trò' });
      }
  
      // Trả về thông tin role
      return res.status(200).json({ role });
    } catch (error) {
      console.error('Error: ', error);
      return res.status(500).json({ message: 'Lỗi khi lấy thông tin vai trò', error });
    }
};
  
module.exports = { getRoleById, getRoles };