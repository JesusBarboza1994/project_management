const cors = require('cors');
const router = require("./routes");
const express = require('express')  
const swaggerUI = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const app = express();
require("./db.js");

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
}
app.use(cors());
app.use(express.json())
app.use("/", router)
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.use("/", router);
app.get('/', function(req, res){
    res.send("");
});

module.exports = app;