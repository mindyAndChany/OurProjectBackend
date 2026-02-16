import { Request, Response } from 'express';
import {
  addPermission,
  deletePermissionById,
  getPermissionById,
  getPermissions,
  updatePermissionById,
} from '../services/permissions.service.js';

export const getPermissionsHandler = async (_req: Request, res: Response) => {
  try {
    const items = await getPermissions();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch permissions' });
  }
};

export const getPermissionByIdHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await getPermissionById(Number(id));
    if (!item) return res.status(404).json({ error: 'Permission not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch permission' });
  }
};

export const addPermissionHandler = async (req: Request, res: Response) => {
  try {
    const item = await addPermission(req.body);
    res.status(201).json(item);
  } catch (error: any) {
    const status = error?.name === 'SequelizeUniqueConstraintError' ? 409 : 500;
    res.status(status).json({ error: 'Failed to add permission', details: error?.message });
  }
};

export const updatePermissionHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await updatePermissionById(Number(id), req.body);
    if (!updated) return res.status(404).json({ error: 'Permission not found' });
    res.json(updated);
  } catch (error: any) {
    const status = error?.name === 'SequelizeUniqueConstraintError' ? 409 : 500;
    res.status(status).json({ error: 'Failed to update permission', details: error?.message });
  }
};

export const deletePermissionHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await deletePermissionById(Number(id));
    if (!deleted) return res.status(404).json({ error: 'Permission not found' });
    res.json({ message: 'Permission deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete permission' });
  }
};
