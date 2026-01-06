// src/controllers/calendar.controller.ts
import { Request, Response } from 'express';
import { getEvents, addEvent  } from '../services/calendar.service.js';

export const getCalendarEventsHandler = async (req: Request, res: Response) => {
  try {
    const events = await getEvents();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};
export const addCalendarEventHandler = async (req: Request, res: Response) => {
  try {
    const event = await addEvent(req.body);
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add event' });
  }
};
