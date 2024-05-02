const RecentActivity = require('../../models/recentActivity')
const Response = require('../../libs/response')

module.exports = {
    getList
}

async function getList(req, res) {
    try {
        const tasks = await RecentActivity.find().sort({ _id: -1 })
        res.send(tasks)

    } catch (error) {
        return res.status(error.statusCode || 422).json(
            await Response.errors({
                errors: error.errors,
                message: error.message
            }, error, req)
        );

    }
}




