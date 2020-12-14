const mongoose = require('mongoose');

const referalsSchema = mongoose.Schema({
    refered_by: {type: String,required:true},
    refered_person:{type: mongoose.Schema.Types.ObjectId, ref: 'Users',required:true},
});

module.exports = mongoose.model("Referals", referalsSchema);