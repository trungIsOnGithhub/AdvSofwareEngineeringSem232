import express from "express";
import { createExam, getExam } from "../controller/examController.js";

const router = express.Router();

router.get('/', getExam);
router.post('/', createExam)



export default router;