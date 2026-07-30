import mongoose from 'mongoose';
import BloodBank from '../models/bloodBank.model.js';

const MONGODB_URI = "mongodb+srv://dakshthakran05:vV9iBzHpw1bWQDRz@cluster0.z6jpz4u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const bloodBanks = [
  {
    name: 'Red Cross Blood Center',
    address: 'Chandigarh University',
    city: 'Mohali',
    state: 'Punjab',
    zipCode: '140413',
    phone: '0172-555-0123',
    email: 'info@redcross.example.org',
    location: {
      type: 'Point',
      coordinates: [76.5761, 30.7691] // [longitude, latitude]
    },
    operatingHours: {
      monday: { open: '09:00', close: '17:00' },
      tuesday: { open: '09:00', close: '17:00' },
      wednesday: { open: '09:00', close: '17:00' },
      thursday: { open: '09:00', close: '17:00' },
      friday: { open: '09:00', close: '17:00' },
      saturday: { open: '10:00', close: '14:00' },
      sunday: { open: 'closed', close: 'closed' }
    }
  },
  {
    name: 'City Medical Center Blood Donation',
    address: 'Panjab University',
    city: 'Chandigarh',
    state: 'Punjab',
    zipCode: '160014',
    phone: '0172-555-0187',
    email: 'donations@citymed.example.com',
    location: {
      type: 'Point',
      coordinates: [76.7685, 30.7583] // [longitude, latitude]
    },
    operatingHours: {
      monday: { open: '08:00', close: '18:00' },
      tuesday: { open: '08:00', close: '18:00' },
      wednesday: { open: '08:00', close: '18:00' },
      thursday: { open: '08:00', close: '18:00' },
      friday: { open: '08:00', close: '18:00' },
      saturday: { open: '09:00', close: '15:00' },
      sunday: { open: 'closed', close: 'closed' }
    }
  },
  {
    name: 'Community Blood Center',
    address: 'Elante Mall, Sector 17',
    city: 'Chandigarh',
    state: 'Punjab',
    zipCode: '160017',
    phone: '0172-555-0199',
    email: 'help@communityblood.example.org',
    location: {
      type: 'Point',
      coordinates: [76.8016, 30.7046] // [longitude, latitude]
    },
    operatingHours: {
      monday: { open: '10:00', close: '18:00' },
      tuesday: { open: '10:00', close: '18:00' },
      wednesday: { open: '10:00', close: '18:00' },
      thursday: { open: '10:00', close: '18:00' },
      friday: { open: '10:00', close: '18:00' },
      saturday: { open: '10:00', close: '16:00' },
      sunday: { open: '12:00', close: '16:00' }
    }
  }
];

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Clear existing blood banks
    await BloodBank.deleteMany({});
    console.log('Cleared existing blood banks');
    
    // Insert new blood banks
    const result = await BloodBank.insertMany(bloodBanks);
    console.log(`Seeded ${result.length} blood banks`);
    
    mongoose.disconnect();
    console.log('Database seeding completed');
  })
  .catch(err => {
    console.error('Error seeding database:', err);
    process.exit(1);
  });

// To run this script:
// node scripts/seedBloodBanks.js