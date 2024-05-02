const mongoose = require('mongoose')


const recentActivitySchema = new mongoose.Schema({

    activity:{
        type:String,
       /// required:true

    },

    description:{
        type:String,
        required:true

    },

    createdBy:{
        type:String,
       // required:true

    },


    createdAt:{
        type:Date,
        default:Date.now
    }

})

module.exports = mongoose.model('RecentActivity',recentActivitySchema)