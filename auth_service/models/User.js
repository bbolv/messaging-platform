import bcrypt from "bcrypt";

import { Schema, model } from "mongoose";

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String
    }
});

// Hash password

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.checkPassword = async function (passwordForm) {
    return await bcrypt.compare(passwordForm, this.password);
};

const User = model("User", UserSchema);

export default User;
