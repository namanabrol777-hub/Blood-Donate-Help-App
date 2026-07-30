import Appointment from '../models/appointment.model.js';
import BloodBank from '../models/bloodBank.model.js';

// Create a new appointment
export const createAppointment = async (req, res) => {
  try {
    const { 
      bloodBankId, 
      date, 
      time, 
      firstName, 
      lastName, 
      email, 
      phone, 
      bloodType, 
      dateOfBirth 
    } = req.body;

    // Check if blood bank exists
    const bloodBank = await BloodBank.findById(bloodBankId);
    if (!bloodBank) {
      return res.status(404).json({ message: 'Blood bank not found' });
    }

    // Create new appointment
    const appointment = new Appointment({
      bloodBank: bloodBankId,
      date,
      time,
      donor: {
        firstName,
        lastName,
        email,
        phone,
        bloodType,
        dateOfBirth
      }
    });

    await appointment.save();
    res.status(201).json(appointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ message: 'Failed to create appointment' });
  }
};

// Get appointments (could be filtered by email or other criteria)
export const getAppointments = async (req, res) => {
  try {
    const { email } = req.query;
    let query = {};
    
    if (email) {
      query = { 'donor.email': email };
    }
    
    const appointments = await Appointment.find(query)
      .populate('bloodBank', 'name address city')
      .sort({ date: 1, time: 1 });
    
    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Failed to fetch appointments' });
  }
};

// Cancel an appointment
export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    appointment.status = 'cancelled';
    await appointment.save();
    
    res.status(200).json(appointment);
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({ message: 'Failed to cancel appointment' });
  }
};