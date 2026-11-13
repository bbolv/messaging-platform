import mongoose from "mongoose";

export interface ChatGroup {
    createdBy: string;
    members: unknown[];
    groupName?: string;
}

const { Schema } = mongoose;

const GroupsSchema = new Schema<ChatGroup>({
    createdBy: {
        type: String,
        required: true
    },
    members: {
        type: Array,
        required: true
    },
    groupName: {
        type: String
    }
});

const Groups = mongoose.model("Groups", GroupsSchema);

export default Groups;
