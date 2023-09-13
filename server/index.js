if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const app = require("./src/app")
const port = process.env.PORT;

app.listen(port, () => { 
    console.log("Running on port", port);
    console.log("Environment", process.env.NODE_ENV);
});