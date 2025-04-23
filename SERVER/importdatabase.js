const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Role = require('./src/models/role');
const User = require('./src/models/user');
const Permission = require('./src/models/permission');  // Thêm mô hình Permission nếu cần
const Business = require('./src/models/business');
const electricityRate = require('./src/models/electricityRate');
const ElectricityUsage = require('./src/models/electricityUsage');
const Device = require('./src/models/device');
const moment = require('moment');

// const roleNames = {
//   0: "user",
//   1: "superadmin",
//   2: "admin",
//   3: "business_manager",
//   4: "business_user"
// };

// Kết nối đến MongoDB
mongoose.connect('mongodb://localhost:27017/database_management', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

// Tạo các role mặc định
const createRoles = async () => {
  const roles = [
    { code: 1, name: 'Quản trị tối cao' },
    { code: 2, name: 'Quản trị viên' },
    { code: 3, name: 'Giám đốc' },
    { code: 4, name: 'Quản lý/Trưởng phòng' },
    { code: 0, name: 'Khách hàng' },
  ];

  try {
    // Xóa các role cũ để tạo mới
    // await Role.deleteMany({});
    await Role.collection.drop().catch((err) => {
      if (err.code !== 26) {  // Error code 26 là "namespace not found" tức là collection không tồn tại
        console.error('Error dropping roles collection:', err);
        process.exit(1);
      }
    });
    // Tạo các role mới
    const createdRoles = await Role.insertMany(roles);
    console.log('Roles created:', createdRoles);
    return createdRoles;
  } catch (error) {
    console.error('Error creating roles:', error);
    process.exit(1);
  }
};

// Tạo các permission mặc định (nếu cần thiết)
const createPermissions = async () => {
  const permissions = [
    { name: 'read' },
    { name: 'write' },
    { name: 'delete' },
    { name: 'manage_users' },
  ];

  try {
    // Xóa các permission cũ để tạo mới
    // await Permission.deleteMany({});

    // Xóa collection Permission nếu tồn tại
    await Permission.collection.drop().catch((err) => {
      if (err.code !== 26) {  // Error code 26 là "namespace not found"
        console.error('Error dropping permissions collection:', err);
        process.exit(1);
      }
    });
    // Tạo các permission mới
    const createdPermissions = await Permission.insertMany(permissions);
    console.log('Permissions created:', createdPermissions);
    return createdPermissions;
  } catch (error) {
    console.error('Error creating permissions:', error);
    process.exit(1);
  }
};

// Tạo các role mặc định
const createBusiness = async () => {
  const business = [
    { 
      businessName: "HPK Việt Nam",
      taxId: "2100670435",
      address: "số 145, đường Điện Biên Phủ, Khóm 1, phường 6, Trà Vinh",
      phoneNumber: "0981131368",
      email: "hpkvietnam@gmail.com",
    },
    { 
      businessName: "Trọ sinh viên",
      taxId: "2100633036",
      address: "số 44, đường Kiên Thị Nhẫn, Khóm 1, phường 6, Trà Vinh",
      phoneNumber: "0703030605",
      email: "trosinhvien@gmail.com",
    },
  ];

  try {
    // Xóa các business cũ để tạo mới
    // await Business.deleteMany({});

    // Xóa collection Business nếu tồn tại
    await Business.collection.drop().catch((err) => {
      if (err.code !== 26) {  // Error code 26 là "namespace not found"
        console.error('Error dropping business collection:', err);
        process.exit(1);
      }
    });

    // Tạo các business mới
    const createBusiness = await Business.insertMany(business);
    console.log('Business created:', createBusiness);
    return createBusiness;
  } catch (error) {
    console.error('Error creating business:', error);
    process.exit(1);
  }
};
// Tạo các user với role và permission tương ứng
const createUsers = async (roles, business) => {
  const users = [
    {
      username: 'superadmin',
      email: 'superadmin@gmail.com',
      password: 'password123',
      fullName: 'Super Admin',
      address: 'số 145, đường Điện Biên Phủ, Khóm 1, phường 6, Trà Vinh',
      phoneNumber: '0335621047',
      role: roles[0]._id,
    //   permissions: [permissions[0]._id, permissions[1]._id, permissions[3]._id],  // Ví dụ cấp quyền cho superadmin
      isDisabled: false,
      avatar: 'https://via.placeholder.com/40?text=SA',
      gender: 'male',
      business: business[0]._id,
    },
    {
      username: 'admin',
      email: 'admin@gmail.com',
      password: 'password123',
      fullName: 'Admin',
      address: 'số 145, đường Điện Biên Phủ, Khóm 1, phường 6, Trà Vinh',
      phoneNumber: '0379909081',
      role: roles[1]._id,
    //   permissions: [permissions[0]._id, permissions[1]._id, permissions[2]._id],  // Ví dụ cấp quyền cho admin
      isDisabled: false,
      avatar: 'https://via.placeholder.com/40?text=A',
      gender: 'male',
      business: business[0]._id,
    },
    {
      username: 'admin2',
      email: 'admin2@gmail.com',
      password: 'password123',
      fullName: 'Admin2',
      address: 'số 145, đường Điện Biên Phủ, Khóm 1, phường 6, Trà Vinh',
      phoneNumber: '0344220017',
      role: roles[1]._id,
    //   permissions: [permissions[0]._id, permissions[1]._id, permissions[2]._id],  // Ví dụ cấp quyền cho admin
      isDisabled: false,
      avatar: 'https://via.placeholder.com/40?text=A',
      gender: 'female',
      business: business[0]._id,
    },
  ];

  try {
    // Mã hóa mật khẩu và tạo user
    for (let user of users) {
      user.password = await bcrypt.hash(user.password, 10);
      // Gán createdBy cho các user sau, ngoài superadmin
      const userCount = await User.countDocuments();
      if (userCount > 0) {
        user.createdBy = users[0]._id;  // Gán superadmin làm người tạo
      }
    }

    // Xóa tất cả user cũ để tạo mới
    // await User.deleteMany({});

    // Xóa collection User nếu tồn tại
    await User.collection.drop().catch((err) => {
      if (err.code !== 26) {  // Error code 26 là "namespace not found"
        console.error('Error dropping user collection:', err);
        process.exit(1);
      }
    });
    
    const createdUsers = await User.insertMany(users);
    console.log('Users created:', createdUsers);
  } catch (error) {
    console.error('Error creating users:', error);
    process.exit(1);
  }
};

const createDefaultElectricityRate = async () =>{
  const defaultElectricityRates = {
    rateType: 'tiered',
    tiers: [
      { range: [0, 50], rate: 1893 }, // Giá mới
      { range: [51, 100], rate: 1956 },
      { range: [101, 200], rate: 2271 },
      { range: [201, 300], rate: 2860 },
      { range: [301, 400], rate: 3197 },
      { range: [401, Infinity], rate: 3302 },
    ],
    billingCycleEnd: new Date((new Date()).getFullYear(), (new Date()).getMonth() + 1, 0), // Ví dụ: ngày kết thúc chu kỳ thanh toán
  };
  try {
    
    // Xóa tất cả user cũ để tạo mới
    // await electricityRate.deleteMany({});

    // Xóa collection electricityRate nếu tồn tại
    await electricityRate.collection.drop().catch((err) => {
      if (err.code !== 26) {  // Error code 26 là "namespace not found"
        console.error('Error dropping electricityRate collection:', err);
        process.exit(1);
      }
    });
    
    const createdElectricityRate = await electricityRate.insertMany(defaultElectricityRates);
    console.log('ElectricityRate created:', createdElectricityRate);
  } catch (error) {
    console.error('Error creating electricityRate:', error);
    process.exit(1);
  }
}

const createDevices = async () => {
  try {
    // Dữ liệu mẫu
    const devices = [
      {
        deviceSerialNumber: "EM114",
        deviceName: "Electricity Meter 114",
        userId: "677e3d53dbce0c5eeddd6e91",
        businessId: "677e2ffb145dc1bd2583efeb",
        deviceType: "electricity_meter",
        deviceStatus: "active",
        wifiStatus: "connected",
        location: "123 Main St, City",
        coordinates: [106.700981, 10.77689],
      },
      {
        deviceSerialNumber: "WE105",
        deviceName: "Water Meter 105",
        userId: "64cbefdcd4a5b5c223344556",
        businessId: "677e2ffb145dc1bd2583efeb",
        deviceType: "water_meter",
        deviceStatus: "under_maintenance",
        wifiStatus: "disconnected",
        location: "456 Elm St, City",
        coordinates: [106.800981, 10.87689],
      },
    ];

    // Xóa tất cả dữ liệu cũ (nếu muốn làm sạch database)
    // await Device.deleteMany();

    // Thêm dữ liệu mới
    await Device.insertMany(devices);

    console.log('Data imported successfully!');
    process.exit();
  } catch (err) {
    console.error('Error importing data:', err.message);
    process.exit(1);
  }
};

// Chạy hàm tạo dữ liệu
const seedDatabase = async () => {
  // const roles = await createRoles();
  // const permissions = await createPermissions();
  // const business = await createBusiness();
  // const electricityRates = await createDefaultElectricityRate();
  // await createUsers(roles, business);
  // await createDevices();
  await updateDataWithTimezone();
  mongoose.disconnect();
};

// Chạy quá trình khởi tạo dữ liệu
seedDatabase();
