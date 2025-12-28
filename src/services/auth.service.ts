import { User } from '../models/user.model.js';
import { RolePermission } from '../models/rolePermission.model.js';
import { Permission } from '../models/permission.model.js';
import { Role } from '../models/role.model.js';
import { comparePassword } from '../utils/hash.util.js';

export const login = async (email: string, password: string) => {
  const user = await User.findOne({
    where: { email, active: true },
    include: [Role],
  });

  if (!user || !(await comparePassword(password, user.password_hash))) {
    throw new Error('Invalid credentials');
  }

  const rolePermissions = await RolePermission.findAll({
    where: { role_id: user.role_id },
    include: [Permission],
  });

  const permissions = rolePermissions.map((rp) => ({
    screen_name: rp.permission.screen_name,
    can_view: rp.permission.can_view,
    can_edit: rp.permission.can_edit,
  }));

  return {
    id: user.id,
    name: user.name,
    institution_code: user.institution_code,
    role: user.role.name,
    permissions,
  };
};
