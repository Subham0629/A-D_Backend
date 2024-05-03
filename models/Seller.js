const mongoose = require('mongoose')
const config = require('../config/env');
const schema = mongoose.Schema;

const SellerSchema = new mongoose.Schema({

   seller_name:{
        type:String,
        required:true

    },
    seller_location:{
        type:String,
        required:true,
        default: ''
    },
    warehouse:{
        type:schema.Types.ObjectId,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    aadhar_number:{
        type:Number,
        require:true,
        default: ''
    },
    email:{
        type:String,
        default: ''
    },
    created_by: String,
    updated_by: String
},{
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
})
SellerSchema.set('autoIndex', config.db.autoIndex);
module.exports = mongoose.model('seller',SellerSchema)