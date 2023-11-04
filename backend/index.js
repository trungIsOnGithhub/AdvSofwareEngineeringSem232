import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import examRoute from './routes/exam.js';
import questionRoute from './routes/question.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/exam', examRoute);
app.use('/api/question', questionRoute);

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        const PORT = process.env.PORT || 8800;
        console.log("Connect to MongoDB");
        app.listen(PORT, () => {
            console.log(`Backend is running on port ${PORT}`);
        })
    })
    .catch(err => {
        console.log(err);
    })