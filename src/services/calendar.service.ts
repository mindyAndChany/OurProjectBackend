// src/services/calendar.service.ts
import { CalendarEvent } from '../models/calendar_event.model.js';

export const getEvents = async () => {
  const events = await CalendarEvent.findAll();
  return events;
};
// export const addEvent = async (eventData: {
//   title: string;
//   type: string;
//   date: string;
//   time_start: string;
//   time_end: string;
//   notes?: string;
// }) => {
//   return await CalendarEvent.create(eventData);
// };
export const addEvent = async (eventData: {
  title: string;
  type: string;
  date: string;
  time_start?: string;
  time_end?: string;
  notes?: string;
}) => {
  const cleanData = {
    ...eventData,
    time_start: eventData.time_start?.trim() || null,
    time_end: eventData.time_end?.trim() || null,
  };

  return await CalendarEvent.create(cleanData);
};
export const updateEventById = async (
  id: number,
  eventData: Partial<{
    title: string;
    type: string;
    date: string;
    time_start?: string;
    time_end?: string;
    notes?: string;
  }>
) => {
  const event = await CalendarEvent.findByPk(id);
  if (!event) return null;

  const cleanData = {
    ...eventData,
    time_start: eventData.time_start?.trim() ?? event.time_start,
    time_end: eventData.time_end?.trim() ?? event.time_end,
  };

  await event.update(cleanData);
  return event;
};

export const deleteEventById = async (id: number) => {
  const deleted = await CalendarEvent.destroy({ where: { id } });
  return deleted > 0;
};