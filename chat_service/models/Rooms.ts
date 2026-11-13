import mongoose from "mongoose";

export interface ChatRoom {
    createdBy: string;
    member: string;
}

const { Schema } = mongoose;

const RoomsSchema = new Schema<ChatRoom>({
    createdBy: {
        type: String,
        required: true
    },
    member: {
        type: String,
        required: true
    }
});

const Rooms = mongoose.model("Rooms", RoomsSchema);

export default Rooms;
