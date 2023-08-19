const mongoose = require('mongoose');
require('dotenv').config();

const dburl:string = process.env.DB_URL!;
async function connectToDatabase() {
    try {
        await mongoose.connect(dburl);
        console.log("Connection to the database successful");
    } catch (error) {
        console.error("Error connecting to the database:", error);
    }
}
export default connectToDatabase;