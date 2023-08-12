"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const mongoose = require("mongoose");
require('dotenv').config();
const dburl = process.env.DB_URL;
const dbport = process.env.DB_PORT;
const mongoose_1 = __importDefault(require("mongoose"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
mongoose_1.default.connect(dburl).then(() => {
    console.log("connection successful");
}).catch((err) => console.log(err));
const appSchema = new mongoose_1.default.Schema({
    name: { type: String,
        unique: true },
    birthday: {
        type: String,
        validate: {
            validator: function (value) {
                return /^\d{8}$/.test(value);
            },
            message: 'Birthday must be in the format DDMMYYYY'
        },
    }
});
let user = mongoose_1.default.model('user', appSchema);
// const express = require('express');
const app = (0, express_1.default)();
// const bodyParser = require("body-parser");
app.use(body_parser_1.default.json());
//adding new user
app.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let newUser = req.body;
    try {
        var newData = new user(newUser);
        yield newData.save();
        res.status(201).send("successfully saved");
        console.log('successfully saved');
    }
    catch (err) {
        console.error(err);
        res.status(409).send(err);
    }
}));
//nearest birthday
app.get('/nearestbirthday', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allUsers = yield user.find({});
        const today = new Date();
        const currentDay = today.getDate();
        const currentMonth = today.getMonth() + 1;
        let minDiff = 12;
        let diffInMonth = [];
        for (let i = 0; i < allUsers.length; i++) {
            const month = parseInt(allUsers[i].birthday.substring(2, 4));
            const day = parseInt(allUsers[i].birthday.substring(0, 2));
            if ((month - currentMonth) >= 0) {
                diffInMonth[i] = (month - currentMonth);
                if ((diffInMonth[i] < minDiff) && (diffInMonth[i] != 0)) {
                    minDiff = diffInMonth[i];
                }
                else if ((diffInMonth[i] == 0) && (day - currentDay) >= 0) {
                    minDiff = diffInMonth[i];
                }
            }
            else
                diffInMonth[i] = 13;
        }
        let x = 0;
        let minDiffDate = 32;
        for (let i = 0; i < allUsers.length; i++) {
            const day = parseInt(allUsers[i].birthday.substring(0, 2));
            if (minDiff == 0 && diffInMonth[i] == 0 && (day - currentDay) < minDiffDate && (day - currentDay) >= 0) {
                minDiffDate = (day - currentDay);
                x = i;
            }
            else if (minDiff != 0 && diffInMonth[i] == minDiff && day < minDiffDate) {
                minDiffDate = day;
                x = i;
            }
        }
        res.status(200).send(allUsers[x]);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
}));
//udating
app.put('/person/:name', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const useritem = yield user.findOneAndUpdate({ name: req.params.name }, { birthday: req.body.birthday });
        if (useritem) {
            return res.status(201).send("updated");
        }
        res.status(409).send("user not found");
    }
    catch (err) {
        console.error(err);
    }
}));
//delete specific persons 
app.delete('/person/:name', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const useritem = yield user.findOneAndDelete({ name: req.params.name });
        if (useritem) {
            return res.status(200).send("deleted");
        }
        res.status(404).send("user not found");
    }
    catch (err) {
        console.error(err);
    }
}));
//fetch a specific persons birthday
app.get('/person/:name', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userItem = yield user.findOne({ name: req.params.name });
        if (userItem) {
            return res.status(200).send(userItem.birthday);
        }
        res.status(404).send("user not found");
    }
    catch (err) {
        console.error(err);
    }
}));
app.listen(dbport, () => {
    console.log("server running on port 3000");
});
