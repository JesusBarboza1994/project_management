const mongoose = require("mongoose");
const config = require('./config');
(async () => {

    try {
        const db = await mongoose.connect(config.DATABASE_URL, { 
            useNewUrlParser: true 
        });

        console.log("MongoDB connected to", db.connection.host);

    } catch(err) {
        console.log(err);
    }

})();