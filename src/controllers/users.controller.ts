import { Request, Response } from 'express';
import { addUser, deleteUserById, getUserById, getUsers, updateUserById } from '../services/users.service.js';

export const getUsersHandler = async (_req: Request, res: Response) => {
  try {
    const items = await getUsers();
    res.json(items);
  } catch (error: any) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users', details: error?.message });
  }
};

export const getUserByIdHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await getUserById(Number(id));
    if (!item) return res.status(404).json({ error: 'User not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

export const addUserHandler = async (req: Request, res: Response) => {
  try {
    const item = await addUser(req.body);
    res.status(201).json(item);
  } catch (error: any) {
    const status = error?.name === 'SequelizeUniqueConstraintError' ? 409 : 500;
    res.status(status).json({ error: 'Failed to add user', details: error?.message });
  }
};

export const updateUserHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await updateUserById(Number(id), req.body);
    if (!updated) return res.status(404).json({ error: 'User not found' });
    res.json(updated);
  } catch (error: any) {
    const status = error?.name === 'SequelizeUniqueConstraintError' ? 409 : 500;
    res.status(status).json({ error: 'Failed to update user', details: error?.message });
  }
};

export const deleteUserHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await deleteUserById(Number(id));
    if (!deleted) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};
