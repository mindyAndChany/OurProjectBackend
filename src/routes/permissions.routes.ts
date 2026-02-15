import { Router } from 'express';
import {
  addPermissionHandler,
  deletePermissionHandler,
  getPermissionByIdHandler,
  getPermissionsHandler,
  updatePermissionHandler,
} from '../controllers/permissions.controller.js';

/**
 * @openapi
 * /api/permissions:
 *   get:
 *     summary: Get all permissions
 *     tags:
 *       - Permissions
 *     responses:
 *       200:
 *         description: List of permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PermissionFull'
 *   post:
 *     summary: Add a new permission
 *     tags:
 *       - Permissions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PermissionCreateRequest'
 *     responses:
 *       201:
 *         description: Permission created
 * /api/permissions/{id}:
 *   get:
 *     summary: Get permission by id
 *     tags:
 *       - Permissions
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Permission
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PermissionFull'
 *   put:
 *     summary: Update a permission
 *     tags:
 *       - Permissions
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PermissionUpdateRequest'
 *     responses:
 *       200:
 *         description: Permission updated
 *   delete:
 *     summary: Delete a permission
 *     tags:
 *       - Permissions
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Permission deleted
 */
const router = Router();

router.get('/', getPermissionsHandler);
router.get('/:id', getPermissionByIdHandler);
router.post('/', addPermissionHandler);
router.put('/:id', updatePermissionHandler);
router.delete('/:id', deletePermissionHandler);

export default router;
