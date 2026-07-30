import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  bloodBank: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'BloodBank', 
    required: true 
  },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['scheduled', 'completed', 'cancelled'], 
    default: 'scheduled' 
  },
  donor: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    bloodType: { 
      type: String, 
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      required: true 
    },
    dateOfBirth: { type: Date, required: true }
  },
  createdAt: { type: Date, default: Date.now }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;