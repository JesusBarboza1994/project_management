const mongoose = require("mongoose");

(async () => {

    try {

        const db = await mongoose.connect(process.env.MONGODB_URI, { 
            useNewUrlParser: true 
        });

        console.log("MongoDB connected to", db.connection.host);

    } catch(err) {
        console.log(err);
    }

})();