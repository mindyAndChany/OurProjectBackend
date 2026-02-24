import { Permission } from '../models/permission.model.js';
import { Op } from 'sequelize';

export type AddPermissionInput = {
  screen_name: string;
  can_view: boolean;
  can_edit: boolean;
};

export type UpdatePermissionInput = Partial<AddPermissionInput>;

const makeValidationError = (message: string) => {
  const error = new Error(message) as Error & { name: string };
  error.name = 'ValidationError';
  return error;
};

const makeUniqueConstraintError = (message: string) => {
  const error = new Error(message) as Error & { name: string };
  error.name = 'SequelizeUniqueConstraintError';
  return error;
};

const ensureValidPermissionMode = (canView: boolean, canEdit: boolean) => {
  if (canView !== true) {
    throw makeValidationError('For a screen permission, can_view must be true');
  }

  if (canEdit !== true && canEdit !== false) {
    throw makeValidationError('can_edit must be a boolean value');
  }
};

export const getPermissions = async () => {
  return await Permission.findAll();
};

export const getPermissionById = async (id: number) => {
  return await Permission.findByPk(id);
};

export const addPermission = async (data: AddPermissionInput) => {
  const screenName = data?.screen_name?.trim();
  if (!screenName) {
    throw makeValidationError('screen_name is required');
  }

  if (typeof data.can_view !== 'boolean' || typeof data.can_edit !== 'boolean') {
    throw makeValidationError('can_view and can_edit must be boolean values');
  }

  ensureValidPermissionMode(data.can_view, data.can_edit);

  const existing = await Permission.findOne({
    where: { screen_name: screenName, can_view: data.can_view, can_edit: data.can_edit },
  });
  if (existing) {
    throw makeUniqueConstraintError(
      `Permission variant already exists for screen_name '${screenName}' (id=${existing.id}, can_view=${data.can_view}, can_edit=${data.can_edit}).`,
    );
  }

  return await Permission.create({ ...data, screen_name: screenName } as any);
};

export const updatePermissionById = async (id: number, data: UpdatePermissionInput) => {
  const item = await Permission.findByPk(id);
  if (!item) return null;

  const updateData: UpdatePermissionInput = { ...data };
  if (typeof updateData.screen_name === 'string') {
    const screenName = updateData.screen_name.trim();
    if (!screenName) {
      throw makeValidationError('screen_name cannot be empty');
    }

    const existing = await Permission.findOne({
      where: {
        screen_name: screenName,
        id: { [Op.ne]: id },
      },
    });
    if (existing) {
      throw makeUniqueConstraintError(
        `Permission for screen_name '${screenName}' already exists (id=${existing.id}).`,
      );
    }

    updateData.screen_name = screenName;
  }

  if (
    updateData.can_view !== undefined &&
    typeof updateData.can_view !== 'boolean'
  ) {
    throw makeValidationError('can_view must be a boolean value');
  }
  if (
    updateData.can_edit !== undefined &&
    typeof updateData.can_edit !== 'boolean'
  ) {
    throw makeValidationError('can_edit must be a boolean value');
  }

  const nextScreenName =
    typeof updateData.screen_name === 'string' ? updateData.screen_name : item.screen_name;
  const nextCanView =
    typeof updateData.can_view === 'boolean' ? updateData.can_view : item.can_view;
  const nextCanEdit =
    typeof updateData.can_edit === 'boolean' ? updateData.can_edit : item.can_edit;

  ensureValidPermissionMode(nextCanView, nextCanEdit);

  const conflict = await Permission.findOne({
    where: {
      screen_name: nextScreenName,
      can_view: nextCanView,
      can_edit: nextCanEdit,
      id: { [Op.ne]: id },
    },
  });

  if (conflict) {
    throw makeUniqueConstraintError(
      `Permission variant already exists for screen_name '${nextScreenName}' (id=${conflict.id}, can_view=${nextCanView}, can_edit=${nextCanEdit}).`,
    );
  }

  await item.update(updateData);
  return item;
};

export const deletePermissionById = async (id: number) => {
  const deleted = await Permission.destroy({ where: { id } });
  return deleted > 0;
};
