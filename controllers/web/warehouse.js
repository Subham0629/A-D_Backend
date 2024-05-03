const WarehouseSchema = require('../../models/Warehouse')
const Response = require('../../libs/response')
const { responseMessage } = require("../../libs/responseMessages");
const ObjectID = require('mongodb').ObjectId;
const LocationSchema =require('../../models/Location')
const mongoose = require('mongoose');



module.exports = {
    createData,
    updateData,
    deleteData,
    getDetails,
    getList
}

async function createData(req, res) {

    try {

        let reqObj = req.body;
        reqObj.created_by = reqObj.login_user_id;
        reqObj.updated_by = reqObj.login_user_id;
           // Convert warehouse_name to lowercase for case-insensitive comparison
           const lowerCaseWarehouseName = reqObj.warehouse_name.toLowerCase();

           // Check for duplicate warehouse_name (case-insensitive)
           const existingWarehouse = await WarehouseSchema.findOne({ warehouse_name: { $regex: new RegExp('^' + lowerCaseWarehouseName + '$', 'i') } });
           if (existingWarehouse) {
               throw {
                   errors: [],
                   message: "Warehouse with the same name already exists.",
                   statusCode: 400
               }
           }
        let newData = await new WarehouseSchema(reqObj).save();

        if (newData) {
            res.status(200).json(await Response.success(newData, responseMessage(reqObj.langCode, 'RECORD_CREATED'), req));
        } else {
            throw {
                errors: [],
                message: responseMessage(reqObj.langCode, 'SOMETHING_WRONG'),
                statusCode: 412
            }
        }

    } catch (error) {
        return res.status(error.statusCode || 422).json(
            await Response.errors({
                errors: error.errors,
                message: error.message
            }, error, req)
        );

    }
}


async function updateData(req, res) {

    try {
        let reqObj = req.body;
        let loginUserId = reqObj.login_user_id;


        if (!req.params.id) {
            throw {
                errors: [],
                message: responseMessage(reqObj.langCode, 'ID_MISSING'),
                statusCode: 412
            }
        }

        let requestedData = { ...reqObj, ...{ updated_by: loginUserId } };

        let updatedData = await WarehouseSchema.findOneAndUpdate({
            _id:new ObjectID(req.params.id)
        }, requestedData, {
            new: true
        });

        if (updatedData) {
            res.status(200).json(await Response.success(updatedData, responseMessage(reqObj.langCode, 'RECORD_UPDATED'), req));
        }
        else {
            res.status(400).json(await Response.success({}, responseMessage(reqObj.langCode, 'NO_RECORD_FOUND'), req));
        }

    } catch (error) {
        return res.status(error.statusCode || 422).json(
            await Response.errors({
                errors: error.errors,
                message: error.message
            }, error, req)
        );

    }
}


async function deleteData(req, res) {
    try {
        let reqObj = req.body;
        let id  = req.params.id;
        if (!id) {
            throw {
                errors: [],
                message: responseMessage(reqObj.langCode, 'ID_MISSING'),
                statusCode: 412
            }
        }
         
        let getData = await WarehouseSchema.findOne({ "_id":new ObjectID(id)});
        if (!getData) {
            throw {
                errors: [],
                message: responseMessage(loginData.langCode, 'NO_RECORD_FOUND'),
                statusCode: 412
            }
        }

        const dataRemoved = await WarehouseSchema.deleteOne({ "_id":new ObjectID(id)});

        // Remove references from LocationSchema where warehouse matches
        await LocationSchema.updateMany(
            { "warehouse":new mongoose.Types.ObjectId(id) },
            { $pull: { "warehouse":new mongoose.Types.ObjectId(id) } }
        );
        
        res.status(200).json(await Response.success({}, responseMessage(reqObj.langCode,'RECORD_DELETED'),req));

    } catch (error) {
        return res.status(error.statusCode || 422).json(
            await Response.errors({
                errors: error.errors,
                message: error.message
            }, error, req)
        );

    }
}

async function getDetails(req, res) {
    try {

        let reqObj = req.body;
        let { _id } = req.query;
        if (!_id) {
            throw {
                errors: [],
                message: responseMessage(reqObj.langCode, 'ID_MISSING'),
                statusCode: 412
            }
        }

        const recordDetail = await WarehouseSchema.findOne({_id:new ObjectID(_id)});

        if(recordDetail){
            res.status(200).json(await Response.success(recordDetail, responseMessage(reqObj.langCode, 'SUCCESS')));
        } else {
            res.status(422).json(await Response.success({}, responseMessage(reqObj.langCode, 'NO_RECORD_FOUND'),req));
        }

    } catch (error) {
        return res.status(error.statusCode || 422).json(
            await Response.errors({
                errors: error.errors,
                message: error.message
            }, error, req)
        );

    }
}


async function getList(req, res) {

    try {
        let reqObj = req.body;

        let {page,per_page,sort_by,sort_order} = req.query; 
        let pageData = Response.validationPagination(page,per_page);

        if (page > 0) {

            let sort = {
                '_id' : -1
            }
            if(sort_by){
                let order = (sort_order=='desc')? -1:1;
                sort = {
                    [sort_by]:order
                }
            } 
        
            let allRecords = await WarehouseSchema.aggregate([                
                {
                   $facet:{
                      data:[
                          
                           { '$sort'     : sort },
                           { "$skip"     : pageData.offset },
                           { "$limit"    : pageData.limit }
                       ],
                      total: [{ $count: 'total' }] 
                   }
                }
             ]);
           res.status(200).json(await Response.pagination(allRecords, responseMessage(reqObj.langCode,'SUCCESS'),pageData,req));

        } else {
            let allRecords = await WarehouseSchema.find({}).lean();
            res.status(200).json(await Response.success(allRecords, responseMessage(reqObj.langCode,'SUCCESS'),req));
        }
        
        

    } catch (error) {
        return res.status(error.statusCode || 422).json(
            await Response.errors({
                errors: error.errors,
                message: error.message
            }, error, req)
        );

    }
}