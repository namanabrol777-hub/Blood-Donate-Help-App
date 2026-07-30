import BloodBank from '../models/bloodBank.model.js';

// Get nearby blood banks based on coordinates
export const getNearbyBloodBanks = async (req, res) => {
  try {
    const { longitude, latitude, maxDistance = 1000000 } = req.query; // maxDistance in meters, default 10km
    
    if (!longitude || !latitude) {
      return res.status(400).json({ message: 'Longitude and latitude are required' });
    }

    const nearbyBloodBanks = await BloodBank.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      }
    });

    res.status(200).json(nearbyBloodBanks);
  } catch (error) {
    console.error('Error finding nearby blood banks:', error);
    res.status(500).json({ message: 'Failed to fetch nearby blood banks' });
  }
};

// Get a blood bank by ID
export const getBloodBankById = async (req, res) => {
  try {
    const bloodBank = await BloodBank.findById(req.params.id);
    
    if (!bloodBank) {
      return res.status(404).json({ message: 'Blood bank not found' });
    }
    
    res.status(200).json(bloodBank);
  } catch (error) {
    console.error('Error fetching blood bank:', error);
    res.status(500).json({ message: 'Failed to fetch blood bank details' });
  }
};