import mongoose from "mongoose";

export interface ChatMessage {
    message: { text: string; isScribble: boolean };
    sender: string;
    chatId: string;
    createdAt: Date;
    updatedAt: Date;
}

const { Schema } = mongoose;

const MessageSchema = new Schema<ChatMessage>(
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
