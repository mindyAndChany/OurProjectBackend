import { Router } from 'express';
import { addRoomHandler, deleteRoomHandler, getRoomsHandler, updateRoomHandler } from '../controllers/rooms.controller.js';

/**
 * @openapi
 * /api/rooms:
 *   get:
 *     summary: Get all rooms
 *     tags:
 *       - Rooms
 *     responses:
 *       200:
 *         description: List of rooms
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Room'
 *   post:
 *     summary: Add a new room
 *     tags:
 *       - Rooms
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RoomCreateRequest'
 *     responses:
 *       201:
 *         description: Room created
 * /api/rooms/{id}:
 *   put:
 *     summary: Update a room
 *     tags:
 *       - Rooms
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
 *             $ref: '#/components/schemas/RoomUpdateRequest'
 *     responses:
 *       200:
 *         description: Room updated
 *   delete:
 *     summary: Delete a room
 *     tags:
 *       - Rooms
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Room deleted
 */
const router = Router();

router.get('/', getRoomsHandler);
router.post('/', addRoomHandler);
router.put('/:id', updateRoomHandler);
router.delete('/:id', deleteRoomHandler);

export default router;
