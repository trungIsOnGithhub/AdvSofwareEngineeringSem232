import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

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