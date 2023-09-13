import express from "express";
import {
  createUser,
  getNearestBirthdayapi,
  updatePerson,
  deletePerson,
  getPersonBirthday,
} from "../controllers/userController";

const router = express.Router();

router.post("/", createUser);
router.get("/nearestbirthday", getNearestBirthdayapi);
router.put("/person/:name", updatePerson);
router.delete("/person/:name", deletePerson);
router.get("/person/:name", getPersonBirthday);

export default router;
