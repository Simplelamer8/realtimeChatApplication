import mongoose from 'mongoose';
import { CreateEventDto } from './dtos/CreateEvent.dot';
import EventModel, { IEvent } from './models/Event';
import { Event } from './types/response';
import UserModel from '../auth/models/User';



// this event service instance shows how to create a event, get a event by id, and get all events with in-memory data
class EventService {
  
    async getEventById(id: string): Promise<IEvent | null> {
      return await EventModel.findById(id).exec();
    }

    async getEvents(userId: string): Promise<IEvent[]> {
      const user = await UserModel.findById(userId).exec();

      if (!user)
      {
        throw new Error("User not found!");
      }

      return await EventModel.find({ location: { $regex: user.city, $options: 'i' } }).sort({rating: -1}).limit(5).exec();
    }

    async createEvent(createEventDto: CreateEventDto): Promise<IEvent> {
      const { name, description, date, location ,duration, rating} = createEventDto;
      const newEvent = new EventModel({
        name,
        description,
        date: new Date(date),
        location,
        duration,
        rating
      });
  
      await newEvent.save();
      return newEvent;
    }
  
    
  }
  
  export default EventService;
  