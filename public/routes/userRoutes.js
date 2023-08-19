"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
router.post("/", userController_1.createUser);
router.get("/nearestbirthday", userController_1.getNearestBirthday);
router.put("/person/:name", userController_1.updatePerson);
router.delete("/person/:name", userController_1.deletePerson);
router.get("/person/:name", userController_1.getPersonBirthday);
exports.default = router;
