import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';
import { Permission } from '../models/permission.model';
import { RolePermission } from '../models/rolePermission.model';

@Module({
  imports: [SequelizeModule.forFeature([User, Role, Permission, RolePermission])],
  providers: [AuthService],
  exports: [AuthService], 
})
export class AuthModule {}
