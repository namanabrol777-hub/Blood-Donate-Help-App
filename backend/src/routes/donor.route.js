import express from "express";
import { protectRoute, authorizeRoles } from "../middlewares/auth.middleware.js";
import {
  getDashboardStats,
  getDonorProfile,
  updateDonorProfile,
  getDonationRecords,
  getAppointments,
  bookAppointment,
  cancelAppointment,
  getEmergencyRequests,
  getNearbyBloodBanks,
  getDonorRewards,
  getHealthAnalytics,
  getNotifications,
} from "../controllers/donor.controller.js";

const router = express.Router();

// Enforce authentication & active DONOR / ADMIN role permission
router.use(protectRoute);
router.use(authorizeRoles("DONOR", "ADMIN"));

router.get("/dashboard", getDashboardStats);
router.get("/profile", getDonorProfile);
router.put("/profile", updateDonorProfile);
router.get("/records", getDonationRecords);

// Appointment REST endpoints
router.get("/appointments", getAppointments);
router.post("/appointments", bookAppointment);
router.post("/book-appointment", bookAppointment); // Dedicated endpoint per specification
router.delete("/appointments/:id", cancelAppointment);
router.put("/appointments/:id", bookAppointment);

router.get("/emergency", getEmergencyRequests);
router.get("/bloodbanks", getNearbyBloodBanks);
router.get("/nearby-bloodbanks", getNearbyBloodBanks); // Dedicated endpoint per specification
router.get("/rewards", getDonorRewards);
router.get("/analytics", getHealthAnalytics);
router.get("/notifications", getNotifications);

export default router;
