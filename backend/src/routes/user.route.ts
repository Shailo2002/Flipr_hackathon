import express from "express"
import { getUserData } from "../controllers/user.controller.js";
import { isAuth } from "../middlewares/isAuth.js";

const userRouter= express.Router();

userRouter.get("/current", isAuth, getUserData);

export default userRouter;