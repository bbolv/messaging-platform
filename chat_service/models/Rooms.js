import mongoose from "mongoose";

const { Schema } = mongoose;

const RoomsSchema = new Schema({
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
