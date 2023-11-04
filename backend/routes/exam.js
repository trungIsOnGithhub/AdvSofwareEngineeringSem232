import express from "express";

const router = express.Router();

router.get('/exam', async (req, res) => {
    try {
        res.json("Exam");
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
});

module.exports = router;