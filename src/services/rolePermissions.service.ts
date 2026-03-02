import { RolePermission } from '../models/rolePermission.model.js';
import { Permission } from '../models/permission.model.js';

export type AddRolePermissionInput = {
  role_id: number;
  permission_id: number;
};

export type UpdateRolePermissionInput = Partial<AddRolePermissionInput> & {
  can_view?: boolean;
  can_edit?: boolean;
  canView?: boolean;
  canEdit?: boolean;
  new?: {
    can_view?: boolean;
    can_edit?: boolean;
    canView?: boolean;
    canEdit?: boolean;
  };
};

const makeUniqueConstraintError = (message: string) => {
  const error = new Error(message) as Error & { name: string };
  error.name = 'SequelizeUniqueConstraintError';
  return error;
};

const makeValidationError = (message: string) => {
  const error = new Error(message) as Error & { name: string };
  error.name = 'ValidationError';
  return error;
};

export const getRolePermissions = async () => {
  const rows = await RolePermission.findAll({ include: [Permission], order: [['id', 'ASC']] });
  const unique = new Map<string, RolePermission>();

  for (const row of rows) {
    const key = `${row.role_id}:${row.permission_id}`;
    if (!unique.has(key)) unique.set(key, row);
  }

  return Array.from(unique.values());
};

export const getRolePermissionByKeys = async (roleId: number, permissionId: number) => {
  return await RolePermission.findOne({
    where: { role_id: roleId, permission_id: permissionId },
    include: [Permission],
  });
};

export const addRolePermission = async (data: AddRolePermissionInput) => {
  const existing = await RolePermission.findOne({
    where: { role_id: data.role_id, permission_id: data.permission_id },
  });
  if (existing) {
    throw makeUniqueConstraintError('Role already has this permission');
  }

  return await RolePermission.create(data as any);
};

export const updateRolePermissionByKeys = async (
  roleId: number,
  permissionId: number,
  data: UpdateRolePermissionInput,
) => {
  const item = await RolePermission.findOne({
    where: { role_id: roleId, permission_id: permissionId },
    include: [Permission],
  });
  if (!item) return null;

  const payload = data?.new && typeof data.new === 'object'
    ? { ...data, ...data.new }
    : data;

  let nextRoleId = payload.role_id ?? roleId;
  let nextPermissionId = payload.permission_id ?? permissionId;

  const incomingCanView = payload.can_view ?? payload.canView;
  const incomingCanEdit = payload.can_edit ?? payload.canEdit;

  const hasCanView = incomingCanView !== undefined;
  const hasCanEdit = incomingCanEdit !== undefined;
  if (hasCanView || hasCanEdit) {
    if (hasCanView && typeof incomingCanView !== 'boolean') {
      throw makeValidationError('can_view must be a boolean value');
    }
    if (hasCanEdit && typeof incomingCanEdit !== 'boolean') {
      throw makeValidationError('can_edit must be a boolean value');
    }

    const currentPermission =
      item.permission ?? (await Permission.findByPk(item.permission_id));
    if (!currentPermission) {
      throw makeValidationError('Current permission was not found');
    }

    if (hasCanView && incomingCanView === false) {
      await item.destroy();
      return {
        deleted: true,
        id: item.id,
        role_id: item.role_id,
        permission_id: item.permission_id,
      } as any;
    }

    const targetCanView = hasCanView ? (incomingCanView as boolean) : currentPermission.can_view;
    const targetCanEdit = hasCanEdit ? (incomingCanEdit as boolean) : currentPermission.can_edit;

    if (targetCanView !== true) {
      throw makeValidationError('For screen permissions, can_view must be true');
    }

    const targetPermission = await Permission.findOne({
      where: {
        screen_name: currentPermission.screen_name,
        can_view: targetCanView,
        can_edit: targetCanEdit,
      },
    });

    if (!targetPermission) {
      throw makeValidationError(
        `No permission variant exists for screen '${currentPermission.screen_name}' with can_view=${targetCanView} and can_edit=${targetCanEdit}`,
      );
    }

    nextPermissionId = targetPermission.id;
  }

  const keyChanged = nextRoleId !== roleId || nextPermissionId !== permissionId;

  if (keyChanged) {
    const conflict = await RolePermission.findOne({
      where: { role_id: nextRoleId, permission_id: nextPermissionId },
    });
    if (conflict) {
      throw makeUniqueConstraintError('Role already has this permission');
    }
  }

  await item.update({ role_id: nextRoleId, permission_id: nextPermissionId } as any);
  return await getRolePermissionByKeys(nextRoleId, nextPermissionId);
};

export const deleteRolePermissionByKeys = async (roleId: number, permissionId: number) => {
  const deleted = await RolePermission.destroy({ where: { role_id: roleId, permission_id: permissionId } });
  return deleted > 0;
};
