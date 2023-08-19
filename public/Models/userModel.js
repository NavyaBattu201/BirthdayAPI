"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
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
let User = mongoose_1.default.model('user', appSchema);
exports.default = User;
