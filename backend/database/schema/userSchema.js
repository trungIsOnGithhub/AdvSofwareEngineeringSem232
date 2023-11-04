import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true, index: "text" },
    password: { type: String, required: true },
    email: { type: String, required: true, index: {type: "hashed", unique: true} },
    role: {type: String, required: true},
    setting: { type: String }
});

export default UserSchema;