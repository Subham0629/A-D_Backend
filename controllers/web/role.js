const Role = require("../../models/Role");
const RecentActivity = require("../../models/recentActivity");
const User = require("../../models/User");
const mongoose = require("mongoose");
const Response = require("../../libs/response");
const { responseMessage } = require("../../libs/responseMessages");
const ObjectId = mongoose.Types.ObjectId;

module.exports = {
  getList,
  getDataByID,
  getDataByRole,
  createData,
  updateData,
  deleteList,
  updatePermData,
  deleteData,
  getUserPermission,
};

async function getList(req, res) {
  try {
    const { role } = req.query;
    // Construct a filter object based on search parameters
    const filter = {};
    if (role) filter.role = { $regex: new RegExp(role, "i") };

    // Query the database with the constructed filter
    const roles = await Role.find(filter);
    res.send(roles);
  } catch (error) {
    return res.status(error.statusCode || 422).json(
      await Response.errors(
        {
          errors: error.errors,
          message: error.message,
        },
        error,
        req
      )
    );
  }
}

async function getDataByID(req, res) {
  try {
    const role = await Role.findById(req.params.id);

    if (!role) return res.send("no role exits");

    res.send(role);
  } catch (error) {
    return res.status(error.statusCode || 422).json(
      await Response.errors(
        {
          errors: error.errors,
          message: error.message,
        },
        error,
        req
      )
    );
  }
}

async function getDataByRole(req, res) {
  try {
    const role = await Role.findOne({ role: req.params.role });

    if (!role) return res.send("no role exits");

    res.send(role);
  } catch (error) {
    return res.status(error.statusCode || 422).json(
      await Response.errors(
        {
          errors: error.errors,
          message: error.message,
        },
        error,
        req
      )
    );
  }
}

async function createData(req, res) {
  const existingRole = await Role.findOne({
    role: { $regex: new RegExp("^" + req.body.role + "$", "i") },
  }).exec();
  if (existingRole) {
    return res.json({ message: "A role with the same name already exists." });
  }

  try {
    let role = new Role({
      role: req.body.role,
    });

    role = await role.save();

    if (!role) return res.send("role not created");

    let recentActivity = new RecentActivity({
      description: `new role ${role.role} created`,
    });

    recentActivity = await recentActivity.save();

    res.send(role);
  } catch (error) {
    return res.status(error.statusCode || 422).json(
      await Response.errors(
        {
          errors: error.errors,
          message: error.message,
        },
        error,
        req
      )
    );
  }
}

async function updateData(req, res) {
  const newRole = req.body.role;

  const existingRole = await Role.findOne({
    role: { $regex: new RegExp("^" + req.body.role + "$", "i") },
  }).exec();
  if (existingRole) {
    return res.json({ message: "A role with the same name already exists." });
  }

  try {
    const role = await Role.findByIdAndUpdate(
      req.params.id,
      {
        role: req.body.role,
      },
      { new: true }
    );
    res.send(role);
  } catch (error) {
    return res.status(error.statusCode || 422).json(
      await Response.errors(
        {
          errors: error.errors,
          message: error.message,
        },
        error,
        req
      )
    );
  }
}

async function deleteList(req, res) {
  try {
    let kk = [];
    for (let single of req.body.selUsers) {
      kk.push(new ObjectId(single));
    }
    let deleteProductsResponse = await Role.remove({ _id: { $in: kk } });

    if (!deleteProductsResponse) return res.send("role not deleted");

    res.send(deleteProductsResponse);
  } catch (error) {
    return res.status(error.statusCode || 422).json(
      await Response.errors(
        {
          errors: error.errors,
          message: error.message,
        },
        error,
        req
      )
    );
  }
}

async function updatePermData(req, res) {
  try {
    const role = await Role.findOneAndUpdate(
      { role: req.params.role },
      { $set: { dashboard_permissions: req.body.dashboard_permissions } },
      { new: true }
    );

    if (!role) return res.send("role not updated");

    res.send(role);
  } catch (error) {
    return res.status(error.statusCode || 422).json(
      await Response.errors(
        {
          errors: error.errors,
          message: error.message,
        },
        error,
        req
      )
    );
  }
}

async function deleteData(req, res) {
  try {
    const role = await Role.findByIdAndDelete(req.params.id);

    if (!role) return res.send("role not deleted");

    res.send(role);
  } catch (error) {
    return res.status(error.statusCode || 422).json(
      await Response.errors(
        {
          errors: error.errors,
          message: error.message,
        },
        error,
        req
      )
    );
  }
}

async function getUserPermission(req, res) {
  try {
    let reqObj = req.body;
    let { user_id } = req.query;

    if (!user_id) {
      throw {
        errors: [],
        message: responseMessage(reqObj.langCode, "ID_MISSING"),
        statusCode: 412,
      };
    }

    const userExits = await User.findOne({ _id: new ObjectId(user_id) });
    if (!userExits) {
      throw {
        errors: [],
        message: responseMessage(reqObj.langCode, "SOMETHING_WRONG"),
        statusCode: 412,
      };
    }

    let role = await Role.findOne({ role: userExits.role });

    let permission = {};
    let modulesArray = [];

    if (
      role &&
      role.dashboard_permissions &&
      role.dashboard_permissions[0] &&
      role.dashboard_permissions[0]["ParentChildchecklist"] &&
      role.dashboard_permissions[0]["ParentChildchecklist"]["length"] > 0
    ) {
      role.dashboard_permissions[0]["ParentChildchecklist"].map((moduleObj) => {
        if (moduleObj) {
          modulesArray.push(moduleObj.moduleName);
          permission[moduleObj.moduleName] = [];

          if (moduleObj.childList && moduleObj.childList.length > 0) {
            moduleObj.childList.map((permisObj) => {
              if (permisObj.isSelected) {
                permission[moduleObj.moduleName].push(permisObj.value);
              }
            });
          }
        }

        return moduleObj;
      });
    }

    if (role) {
      res.status(200).json(
        await Response.success(
          {
            permissions: role.dashboard_permissions,
            modules: modulesArray,
            module_permissions: permission,
          },
          responseMessage(reqObj.langCode, "SUCCESS")
        )
      );
    } else {
      res
        .status(422)
        .json(
          await Response.success(
            {},
            responseMessage(reqObj.langCode, "NO_RECORD_FOUND"),
            req
          )
        );
    }
  } catch (error) {
    return res.status(error.statusCode || 422).json(
      await Response.errors(
        {
          errors: error.errors,
          message: error.message,
        },
        error,
        req
      )
    );
  }
}
