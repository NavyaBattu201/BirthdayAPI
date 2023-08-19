import express from "express";
import bodyParser from "body-parser";
import connectToDatabase from "./configs/connectToDatabase";
import userRoutes from "./routes/userRoutes";
require('dotenv').config();
const dbport = process.env.DB_PORT;
connectToDatabase();

const app = express();
app.use(bodyParser.json());

app.use("/", userRoutes);


app.listen(dbport, () => {
    console.log("server running on port 3000");
});