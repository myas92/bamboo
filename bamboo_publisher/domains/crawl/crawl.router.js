const express = require("express");
const router = express.Router()
const { getAll } = require("./crawl.controller")
router.get('/hotels', getAll);


module.exports = router