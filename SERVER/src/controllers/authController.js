const User = require('../models/user');
const Role = require('../models/role');
const Business = require('../models/business');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
// const Permission = require('../models/permission');
// const verifyCaptcha = require('../config/captchaVerification');

dotenv.config();

// Đăng ký người dùng mới
const registerIndividual = async (req, res) => {
  const { username, email, fullName, address, phoneNumber, gender } = req.body;

  try {
    if(!username || !email || !fullName || !address || !phoneNumber || !gender){
      return res.status(400).json({ message: "Vui lòng điền đầy đủ các thông tin bắt buộc!"});
    }
    const userExist_Email = await User.findOne({ email });
    if(userExist_Email){
      return res.status(400).json({ message: "Email đã được sử dụng!"});
    }

    const userExist_Username = await User.findOne({ username });
    if(userExist_Username){
      return res.status(400).json({ message: "Username đã được sử dụng!"});
    }

    const role = await Role.findOne({ code: 0 });

    // Tạo mật khẩu ngẫu nhiên
    const randomPassword = crypto.randomBytes(8).toString('hex'); 

    const newUser = await User.create({
      username,
      email,
      password: randomPassword,
      fullName,
      address,
      phoneNumber,
      gender,
      type: 'individual', // Người dùng cá nhân
      business: null, // Không có doanh nghiệp
      role: role._id,
    })

    await newUser.save();

    // Cấu hình gửi email
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // Change if using another service
      port: 465,
      secure: true,
      auth: {
        user: 'ngtrquangit@gmail.com', // Your email
        pass: 'vezyfbofpjrujxym', // Email app password
      },
    });

    // Create HTML content for the email
    const emailHTML = `
      <h1>Cảm ơn bạn đã đăng ký dịch vụ của chúng tôi!</h1>
      <p>Hello ${newUser.fullName},</p>
      <p>Tài khoản của bạn đã được tạo thành công. Đây là mật khẩu của bạn đừng chia sẻ cho bất kì ai ${randomPassword}</p>
      <p>Vui lòng thay đổi mật khẩu sau khi đăng nhập.</p>
      <p>Trân trọng,</p>
      <p>Đội ngũ hỗ trợ</p>
    `;

    // Email options
    const mailOptions = {
      from: '"HPK Việt Nam" <ngtrquangit@gmail.com>', // Sender address
      to: newUser.email, // Receiver address (buyer)
      subject: 'Mật khẩu của bạn',
      html: emailHTML, // HTML content for the email
    };
    
    // Send email
    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: "Đã tạo tài khoản thành công!", user: newUser});
  } catch (error) {
    res.status(500).json({ message: "Lỗi đăng ký!", error: error})
  }
};

// Đăng ký người dùng doanh nghiệp
const registerBusinessUser = async (req, res) => {
  const { username, email, fullName, address, phoneNumber, gender, businessName, taxId, phoneNumberBusiness, addressBusiness, businessEmail } = req.body;

  try {
    if(!username || !email || !fullName || !address || !phoneNumber || !gender || !businessName || !addressBusiness || !phoneNumberBusiness){
      return res.status(400).json({ message: "Vui lòng điền đầy đủ các thông tin bắt buộc!"});
    }

    // Kiểm tra xem email hoặc username đã tồn tại chưa
    const userExist_Email = await User.findOne({ email });
    if(userExist_Email){
      return res.status(400).json({ message: "Email đã được sử dụng!"});
    }

    const userExist_Username = await User.findOne({ username });
    if(userExist_Username){
      return res.status(400).json({ message: "Username đã được sử dụng!"});
    }

    // Tạo doanh nghiệp mới
    const newBusiness = await Business.create({
      businessName,
      taxId: taxId,   // Nếu không có thì để là null
      address: addressBusiness,
      phoneNumber: phoneNumberBusiness,
      email: businessEmail,  // Nếu không có email thì để là null
      businessManager: null,  // Tạm thời để là null, sẽ cập nhật sau khi tạo người dùng
    });

    // Lấy quyền của người dùng doanh nghiệp (Role[2] có thể là người dùng doanh nghiệp)
    const role = await Role.findOne({ name: 'Giám đốc', code: 3 });

    // Tạo mật khẩu ngẫu nhiên
    const randomPassword = crypto.randomBytes(8).toString('hex'); 

    const newUser = await User.create({
      username,
      email,
      password: randomPassword,
      fullName,
      address,
      phoneNumber,
      gender,
      type: 'business_user', // Người dùng doanh nghiệp
      business: newBusiness._id,  // Liên kết với doanh nghiệp vừa tạo
      role: role._id  // Ví dụ: Role[2] là người dùng doanh nghiệp
    });

    // Cập nhật doanh nghiệp với thông tin người quản lý (businessManager)
    newBusiness.businessManager = newUser._id;
    await newBusiness.save();

    await newUser.save();

    // Cấu hình gửi email
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // Change if using another service
      port: 465,
      secure: true,
      auth: {
        user: 'ngtrquangit@gmail.com', // Your email
        pass: 'vezyfbofpjrujxym', // Email app password
      },
    });

    // Create HTML content for the email
    const emailHTML = `
      <h1>Cảm ơn bạn đã đăng ký dịch vụ của chúng tôi!</h1>
      <p>Hello ${newUser.fullName},</p>
      <p>Tài khoản của bạn đã được tạo thành công. Đây là mật khẩu của bạn đừng chia sẻ cho bất kì ai ${randomPassword}</p>
      <p>Vui lòng thay đổi mật khẩu sau khi đăng nhập.</p>
      <p>Trân trọng,</p>
      <p>Đội ngũ hỗ trợ</p>
    `;

    // Email options
    const mailOptions = {
      from: '"HPK Việt Nam" <ngtrquangit@gmail.com>', // Sender address
      to: newUser.email, // Receiver address (buyer)
      subject: 'Mật khẩu của bạn',
      html: emailHTML, // HTML content for the email
    };
    
    // Send email
    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: "Đã tạo tài khoản doanh nghiệp thành công!", user: newUser, business: newBusiness });
  } catch (error) {
    res.status(500).json({ message: "Lỗi đăng ký!", error: error })
  }
};

// Đăng nhập người dùng
const login = async (req, res) => {
  const { username, password } = req.body; // captchaValue

  try {
    // Kiểm tra reCAPTCHA trước khi xử lý đăng nhập
    // const isCaptchaValid = await verifyCaptcha(captchaValue);  // Kiểm tra CAPTCHA
    // if (!isCaptchaValid) {
    //   return res.status(400).json({ message: 'Xác thực CAPTCHA không hợp lệ!' }); // Nếu CAPTCHA không hợp lệ
    // }

    if (!username || !password) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin!' });
    }

    const user = await User.findOne({ username }).populate('role');

    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy tài khoản!' });
    }

    // if (user.role.code === 0){
    //   return res.status(404).json({ message: 'Tài khoản không đủ quyền truy cập!' });
    // }
    
    if (user.isDisabled) {
      return res.status(403).json({ message: 'Tài khoản bị vô hiệu hóa!' });
    }

    if (user.isDeleted) {
      return res.status(403).json({ message: 'Tài khoản không tồn tại!' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu chưa đúng!' });

    // Kiểm tra ngày hết hạn dùng thử
    const currentDate = new Date();
    const trialExpirationDate = user.trialExpirationDate;

    if (currentDate > trialExpirationDate) {
      return res.status(401).json({ message: 'Thời gian dùng thử đã hết hạn!' });
    }
    
    if (user && isMatch) {
      // const role = await Role.findById(user.role);

      // Tạo token
      const token = jwt.sign(
        { id: user._id, role: user.role.code },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
      );

      // Cấu hình cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: false, // Sử dụng khi deploy // process.env.NODE_ENV === 'production'
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
      });

      user.token = token;
      await user.save();

      res.status(200).json({
        message: 'Đăng nhập thành công!',
        token,
        user: {
          _id: user._id,
          username: user.username,
          fullName: user.fullName,
          role: user.role,
          permissions: user.permissions,
          avatar: user.avatar,
          trialExpirationDate,
        },
      });
    } else {
      res.status(401).json({ message: 'Thông tin đăng nhập không chính xác!' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi đăng nhập!', error: error });
  }
};

const logout = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(400).json({ message: 'Token không tồn tại trong cookie!' });
  }

  await User.updateOne({ token }, { $set: { token: null } });
  res.clearCookie('token');
  res.status(200).json({ message: 'Đăng xuất thành công!'});
}

module.exports = { registerIndividual, registerBusinessUser, login, logout};
