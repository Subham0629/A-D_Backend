const User = require('../../models/User')
const Role = require('../../models/Role')
const RecentActivity = require('../../models/recentActivity')
const bcrypt = require('bcryptjs');
const Response = require('../../libs/response')
const jwt = require('jsonwebtoken');

module.exports = {
    getList,
    getDataByID,
    createData,
    updateData,
    deleteData,
    deleteAllData,
    createUser,
    loginUser
}

async function getList(req, res) {
    try {
        const { name, email, role } = req.query;
        // Construct a filter object based on search parameters
        const filter = {};
        if (name) filter.name = { $regex: new RegExp(name, "i") }; 
        if (email) filter.email = { $regex: new RegExp(email, "i") }; 
        if (role) filter.role = role; // Exact match for role
        
        // Query the database with the constructed filter
        const users = await User.find(filter);
        res.send(users);
    } catch (error) {
        return res.status(error.statusCode || 422).json(
            await Response.errors({
                errors: error.errors,
                message: error.message
            }, error, req)
        );
    }
}



async function getDataByID(req, res) {
    try {

        const user = await User.findById(req.params.id)

        if (!user) return res.send('no user exits')

        res.send(user)

    } catch (error) {
        return res.status(error.statusCode || 422).json(
            await Response.errors({
                errors: error.errors,
                message: error.message
            }, error, req)
        );

    }
}



async function createData(req, res) {

    try {
        let user = new User({
            name: req.body.name,
            email: req.body.email,
            role: req.body.role,
        });
        user = await user.save()

        if (!user) return res.send('user not created')

        res.send(user);


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
        let updatedata;
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(req.body.password, salt)
            updatedata = {
                name: req.body.name,
                email: req.body.email,
                role: req.body.role,
                phone: req.body.phone,
                password: hashedPassword,
            }
        } else {
            updatedata = {

                name: req.body.name,
                email: req.body.email,
                role: req.body.role,
                phone: req.body.phone,
                // password:req.body.password,

            }

        }
        const user = await User.findByIdAndUpdate(req.params.id, updatedata, { new: true });

        if (!user) return res.send('user not updated')

        res.send(user)


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
        const user = await User.findByIdAndDelete(req.params.id)

        if (!user) return res.send('user not deleted')

        res.send(user)

    } catch (error) {
        return res.status(error.statusCode || 422).json(
            await Response.errors({
                errors: error.errors,
                message: error.message
            }, error, req)
        );

    }
}

async function deleteAllData(req, res) {

    try {
        let kk = []
        for (let single of req.body.selUsers) {
            kk.push(new ObjectId(single))
        }
        let deleteProductsResponse = await User.remove({ _id: { $in: kk } });

        if (!deleteProductsResponse) return res.send('user not deleted')

        res.send(deleteProductsResponse)

    } catch (error) {
        return res.status(error.statusCode || 422).json(
            await Response.errors({
                errors: error.errors,
                message: error.message
            }, error, req)
        );

    }
}

async function createUser(req, res) {

    try {
        const userExits = await User.findOne({ email: req.body.email })

        if (userExits) return res.status(400).send('email already exit')

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)

        const user = new User({
            name: req.body.name,
            phone: req.body.phone,
            role: req.body.role,
            email: req.body.email,
            password: hashedPassword
        });

        const savedUser = await user.save();

        let recentActivity = new RecentActivity({
            description: `new user ${savedUser.name} created`

        });

        recentActivity = await recentActivity.save()
        res.send({ user: user._id })

    } catch (error) {
        return res.status(error.statusCode || 422).json(
            await Response.errors({
                errors: error.errors,
                message: error.message
            }, error, req)
        );

    }
}

async function loginUser(req, res) {

    try {
        const userExits = await User.findOne({ email: req.body.email })
        if (!userExits) return res.status(400).send('email not exit')

        const validPassword = await bcrypt.compare(req.body.password, userExits.password)

        if (!validPassword) return res.status(400).send('wrong password')

        const token = jwt.sign({ id: userExits._id, name: userExits.name }, process.env.JWT_SECRET);

        let role = await Role.findOne({ _id: userExits.role });
    
        let permission = {};
        let modulesArray = [];

        if(role && role.dashboard_permissions && role.dashboard_permissions[0] && role.dashboard_permissions[0]['ParentChildchecklist'] && role.dashboard_permissions[0]['ParentChildchecklist']['length']>0){
            role.dashboard_permissions[0]['ParentChildchecklist'].map((moduleObj)=>{

                if(moduleObj){
                    modulesArray.push(moduleObj.moduleName);
                    permission[moduleObj.moduleName] = [];
    
                    if(moduleObj.childList && moduleObj.childList.length>0){
                        moduleObj.childList.map((permisObj)=>{
                            if(permisObj.isSelected){
                                permission[moduleObj.moduleName].push(permisObj.value);
                            }
                        })
                    }
                }
               

                return moduleObj;
            })
        }



        res.send({ 
            token: token, 
            user: userExits, 
            permissions: role.dashboard_permissions,
            modules:modulesArray,
            module_permissions:permission
        })

    } catch (error) {
        return res.status(error.statusCode || 422).json(
            await Response.errors({
                errors: error.errors,
                message: error.message
            }, error, req)
        );

    }
}
