import express from "express";
import { createExam, getExam } from "../controller/examController.js";

const router = express.Router();

router.get('/exam/:user', getExam);
router.post('/exam', createExam)



export default router;