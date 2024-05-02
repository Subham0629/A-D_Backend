const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const middleware = require('../middleware');



const controllerObj = {};

fs.readdirSync(path.resolve('./controllers/web')).forEach(file => {
  let name = file.substr(0, file.indexOf('.'));
  controllerObj[name] = require(path.resolve(`./controllers/web/${name}`));
});

// Recent Activity Routes
router.get('/recentActivity', middleware.jwtVerify, controllerObj.recentActivity.getList);

// Role Routes

router.get('/roles', middleware.jwtVerify, controllerObj.role.getList);
router.get('/roles/:id', middleware.jwtVerify, controllerObj.role.getDataByID);
router.get('/roles/role/:role', middleware.jwtVerify, controllerObj.role.getDataByRole);
router.put('/roles/:id', middleware.jwtVerify, controllerObj.role.updateData);
router.put('/roles/update-perm/:role', middleware.jwtVerify, controllerObj.role.updatePermData);
router.post('/roles', middleware.jwtVerify, controllerObj.role.createData);
router.delete('/roles/:id', middleware.jwtVerify, controllerObj.role.deleteData);
router.delete('/roles', middleware.jwtVerify, controllerObj.role.deleteList);
router.get('/user/permission', middleware.jwtVerify, controllerObj.role.getUserPermission);

// User Routes 
router.get('/users', middleware.jwtVerify, controllerObj.user.getList);
router.get('/users/:id', middleware.jwtVerify, controllerObj.user.getDataByID);
router.put('/users/:id', middleware.jwtVerify, controllerObj.user.updateData);
router.post('/users', middleware.jwtVerify, controllerObj.user.createData);
router.delete('/users/:id', middleware.jwtVerify, controllerObj.user.deleteData);
router.delete('/users', middleware.jwtVerify, controllerObj.user.deleteAllData);
router.post('/users/register', controllerObj.user.createUser);
router.post('/users/login', controllerObj.user.loginUser);

// Location Routes
router.get('/location', middleware.jwtVerify, controllerObj.location.getList);
router.get('/location/detail', middleware.jwtVerify, controllerObj.location.getDetails);
router.put('/location', middleware.jwtVerify, controllerObj.location.updateData);
router.post('/location', middleware.jwtVerify, controllerObj.location.createData);
router.delete('/location', middleware.jwtVerify, controllerObj.location.deleteData);

// Warehouse Routes
router.get('/warehouse', middleware.jwtVerify, controllerObj.warehouse.getList);
router.get('/warehouse/detail', middleware.jwtVerify, controllerObj.warehouse.getDetails);
router.put('/warehouse', middleware.jwtVerify, controllerObj.warehouse.updateData);
router.post('/warehouse', middleware.jwtVerify, controllerObj.warehouse.createData);
router.delete('/warehouse', middleware.jwtVerify, controllerObj.warehouse.deleteData);

// Vendor Routes
router.get('/vendor', middleware.jwtVerify, controllerObj.vendor.getList);
router.get('/vendor/detail', middleware.jwtVerify, controllerObj.vendor.getDetails);
router.put('/vendor', middleware.jwtVerify, controllerObj.vendor.updateData);
router.post('/vendor', middleware.jwtVerify, controllerObj.vendor.createData);
router.delete('/vendor', middleware.jwtVerify, controllerObj.vendor.deleteData);

// Seller Routes
router.get('/seller', middleware.jwtVerify, controllerObj.seller.getList);
router.get('/seller/detail', middleware.jwtVerify, controllerObj.seller.getDetails);
router.put('/seller', middleware.jwtVerify, controllerObj.seller.updateData);
router.post('/seller', middleware.jwtVerify, controllerObj.seller.createData);
router.delete('/seller', middleware.jwtVerify, controllerObj.seller.deleteData);


module.exports = router;