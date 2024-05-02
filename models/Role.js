const mongoose = require('mongoose')


const roleSchema = new mongoose.Schema({

    role:{
        type:String,
        required:true

    },

    dashboard_permissions: { type : Array , "default" : 
    

    [
      {

        isAllSelected : false,
        isAllCollapsed : false,
    ParentChildchecklist:[
        {
          id: 1,moduleName: 'users',isSelected: false,isClosed:false,
          childList: [
            {
              id: 1,parent_id: 1,value: 'add',isSelected: false
            },
        
            {
              id: 2,parent_id: 1,value: 'view',isSelected: false
            },
            {
              id: 3,parent_id: 1,value: 'Edit',isSelected: false
            },
        
            {
              id: 4,parent_id: 1,value: 'Delete',isSelected: false
            }
          ]
        },
        {
          id: 2,moduleName: 'roles',isSelected: false,isClosed:false,
          childList: [
            {
              id: 1,parent_id: 2,value: 'add',isSelected: false
            },
        
            {
              id: 2,parent_id: 2,value: 'view',isSelected: false
            },
            {
              id: 3,parent_id: 2,value: 'Edit',isSelected: false
            },
        
            {
              id: 4,parent_id: 2,value: 'Delete',isSelected: false
            }
          ]
        },
        {
          id: 3,moduleName: 'Location',isSelected: false,isClosed:false,
          childList: [
            {
              id: 1,parent_id: 3,value: 'add',isSelected: false
            },
        
            {
              id: 2,parent_id: 3,value: 'view',isSelected: false
            },
            {
              id: 3,parent_id: 3,value: 'Edit',isSelected: false
            },
        
            {
              id: 4,parent_id: 3,value: 'Delete',isSelected: false
            }
          ]
        }
      ]
    }
    ]


    
     },
    
   
    date:{
        type:Date,
        default:Date.now
    }

})

module.exports = mongoose.model('Role',roleSchema)