import mongoose from "mongoose";
import { Snowflake } from "nodejs-snowflake"

import UserSchema from "../schema/userSchema.js";


const userMongoModel = mongoose.model("User", UserSchema, "Users");

class UserModel {
    static async searchUser(userEmail) {
        var result = await userMongoModel.find({email: userEmail})
        return result;
    }

    static async getUser(userID) {
        var result = await userMongoModel.find({_id: userID})
        return result;
    }

    static async setSetting(userID, newSetting) {
        
    }

    static async insertUser(name, hashPassword, email) {
        try {
            const uidGen = new Snowflake();
            result = await userMongoModel.create({
                _id: uidGen.getUniqueID(),
                name: name,
                password: hashPassword,
                email: email,
                role: "student"
            })
            console.log(result);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }

    }
}


export default UserModel;