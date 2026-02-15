import { Request, Response } from 'express';
import {
  addRolePermission,
  deleteRolePermissionByKeys,
  getRolePermissionByKeys,
  getRolePermissions,
  updateRolePermissionByKeys,
} from '../services/rolePermissions.service.js';

export const getRolePermissionsHandler = async (_req: Request, res: Response) => {
  try {
    const items = await getRolePermissions();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch role permissions' });
  }
};

export const getRolePermissionByKeysHandler = async (req: Request, res: Response) => {
  try {
    const { roleId, permissionId } = req.params;
    const item = await getRolePermissionByKeys(Number(roleId), Number(permissionId));
    if (!item) return res.status(404).json({ error: 'Role permission not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch role permission' });
  }
};

export const addRolePermissionHandler = async (req: Request, res: Response) => {
  try {
    const item = await addRolePermission(req.body);
    res.status(201).json(item);
  } catch (error: any) {
    const status = error?.name === 'SequelizeUniqueConstraintError' ? 409 : 500;
    res.status(status).json({ error: 'Failed to add role permission', details: error?.message });
  }
};

export const updateRolePermissionHandler = async (req: Request, res: Response) => {
  try {
    const { roleId, permissionId } = req.params;
    const updated = await updateRolePermissionByKeys(Number(roleId), Number(permissionId), req.body);
    if (!updated) return res.status(404).json({ error: 'Role permission not found' });
    res.json(updated);
  } catch (error: any) {
    const status = error?.name === 'SequelizeUniqueConstraintError' ? 409 : 500;
    res.status(status).json({ error: 'Failed to update role permission', details: error?.message });
  }
};

export const deleteRolePermissionHandler = async (req: Request, res: Response) => {
  try {
    const { roleId, permissionId } = req.params;
    const deleted = await deleteRolePermissionByKeys(Number(roleId), Number(permissionId));
    if (!deleted) return res.status(404).json({ error: 'Role permission not found' });
    res.json({ message: 'Role permission deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete role permission' });
  }
};
