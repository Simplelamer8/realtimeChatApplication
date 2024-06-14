import mongoose, { Schema } from "mongoose";
import { chatInterface } from "../types/chat";

const ChatSchema:Schema = new Schema({
    members: {
        type: Array
    },
}, {timestamps: true})

const ChatModel = mongoose.model<chatInterface>("Chat", ChatSchema);

export default ChatModel;