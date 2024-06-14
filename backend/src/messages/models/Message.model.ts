import mongoose, { Schema } from "mongoose";
import { messageInterface } from "../types/message";

const messageSchema:Schema = new Schema({
    chatId: {
        type: String
    },
    senderId: {
        type: String
    },
    text: {
        type: String
    }
}, {timestamps: true})

const MessageModel = mongoose.model<messageInterface>("Message", messageSchema);

export default MessageModel;