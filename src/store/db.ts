import { Sequelize } from 'sequelize-typescript';
import { User } from '../models/user.model.js';
import { Role } from '../models/role.model.js';
import { Permission } from '../models/permission.model.js';
import { RolePermission } from '../models/rolePermission.model.js';

export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'dpg-d4mmvfodl3ps73e7nt10-a.oregon-postgres.render.com',
  port: 5432,
  username: 'admin',
  password: '5csuDYohl7PnmyKhj7hGmavdYhzDbp5d',
  database: 'edulinkdb',
  models: [User, Role, Permission, RolePermission],
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});
