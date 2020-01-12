const mongoose =require('mongoose');

const UserSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
        min:3
    },
    email:{
        type:String,
        required:true,
        min:3,
        max:1024,
    },
    password:{
        type:String,
        required:true,
        min:6,
        max:1024,
    },
    usertype:{
        type:String,
        default:"Buyer"
    },
    date:{
        type:Date,
        default:Date.now,
    }
});

module.exports=mongoose.model("Users",UserSchema);