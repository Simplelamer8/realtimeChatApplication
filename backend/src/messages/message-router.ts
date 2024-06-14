import { Router } from "express";
import { MessageService } from "./message-service";
import { addMessage, createChat, findChat, getMessages, sendMessage, userChats } from "./message-controller";

const messageRouter = Router();

const messageService = new MessageService();

messageRouter.post("/chat/", createChat);
messageRouter.get("/chat/:userId", userChats);
messageRouter.get("/chat/find/:firstId/:secondId", findChat);
messageRouter.post("/chat/send/:id", sendMessage);
messageRouter.post("/message/", addMessage);
messageRouter.get("/:chatId/", getMessages);

export default messageRouter;