import { Router } from "express";
import {
    registerUser,
    loginUser,
    profile
} from "../controllers/userController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = Router();

//Authentication, register and confirm users

router.post("/register", registerUser); //Create new user
router.post("/login", loginUser); //Create new user
router.get("/profile", checkAuth, profile);

export default router;
