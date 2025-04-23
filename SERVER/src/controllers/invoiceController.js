const Invoice = require('../models/invoice');

// Lọc và tìm kiếm hóa đơn
const filterAndSearchInvoices = async (req, res) => {
  try {
    const {
      userId,
      businessId,
      paymentId,
      status,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      searchTerm,
    } = req.query;

    const query = {};

    if (userId) {
      query.userId = userId;
    }

    if (businessId) {
      query.businessId = businessId;
    }

    if (paymentId) {
      query.paymentId = paymentId;
    }

    if (status) {
      query.status = status;
    }

    if (startDate || endDate) {
      query.issuedDate = {};
      if (startDate) {
        query.issuedDate.$gte = new Date(startDate);
      }
      if (endDate) {
        query.issuedDate.$lte = new Date(endDate);
      }
    }

    if (minAmount || maxAmount) {
      query.totalAmount = {};
      if (minAmount) {
        query.totalAmount.$gte = parseFloat(minAmount);
      }
      if (maxAmount) {
        query.totalAmount.$lte = parseFloat(maxAmount);
      }
    }

    if (searchTerm) {
      query.$or = [
        { invoiceNumber: { $regex: searchTerm, $options: 'i' } },
        { 'details.description': { $regex: searchTerm, $options: 'i' } },
      ];
    }

    const invoices = await Invoice.find(query)
      .populate('userId', 'name email') // Lấy thông tin người dùng
      .populate('businessId', 'name address') // Lấy thông tin doanh nghiệp
      .populate('paymentId', 'paymentMethod paymentDate') // Lấy thông tin thanh toán
      .sort({ issuedDate: -1 });

    if (!invoices || invoices.length === 0) {
      return res.status(404).json({ message: 'No invoices found matching the criteria.' });
    }

    res.status(200).json(invoices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching invoices.' });
  }
};

const getInvoiceById = async (req, res) => {
    try {
      const { id } = req.params;
  
      const invoice = await Invoice.findById(id)
        .populate('userId', 'name email')
        .populate('businessId', 'name address')
        .populate('paymentId', 'paymentMethod paymentDate');
  
      if (!invoice) {
        return res.status(404).json({ message: 'Invoice not found.' });
      }
  
      res.status(200).json(invoice);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error while fetching the invoice.' });
    }
};
  
// Tạo hóa đơn
const addInvoice = async (req, res) => {
    try {
      const {
        userId,
        businessId,
        paymentId,
        invoiceNumber,
        issuedDate,
        dueDate,
        totalAmount,
        details,
        status,
      } = req.body;
  
      const newInvoice = new Invoice({
        userId,
        businessId,
        paymentId,
        invoiceNumber,
        issuedDate,
        dueDate,
        totalAmount,
        details,
        status,
      });
  
      const savedInvoice = await newInvoice.save();
      res.status(201).json(savedInvoice);
    } catch (error) {
      console.error(error);
      if (error.code === 11000) {
        return res.status(400).json({ message: 'Invoice number must be unique.' });
      }
      res.status(500).json({ message: 'Server error while adding the invoice.' });
    }
};

// Cập nhật hóa đơn
const updateInvoice = async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
  
      const updatedInvoice = await Invoice.findByIdAndUpdate(id, updates, {
        new: true, // Trả về document đã cập nhật
        runValidators: true, // Kiểm tra lại validation
      });
  
      if (!updatedInvoice) {
        return res.status(404).json({ message: 'Invoice not found.' });
      }
  
      res.status(200).json(updatedInvoice);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error while updating the invoice.' });
    }
};
  
// Xóa hóa đơn
const deleteInvoice = async (req, res) => {
    try {
      const { id } = req.params;
  
      const deletedInvoice = await Invoice.findByIdAndDelete(id);
  
      if (!deletedInvoice) {
        return res.status(404).json({ message: 'Invoice not found.' });
      }
  
      res.status(200).json({ message: 'Invoice deleted successfully.', data: deletedInvoice });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error while deleting the invoice.' });
    }
};
  
module.exports = {
    filterAndSearchInvoices, 
    getInvoiceById, 
    addInvoice, 
    updateInvoice, 
    deleteInvoice, 
};