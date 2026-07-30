import express from 'express';
import { createReport, getAllReports, getReportById, deleteReport, getReportsCount } from '../controllers/report.controller.js';

const router = express.Router();

// Report routes
router.post('/create', createReport);
router.get('/get', getAllReports);
router.get('/get/:id', getReportById);
router.delete('/remove/:id', deleteReport);
router.get('/count', getReportsCount);

export default router;