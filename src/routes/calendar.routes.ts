// src/routes/calendar.routes.ts
import { Router } from 'express';
import { getCalendarEventsHandler,
      addCalendarEventHandler,
        updateCalendarEventHandler,
        deleteCalendarEventHandler
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

// עדכון אירוע לפי מזהה
/**
 * @openapi
 * /api/calendar-events/{id}:
 *   put:
 *     summary: Update calendar event
 *     tags:
 *       - Calendar
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Event updated
 *
 *   delete:
 *     summary: Delete calendar event
 *     tags:
 *       - Calendar
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event deleted
 */
router.put('/:id', updateCalendarEventHandler);
router.delete('/:id', deleteCalendarEventHandler);

export default router;  