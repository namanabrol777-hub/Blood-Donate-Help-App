import express from 'express';
import { getNearbyBloodBanks, getBloodBankById } from '../controllers/bloodBank.controller.js';

const router = express.Router();

router.get('/nearby', getNearbyBloodBanks);
router.get('/:id', getBloodBankById);

export default router;