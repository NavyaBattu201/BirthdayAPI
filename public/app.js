"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const connectToDatabase_1 = __importDefault(require("./configs/connectToDatabase"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
require('dotenv').config();
const dbport = process.env.DB_PORT;
(0, connectToDatabase_1.default)();
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use("/", userRoutes_1.default);
app.listen(dbport, () => {
    console.log("server running on port 3000");
});
