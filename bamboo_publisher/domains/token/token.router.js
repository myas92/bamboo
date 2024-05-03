const express = require("express");
const router = express.Router()
const { create, getAll } = require("./token.controller")
router.get('/', getAll);
router.post('/', create);


module.exports = router