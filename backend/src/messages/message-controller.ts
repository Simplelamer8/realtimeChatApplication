import { Request, Response } from "express";
import { MessageService } from "./message-service";
import { messageInterface } from "./types/message";
import ChatModel from "./models/Chat.model";
import MessageModel from "./models/Message.model";

export const sendMessage = async(req: Request, res: Response):Promise<void> => {
    try{
        const {message} = req.body;
        const {id} = req.params;
    }
    catch(error)
    {
        res.status(500).json({message: "Error sending message"});
    }
}
//6669dd511682ee18605440df
//6669dd650275dfac5e7232ef
export const createChat = async (req: Request, res: Response):Promise<void> => {
    const newChat = new ChatModel({
        members: [req.body.senderId, req.body.receiverId]
    })

    try {
        const result = await newChat.save();
        res.status(200).json(result);
    }
    catch(error)
    {
        res.status(500).json(error);
    }
}

export const userChats = async (req: Request, res: Response):Promise<void> => {
  
    try {
        const chat = await ChatModel.find({
            members: {$in: [req.params.userId]}
        })
        res.status(200).json(chat);
    }
    catch(error)
    {
        res.status(500).json(error);
    }
}

export const findChat = async (req: Request, res: Response):Promise<void> => {
  
    try {
        const chat = await ChatModel.findOne({
            members: {$all: [req.params.firstId, req.params.secondId]}
        });

    }
    catch(error)
    {
        res.status(500).json(error);
    }
}

export const addMessage = async (req, res) => {
    const {chatId, senderId, text} = req.body;
    const message = new MessageModel({
        chatId, 
        senderId, 
        text
    });

    try
    {
        const result = await message.save();
        res.status(200).json(result);
    }
    catch(error)
    {
        res.status(500).json(error)
    }
}

export const getMessages = async (req, res) => {
    const {chatId} = req.params;

    try
    {
        const result = await MessageModel.find({chatId});
        res.status(200).json(result);
    }
    catch(error)
    {
        res.status(500).json(error)
    }
}