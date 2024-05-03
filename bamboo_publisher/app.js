require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const app = express()
const Initializer = require('./config/initialize')
const crawlRouter = require("./domains/crawl/crawl.router")
const tokenRouter = require("./domains/token/token.router")
app.use(bodyParser.json());

app.use('/v1/crawl/', crawlRouter)
app.use('/v1/tokens/', tokenRouter)


app.use((error, req, res, next) => {
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        console.log(err);
      });
    }
    if (res.headerSent) {
      return next(error);
    }
    res.status(error.statusCode || 500);
    res.json({
      code: error.code || -1,
      message: error.message || "an unknown error occurred!",
    });
  });


app.listen(process.env.PORT, async () => {
    try {
        const { mongoDB } = await Initializer.run()
        app.locals.mongoDB = mongoDB
        console.log("Running server on port", process.env.PORT)
    } catch (err) {
        console.error(err)
        process.exit()
    }

})