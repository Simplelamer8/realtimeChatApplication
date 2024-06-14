import MessageModel from "./models/Message.model";

class MessageService{
    async sendMessage(messageObject){
        const {senderId, receiverId, message} = messageObject;
        const newMessage = new MessageModel({senderId, receiverId, message});

        await newMessage.save();
        return newMessage;
    }
}
export {MessageService};