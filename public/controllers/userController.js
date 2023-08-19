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
exports.getPersonBirthday = exports.deletePerson = exports.updatePerson = exports.getNearestBirthday = exports.createUser = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let newUser = req.body;
    try {
        const newData = new userModel_1.default(newUser);
        yield newData.save();
        return res.status(201).send("successfully saved");
    }
    catch (err) {
        console.error(err);
        res.status(409).send(err);
    }
});
exports.createUser = createUser;
const getNearestBirthday = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allUsers = yield userModel_1.default.find({});
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
        return res.status(200).send(allUsers[x]);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});
exports.getNearestBirthday = getNearestBirthday;
const updatePerson = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const useritem = yield userModel_1.default.findOneAndUpdate({ name: req.params.name }, { birthday: req.body.birthday });
        if (useritem) {
            return res.status(201).send("updated");
        }
        return res.status(409).send("user not found");
    }
    catch (err) {
        console.error(err);
    }
});
exports.updatePerson = updatePerson;
const deletePerson = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const useritem = yield userModel_1.default.findOneAndDelete({ name: req.params.name });
        if (useritem) {
            return res.status(200).send("deleted");
        }
        return res.status(404).send("user not found");
    }
    catch (err) {
        console.error(err);
    }
});
exports.deletePerson = deletePerson;
const getPersonBirthday = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userItem = yield userModel_1.default.findOne({ name: req.params.name });
        if (userItem) {
            return res.status(200).send(userItem.birthday);
        }
        return res.status(404).send("user not found");
    }
    catch (err) {
        console.error(err);
    }
});
exports.getPersonBirthday = getPersonBirthday;
