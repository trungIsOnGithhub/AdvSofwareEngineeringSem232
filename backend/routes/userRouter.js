import express from "express";

const UserRouter = express.Router();

UserRouter.get('/', async (req, res) => {
    try {
        req.body
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
});

export default UserRouter;