import mongoose from "mongoose";

const { Schema } = mongoose;

const MessageSchema = new Schema(
    {
        message: {
            text: {
                type: String,
                required: true
            },
            isScribble: {
                type: Boolean,
                default: false
            }
        },
        sender: {
            type: String,
            required: true
        },
        chatId: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Message = mongoose.model("Message", MessageSchema);

export default Message;
