import express from "express";
import {
  createUser,
  getNearestBirthday,
  updatePerson,
  deletePerson,
  getPersonBirthday,
} from "../controllers/userController";

const router = express.Router();

router.post("/", createUser);
router.get("/nearestbirthday", getNearestBirthday);
router.put("/person/:name", updatePerson);
router.delete("/person/:name", deletePerson);
router.get("/person/:name", getPersonBirthday);

export default router;
