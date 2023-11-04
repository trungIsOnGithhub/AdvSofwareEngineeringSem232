import express from "express";

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        res.json("Exam");
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
});

export default router;