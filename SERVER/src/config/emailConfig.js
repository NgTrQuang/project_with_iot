const nodemailer = require('nodemailer');
const User = require('../models/users');
// const Product = require('../models/products');

// Function to send order confirmation email
const sendOrderConfirmationEmail = async (order) => {
  try {
    const user = await User.findById(order.user);
    if (!user) {
        throw new Error('User does not exist');
    }

    // Retrieve product information from the database
    const productPromises = order.items.map(item => Product.findById(item.product));
    const products = await Promise.all(productPromises);

    // Create transporter using Gmail or another SMTP service
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
      <p>Hello ${user.fullName},</p>
      <p>Đây là mật khẩu của bạn đừng chia sẻ cho bất kì ai ${user.password}.</p>
      <p>Order details:</p>
      <ul style="list-style-type: none; padding: 0; margin: 0;">
        ${order.items.map((item, index) => {
            const product = products[index];
            return`
            <li style="margin-bottom: 10px;">
                <img src="${product.image}" alt="${product.name}" style="width: 100px; height: auto;"/>
                ${item.quantity} x ${product.name} - ${item.price.toLocaleString()} VND (Color: ${item.color}, Size: ${item.size})
            </li>
            `;
        }).join('')}
      </ul>
      <p>Total amount: ${order.totalAmount.toLocaleString()} VND</p>
      <p>Shipping address: ${order.shippingAddress}</p>
      <p>We will notify you once your order is processed and shipped.</p>
      <p>Thank you for shopping with us!</p>
    `;

    // Email options
    const mailOptions = {
      from: '"HPK Việt Nam" <ngtrquangit@gmail.com>', // Sender address
      to: user.email, // Receiver address (buyer)
      subject: 'Mật khẩu của bạn',
      html: emailHTML, // HTML content for the email
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log('Đã gửi mật khẩu qua email cho người dùng!');
  } catch (error) {
    console.error('Lỗi gửi email:', error);
    throw new Error('Lỗi gửi mật khẩu qua email');
  }
};

module.exports = { sendOrderConfirmationEmail };
