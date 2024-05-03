var ObjectId = require('mongodb').ObjectId;

const create = async (req, res, next) => {
    try {
        const { mongoDB } = req.app.locals
        const result = await mongoDB.collection("tokens").insertOne(req.body);
        res.status(201).send({
            result: req.body
        })
    } catch (error) {
        console.log(error)
        return next(error);
    }
}

const getAll = async (req, res, next) => {
    try {
        const { mongoDB } = req.app.locals
        const result = await mongoDB.collection("tokens").find({}).toArray();
        res.status(200).send({
            result
        })
    } catch (error) {
        console.log(error)
        return next(error);
    }
}




module.exports = {
    create,
    getAll,

}