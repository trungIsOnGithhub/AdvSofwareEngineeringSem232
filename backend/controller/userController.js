
import UserModel from "../database/model/userModel.js";
import Authentication from "../middleware/auth.js";

export const checkEmail = async (req, res) => {
    let { email } = req.body;
    let userList = await UserModel.searchUser(email);
    if (0 != userList.length) {
        res.json({"error": "email already claimed"})
    }
}

export const CreateUser = async (req, res) => {
    let { email, username, password } = req.body;
    let userList = await UserModel.searchUser(email);
    if (0 != userList.length) {
        res.json({"error": "email already claimed"})
    }
    UserModel.insertUser(username, await Authentication.hashPassword(password), email);
    res.status(202).json({"result": "user created with email " + email});
    
}

export const Login = async (req, res) => {
    let { email, password } = req.body;
    let userList = await UserModel.searchUser(email);
    if (0 == userList.length) {
        res.status(404).json({"error": "user not found"})
    }
    if (await Authentication.verifyPassword(password, userList[0].password)) {
        res.json(await Authentication.createToken({
            "id":userList[0]._id,
            "email": userList[0].email
        }))
    }

}

export const verifyuser = async (req, res) => {
    if (!req.headers.authorization) {
        return res.status(403).json({ error: 'No credentials sent!' });
    }
}