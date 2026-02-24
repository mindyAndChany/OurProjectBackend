import { User } from '../models/user.model.js';
import { RolePermission } from '../models/rolePermission.model.js';
import { Permission } from '../models/permission.model.js';
import { Role } from '../models/role.model.js';
import { comparePassword } from '../utils/hash.util.js';

import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  async login(email: string, password: string) {
    return login(email, password); // או תקרא לפונקציה הזו ישירות אם היא בקובץ הזה
  }
}

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

  const permissionsByScreen = new Map<string, { screen_name: string; can_view: boolean; can_edit: boolean }>();

  for (const rp of rolePermissions) {
    const screenName = rp.permission.screen_name;
    if (!permissionsByScreen.has(screenName)) {
      permissionsByScreen.set(screenName, {
        screen_name: screenName,
        can_view: rp.permission.can_view,
        can_edit: rp.permission.can_edit,
      });
    }
  }

  const permissions = Array.from(permissionsByScreen.values());

  return {
    id: user.id,
    name: user.name,
    institution_code: user.institution_code,
    role: user.role.name,
    permissions,
  };
};
