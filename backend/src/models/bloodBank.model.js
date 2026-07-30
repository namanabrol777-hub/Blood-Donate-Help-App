import mongoose from 'mongoose';

const bloodBankSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number] // [longitude, latitude]
  },
  operatingHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String }
  }
});

// Create a geospatial index on the location field
bloodBankSchema.index({ location: '2dsphere' });

const BloodBank = mongoose.model('BloodBank', bloodBankSchema);
export default BloodBank;