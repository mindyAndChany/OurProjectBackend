// src/controllers/calendar.controller.ts
import { Request, Response } from 'express';
import { getEvents, addEvent,updateEventById,deleteEventById } from '../services/calendar.service.js';

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
export const updateCalendarEventHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await updateEventById(Number(id), req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update event' });
  }
};

export const deleteCalendarEventHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await deleteEventById(Number(id));
    if (!deleted) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete event' });
  }
};
