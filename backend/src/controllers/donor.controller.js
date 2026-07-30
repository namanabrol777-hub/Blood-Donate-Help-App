import User from "../models/user.model.js";

// 1. GET /api/donor/dashboard
export const getDashboardStats = async (req, res) => {
  try {
    const user = req.user;

    const stats = {
      user: {
        fullName: user.fullName || user.username,
        bloodGroup: user.bloodGroup || "O+",
        avatar: user.avatar,
        digitalCardId: user.digitalCardId || "BL-DONOR-88291",
        isEligible: true,
        nextEligibleDate: "Ready Today",
        healthScore: 96,
        donationLevel: "Platinum Hero",
      },
      metrics: {
        totalDonations: user.donationsCount || 4,
        livesSaved: (user.donationsCount || 4) * 3,
        emergencyResponses: 3,
        donationStreak: user.donationStreak || 4,
        rewardPoints: 1250,
      },
      upcomingAppointment: {
        id: "APT-99201",
        center: "Metropolitan Central Blood Bank",
        date: "2026-08-05T10:00:00Z",
        donationType: "Whole Blood",
        status: "CONFIRMED",
        qrCode: "BL-APT-99201-QR",
      },
      recentActivities: [
        { id: 1, title: "Donated Whole Blood", location: "St. Jude Hospital", date: "2026-05-12", units: 1, impact: "3 Lives Saved" },
        { id: 2, title: "Emergency Response Accepted", location: "City General Hospital", date: "2026-03-20", units: 1, impact: "Critical Patient Saved" },
        { id: 3, title: "Earned Badge: Emergency Hero", location: "BloodLink System", date: "2026-02-14", points: "+250 Points" },
      ],
    };

    return res.status(200).json({ success: true, stats });
  } catch (error) {
    console.error("Error in getDashboardStats:", error);
    return res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// 2. GET /api/donor/profile
export const getDonorProfile = async (req, res) => {
  try {
    const user = req.user;
    return res.status(200).json({
      success: true,
      profile: {
        _id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName || user.username,
        avatar: user.avatar,
        bloodGroup: user.bloodGroup || "O+",
        phone: "+1 (555) 234-5678",
        gender: "Male",
        dob: "1996-08-15",
        weight: 72, // kg
        height: 178, // cm
        address: "742 Evergreen Terrace",
        city: "Metropolis",
        state: "NY",
        country: "USA",
        emergencyContact: user.emergencyContact || "+1 (555) 987-6543",
        medicalConditions: "None",
        lastDonationDate: "2026-05-12",
        lifestyle: {
          smoking: "No",
          alcohol: "Occasional",
          medications: "None",
          diseases: "None",
          allergies: "None",
          organDonor: true,
        },
      },
    });
  } catch (error) {
    console.error("Error in getDonorProfile:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 3. PUT /api/donor/profile
export const updateDonorProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { fullName, phone, weight, height, address, city, state, emergencyContact, lifestyle } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        fullName,
        emergencyContact,
        address: address ? `${address}, ${city || ""}, ${state || ""}` : req.user.address,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Donor Profile updated successfully!",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error in updateDonorProfile:", error);
    return res.status(500).json({ success: false, message: "Failed to update profile" });
  }
};

// 4. GET /api/donor/records
export const getDonationRecords = async (req, res) => {
  try {
    const records = [
      { id: "DON-1004", date: "2026-05-12", bloodBank: "Metropolitan Central Blood Bank", hospital: "St. Jude Hospital", bloodGroup: "O+", units: 1, status: "COMPLETED", certificateUrl: "#" },
      { id: "DON-1003", date: "2026-02-14", bloodBank: "Red Cross Regional Center", hospital: "City General Hospital", bloodGroup: "O+", units: 1, status: "COMPLETED", certificateUrl: "#" },
      { id: "DON-1002", date: "2025-11-05", bloodBank: "Mercy Trauma Center Bank", hospital: "Mercy Trauma Center", bloodGroup: "O+", units: 1, status: "COMPLETED", certificateUrl: "#" },
      { id: "DON-1001", date: "2025-08-01", bloodBank: "Metropolitan Central Blood Bank", hospital: "Children's Healthcare", bloodGroup: "O+", units: 1, status: "COMPLETED", certificateUrl: "#" },
    ];
    return res.status(200).json({ success: true, records });
  } catch (error) {
    console.error("Error in getDonationRecords:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 5. GET /api/donor/appointments
export const getAppointments = async (req, res) => {
  try {
    const appointments = [
      { id: "APT-99201", center: "Metropolitan Central Blood Bank", date: "2026-08-05T10:00:00Z", donationType: "Whole Blood", notes: "Morning slot preferred", status: "UPCOMING", qrCode: "BL-APT-99201-QR" },
      { id: "APT-88120", center: "Red Cross Regional Center", date: "2026-05-12T14:30:00Z", donationType: "Whole Blood", notes: "Regular donation", status: "COMPLETED", qrCode: "BL-APT-88120-QR" },
    ];
    return res.status(200).json({ success: true, appointments });
  } catch (error) {
    console.error("Error in getAppointments:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 6. POST /api/donor/appointments
export const bookAppointment = async (req, res) => {
  try {
    const { center, date, donationType, notes } = req.body;
    if (!center || !date) {
      return res.status(400).json({ success: false, message: "Center and Date are required" });
    }

    const newAppointment = {
      id: `APT-${Math.floor(10000 + Math.random() * 90000)}`,
      center,
      date,
      donationType: donationType || "Whole Blood",
      notes: notes || "",
      status: "UPCOMING",
      qrCode: `BL-APT-${Math.floor(10000 + Math.random() * 90000)}-QR`,
    };

    return res.status(201).json({
      success: true,
      message: "Appointment booked successfully!",
      appointment: newAppointment,
    });
  } catch (error) {
    console.error("Error in bookAppointment:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 7. DELETE /api/donor/appointments/:id
export const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    return res.status(200).json({ success: true, message: `Appointment ${id} cancelled successfully` });
  } catch (error) {
    console.error("Error in cancelAppointment:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 8. GET /api/donor/emergency
export const getEmergencyRequests = async (req, res) => {
  try {
    const emergencyRequests = [
      { id: "EMG-101", hospital: "St. Jude Children's Hospital", doctor: "Dr. Alex Reed", bloodGroup: "O+", units: 2, distance: "2.4 km away", urgency: "CRITICAL", timeRemaining: "45 mins", address: "102 Medical Park Drive" },
      { id: "EMG-102", hospital: "City General Trauma Center", doctor: "Dr. Sarah Lin", bloodGroup: "O+", units: 3, distance: "4.1 km away", urgency: "HIGH", timeRemaining: "2 hours", address: "55 Health Boulevard" },
      { id: "EMG-103", hospital: "Mercy Emergency Care", doctor: "Dr. Vance", bloodGroup: "O-", units: 1, distance: "6.8 km away", urgency: "MEDIUM", timeRemaining: "4 hours", address: "89 Mercy Road" },
    ];
    return res.status(200).json({ success: true, emergencyRequests });
  } catch (error) {
    console.error("Error in getEmergencyRequests:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 9. GET /api/donor/bloodbanks
export const getNearbyBloodBanks = async (req, res) => {
  try {
    const bloodBanks = [
      { id: "BB-1", name: "Metropolitan Central Blood Bank", distance: "1.2 km away", rating: 4.9, openHours: "24/7 Open", phone: "+1 (555) 019-2831", stock: { "O+": 42, "O-": 8, "A+": 35, "B+": 28 }, address: "400 Lifesaving Ave" },
      { id: "BB-2", name: "Red Cross Regional Center #4", distance: "3.5 km away", rating: 4.8, openHours: "8:00 AM - 8:00 PM", phone: "+1 (555) 482-9910", stock: { "O+": 18, "O-": 4, "A+": 20, "B+": 12 }, address: "12 Red Cross Way" },
      { id: "BB-3", name: "St. Jude Hospital Blood Storage", distance: "5.0 km away", rating: 4.7, openHours: "24/7 Open", phone: "+1 (555) 773-1029", stock: { "O+": 30, "O-": 6, "A+": 15, "B+": 22 }, address: "102 Medical Park Drive" },
    ];
    return res.status(200).json({ success: true, bloodBanks });
  } catch (error) {
    console.error("Error in getNearbyBloodBanks:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 10. GET /api/donor/rewards
export const getDonorRewards = async (req, res) => {
  try {
    const rewards = {
      points: 1250,
      level: "Platinum Donor",
      progress: 82, // percentage to next level
      nextLevel: "Diamond Hero",
      badges: [
        { id: 1, title: "Life Saver", desc: "Donated blood at least 3 times", unlocked: true, icon: "Heart" },
        { id: 2, title: "Emergency Responder", desc: "Responded to critical emergency request", unlocked: true, icon: "Flame" },
        { id: 3, title: "Platinum Hero", desc: "Reached 1,000+ Lifesaving Points", unlocked: true, icon: "Award" },
        { id: 4, title: "Legendary Supporter", desc: "Donate 10 times in a single year", unlocked: false, icon: "Crown" },
      ],
      leaderboard: [
        { rank: 1, name: "Marcus Vance", points: 2850, bloodGroup: "O-", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=marcus" },
        { rank: 2, name: "Elena Rostova", points: 2410, bloodGroup: "A+", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=elena" },
        { rank: 3, name: "Naman Abrol (You)", points: 1250, bloodGroup: "O+", avatar: req.user.avatar },
        { rank: 4, name: "Sarah Jenkins", points: 1120, bloodGroup: "B+", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah" },
      ],
    };
    return res.status(200).json({ success: true, rewards });
  } catch (error) {
    console.error("Error in getDonorRewards:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 11. GET /api/donor/analytics
export const getHealthAnalytics = async (req, res) => {
  try {
    const analytics = {
      bmi: 22.7,
      bmiCategory: "Healthy Weight",
      bloodPressure: "118 / 78 mmHg",
      hemoglobin: "14.5 g/dL",
      hydrationScore: "95%",
      recoveryDays: 0, // Fully recovered
      bpHistory: [
        { month: "Jan", systolic: 120, diastolic: 80 },
        { month: "Mar", systolic: 118, diastolic: 78 },
        { month: "May", systolic: 116, diastolic: 76 },
        { month: "Jul", systolic: 118, diastolic: 78 },
      ],
      hemoglobinHistory: [
        { month: "Jan", val: 14.1 },
        { month: "Mar", val: 14.3 },
        { month: "May", val: 14.2 },
        { month: "Jul", val: 14.5 },
      ],
    };
    return res.status(200).json({ success: true, analytics });
  } catch (error) {
    console.error("Error in getHealthAnalytics:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 12. GET /api/donor/notifications
export const getNotifications = async (req, res) => {
  try {
    const notifications = [
      { id: 1, type: "EMERGENCY", title: "Urgent O+ Needed at St. Jude Hospital", body: "2 units required for pediatric surgery.", time: "10 mins ago", unread: true },
      { id: 2, type: "APPOINTMENT", title: "Appointment Reminder", body: "Your donation at Metropolitan Blood Bank is on Aug 5.", time: "1 hour ago", unread: true },
      { id: 3, type: "REWARD", title: "Platinum Hero Unlocked! 🎉", body: "You earned 250 bonus points for your donation streak.", time: "2 days ago", unread: false },
    ];
    return res.status(200).json({ success: true, notifications });
  } catch (error) {
    console.error("Error in getNotifications:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};