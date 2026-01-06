// src/routes/calendar.routes.ts
import { Router } from 'express';
import { getCalendarEventsHandler,
      addCalendarEventHandler
 } from '../controllers/calendar.controller.js';

const router = Router();
/**
 * @openapi
 * /api/calendar-events:
 *   get:
 *     summary: Get all calendar events
 *     tags:
 *       - Calendar
 *     responses:
 *       200:
 *         description: List of calendar events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CalendarEvent'
 *       500:
 *         description: Server error
 */
router.get('/', getCalendarEventsHandler);
/**
 * @openapi
 * /api/calendar-events:
 *   post:
 *     summary: Add a new calendar event
 *     tags:
 *       - Calendar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CalendarEvent'
 *     responses:
 *       201:
 *         description: Event created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CalendarEvent'
 *       500:
 *         description: Failed to create event
 */
router.post('/', addCalendarEventHandler);


export default router;
