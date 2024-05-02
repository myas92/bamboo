var ObjectId = require('mongodb').ObjectId;
const getAll = async (req, res, next) => {
    try {
        const { mongoDB } = req.app.locals
        const result = await mongoDB.collection("hotels").insertOne(req.body);
        res.status(200).send({
            result
        })
    } catch (error) {
        console.log(error)
        return next(error);
    }
}


module.exports = {
    getAll,

}