import cors from 'cors';
import express from 'express';
// import swaggerUI from 'swagger-ui-express';
// import swaggerSpec from './swagger.js';
import connectDB from './db.js'
import router from './routes/index.js';

connectDB()
const app = express();
const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
}
app.use(cors());
app.use(express.json())
app.use("/", router)
// app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.use("/", router);
app.get('/', function(req, res){
    res.send("");
});

export default app