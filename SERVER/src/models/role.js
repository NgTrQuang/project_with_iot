const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    code: { 
        type: Number,  
        enum: [0, 1, 2, 3, 4],
        required: true,
        default: 0,
    },
    name: { type: String, required: true, unique: true },
    // permissions: [{ 
    //   type: mongoose.Schema.Types.ObjectId, 
    //   ref: 'Permission' 
    // }],
});
  
module.exports = mongoose.model('Role', roleSchema);