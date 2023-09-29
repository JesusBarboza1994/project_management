if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const config = require('./src/config');

const app = require("./src/app")
const port = config.PORT

app.listen(port, () => { 
    console.log("Running on port", port);
    console.log("Environment", process.env.NODE_ENV);
});