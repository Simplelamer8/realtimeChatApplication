import { Router } from 'express';
import authRouter from './auth/auth-router';
import eventRouter from './events/event-router';
import messageRouter from './messages/message-router';
// other routers can be imported here

const globalRouter = Router();


globalRouter.use(authRouter);
globalRouter.use(eventRouter);
globalRouter.use(messageRouter);


// other routers can be added here

export default globalRouter;
