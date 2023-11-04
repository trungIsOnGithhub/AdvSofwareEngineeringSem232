import express from 'express';
import Question from '../database/model/questionModel.js';

const router = express.Router();

router.get('/', async (req, res) => {
    res.json(await Question.find().lean().exec());
});

router.get('/:id', async (req, res) => {
    try {
        const question = await Question.findById(req.params.id).lean().exec();
        res.status(200).json(question);
    }
    catch (err) {
        console.log(err);
        res.status(400).json({
            message: "Question not found"
        })
    }
})

router.post('/', async (req, res) => {
    // Check if req.body is an array
    const questions = await Question.create(req.body);
    try {
        await questions.save();
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
    res.status(201).json(questions);
});

router.put('/:id', async (req, res) => {
    try {
        const question = await Question.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).lean().exec();
        res.status(200).json(question);
    }
    catch (err) {
        console.log(err);
        req.status(400).json(err);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const question = await Question.findByIdAndDelete(req.params.id).lean().exec();
        res.status(200).json(question);
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

export default router;