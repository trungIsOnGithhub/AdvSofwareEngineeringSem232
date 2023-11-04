import express from "express";
import { CreateUser } from "../controller/userController.js";

const UserRouter = express.Router();

UserRouter.post('/register', CreateUser);

export default UserRouter;