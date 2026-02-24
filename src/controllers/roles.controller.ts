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
    console.log('🔵 addRoleHandler - Received data:', JSON.stringify(req.body, null, 2));
    
    // ✅ בדיקה אם התפקיד כבר קיים לפני הניסיון ליצור
    const existing = await getRoles();
    console.log('📋 Existing roles:', existing.map(r => ({ id: r.id, name: r.name })));
    
    const item = await addRole(req.body);
    console.log('✅ Role created successfully:', item.toJSON());
    res.status(201).json(item);
  } catch (error: any) {
    console.error('❌ addRoleHandler error:', {
      name: error?.name,
      message: error?.message,
      errors: error?.errors,
      fields: error?.fields,
      original: error?.original?.message
    });
    const status = error?.name === 'SequelizeUniqueConstraintError' ? 409 : 500;
    const details = error?.name === 'SequelizeUniqueConstraintError' 
      ? `תפקיד עם השם "${req.body?.name}" כבר קיים במערכת` 
      : error?.message;
    res.status(status).json({ error: 'Failed to add role', details });
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
