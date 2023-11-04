export const checkEmail = async (req, res) => {
    
}

export const CreateUser = async (req, res) => {
    let { email, username, password } = req.body;
    
}

export const Login = async (req, res) => {

}

export const verifyuser = async (req, res) => {
    if (!req.headers.authorization) {
        return res.status(403).json({ error: 'No credentials sent!' });
    }
}