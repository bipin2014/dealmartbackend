const mongoose=require('mongoose');

const orderSchema=mongoose.Schema({
    products:[{
        product:{type: mongoose.Schema.Types.ObjectId, ref: 'Products',required:true}
    }],
    // products:[{type: mongoose.Schema.Types.ObjectId, ref: 'Products',required:true}],
    user:{type: mongoose.Schema.Types.ObjectId, ref: 'Users',required:true},
    isOrderCompleted: { type: Boolean, default: false },
    payment:{type: mongoose.Schema.Types.ObjectId, ref: 'Payment',required:true},
    date:{
        type:String,
        default: new Date().toISOString()
    }
});

module.exports=mongoose.model("Order",orderSchema);