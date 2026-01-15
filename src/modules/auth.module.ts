import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthService } from '../services/auth.service.js';
import { User } from '../models/user.model.js';
import { Role } from '../models/role.model.js';
import { Permission } from '../models/permission.model.js';
import { RolePermission } from '../models/rolePermission.model.js';

@Module({
  imports: [SequelizeModule.forFeature([User, Role, Permission, RolePermission])],
  providers: [AuthService],
  exports: [AuthService], 
})
export class AuthModule {}
