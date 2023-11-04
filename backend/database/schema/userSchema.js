import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    username: { type: String, required: true, index: "text" },
    password: { type: String, required: true },
    email: { type: String, required: true, index: {type: "hashed", unique: true} },
    role: {type: String, required: true},
});

export default UserSchema;