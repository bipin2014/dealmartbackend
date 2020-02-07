const mongoose = require('mongoose');

const bSellerSchema = mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'Users',required:true},
    pan:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },

});

module.exports = mongoose.model("BSeller", bSellerSchema);