import { Request, Response } from 'express';
import { addRoom, deleteRoomById, getRooms, updateRoomById } from '../services/rooms.service.js';

export const getRoomsHandler = async (_req: Request, res: Response) => {
  try {
    const items = await getRooms();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
};

export const addRoomHandler = async (req: Request, res: Response) => {
  try {
    const item = await addRoom(req.body);
    res.status(201).json(item);
  } catch (error: any) {
    const status = error?.name === 'SequelizeUniqueConstraintError' ? 409 : 500;
    res.status(status).json({ error: 'Failed to add room', details: error?.message });
  }
};

export const updateRoomHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await updateRoomById(Number(id), req.body);
    if (!updated) return res.status(404).json({ error: 'Room not found' });
    res.json(updated);
  } catch (error: any) {
    const status = error?.name === 'SequelizeUniqueConstraintError' ? 409 : 500;
    res.status(status).json({ error: 'Failed to update room', details: error?.message });
  }
};

export const deleteRoomHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await deleteRoomById(Number(id));
    if (!deleted) return res.status(404).json({ error: 'Room not found' });
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete room' });
  }
};
