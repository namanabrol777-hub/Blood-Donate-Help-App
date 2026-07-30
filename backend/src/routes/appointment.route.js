import express from 'express';
import { createAppointment, getAppointments, cancelAppointment } from '../controllers/appointment.controller.js';

const router = express.Router();

router.post('/', createAppointment);
router.get('/', getAppointments);
router.put('/:id/cancel', cancelAppointment);

export default router;
