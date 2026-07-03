import User from "../models/User.js";
import createJWT from "../utils/createJWT.js";
import createId from "../utils/createId.js";

const registerUser = async (req, res) => {
    //Not duplicate emails
    const { email } = req.body;
    const existsUser = await User.findOne({ email });

    if (existsUser) {
        const error = new Error("User already exists");
        return res.status(400).json({ msg: error.message });
    }

    try {
        const user = new User(req.body);
        user.token = createId();
        const userSaved = await user.save();
        res.json(userSaved);
    } catch (error) {
        return res.status(403).json({ msg: error.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        const error = new Error("The user does not exist");
        return res.status(404).json({ msg: error.message });
    }

    if (await user.checkPassword(password)) {
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: createJWT(user._id)
        });
    } else {
        const error = new Error("The password is incorrect");
        return res.status(403).json({ msg: error.message });
    }
};

const profile = async (req, res) => {
    const { user } = req;

    res.json(user);
};

export { registerUser, loginUser, profile };
