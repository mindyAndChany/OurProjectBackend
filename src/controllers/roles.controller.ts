import { Request, Response } from 'express';
import { addRole, deleteRoleById, getRoleById, getRoles, updateRoleById } from '../services/roles.service.js';

export const getRolesHandler = async (_req: Request, res: Response) => {
  try {
    const items = await getRoles();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch roles' });
  }
};

export const getRoleByIdHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await getRoleById(Number(id));
    if (!item) return res.status(404).json({ error: 'Role not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch role' });
  }
};

export const addRoleHandler = async (req: Request, res: Response) => {
  try {
    const item = await addRole(req.body);
    res.status(201).json(item);
  } catch (error: any) {
    const status = error?.name === 'SequelizeUniqueConstraintError' ? 409 : 500;
    res.status(status).json({ error: 'Failed to add role', details: error?.message });
  }
};

export const updateRoleHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await updateRoleById(Number(id), req.body);
    if (!updated) return res.status(404).json({ error: 'Role not found' });
    res.json(updated);
  } catch (error: any) {
    const status = error?.name === 'SequelizeUniqueConstraintError' ? 409 : 500;
    res.status(status).json({ error: 'Failed to update role', details: error?.message });
  }
};

export const deleteRoleHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await deleteRoleById(Number(id));
    if (!deleted) return res.status(404).json({ error: 'Role not found' });
    res.json({ message: 'Role deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete role' });
  }
};
