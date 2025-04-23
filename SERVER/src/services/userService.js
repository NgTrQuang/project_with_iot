const userRepository = require('../repositories/userRepository');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

class UserService {
  async registerUser(userData) {
    const { email, username } = userData;

    // Kiểm tra tài khoản đã tồn tại
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error("Email đã được sử dụng!");
    }

    const existingUsername = await userRepository.findByUsername(username);
    if (existingUsername) {
      throw new Error("Username đã được sử dụng!");
    }

    // Tạo mật khẩu ngẫu nhiên
    const randomPassword = crypto.randomBytes(8).toString('hex');
    userData.password = await bcrypt.hash(randomPassword, 10);

    // Tạo user mới
    const newUser = await userRepository.createUser(userData);
    return { user: newUser, password: randomPassword };
  }
}

module.exports = new UserService();
