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
    image: {
        type: String
    },
    contacts: {
        type: Array,
        default: [] //It will save usernames
    },
    requests: {
        type: Array,
        default: [Object] //It will save usernames
    },
    chatContacts: {
        type: Array,
        default: []
    },
    groups: {
        type: Array,
        default: [Object]
    }
});

const Users = model("User", UserSchema);

export default Users;
