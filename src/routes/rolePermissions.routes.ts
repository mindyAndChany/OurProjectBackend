import { Router } from 'express';
import {
  addRolePermissionHandler,
  deleteRolePermissionHandler,
  getRolePermissionByKeysHandler,
  getRolePermissionsHandler,
  updateRolePermissionHandler,
} from '../controllers/rolePermissions.controller.js';

/**
 * @openapi
 * /api/role-permissions:
 *   get:
 *     summary: Get all role permissions
 *     tags:
 *       - RolePermissions
 *     responses:
 *       200:
 *         description: List of role permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RolePermission'
 *   post:
 *     summary: Add a new role permission
 *     tags:
 *       - RolePermissions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RolePermissionCreateRequest'
 *     responses:
 *       201:
 *         description: Role permission created
 * /api/role-permissions/{roleId}/{permissionId}:
 *   get:
 *     summary: Get role permission by roleId and permissionId
 *     tags:
 *       - RolePermissions
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: permissionId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Role permission
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RolePermission'
 *   put:
 *     summary: Update a role permission
 *     tags:
 *       - RolePermissions
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: permissionId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RolePermissionUpdateRequest'
 *     responses:
 *       200:
 *         description: Role permission updated
 *   delete:
 *     summary: Delete a role permission
 *     tags:
 *       - RolePermissions
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: permissionId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Role permission deleted
 */
const router = Router();

router.get('/', getRolePermissionsHandler);
router.get('/:roleId/:permissionId', getRolePermissionByKeysHandler);
router.post('/', addRolePermissionHandler);
router.put('/:roleId/:permissionId', updateRolePermissionHandler);
router.delete('/:roleId/:permissionId', deleteRolePermissionHandler);

export default router;
