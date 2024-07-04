
import config from "./src/config.js"
import app from "./src/app.js"

const port = config.PORT

app.listen(port, () => { 
    console.log("Running on port", port);
    console.log("Environment", process.env.NODE_ENV);
});