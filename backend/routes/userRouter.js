import express from "express";
import { CreateUser, Login } from "../controller/userController.js";

const UserRouter = express.Router();

UserRouter.post('/register', CreateUser);

UserRouter.get('/login', Login);

export default UserRouter;