// // controllers/donorController.js
// import { Donor } from '../models/appointment.model.js';

// // Get count of all donors
// export const getDonorsCount = async (req, res) => {
//   try {
//     const count = await Donor.countDocuments();
//     res.status(200).json({ count });
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching donors count', error: error.message });
//   }
// };

// // Get all donors
// export const getAllDonors = async (req, res) => {
//   try {
//     const donors = await Donor.find();
//     res.status(200).json(donors);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching donors', error: error.message });
//   }
// };

// // Get donor by ID
// export const getDonorById = async (req, res) => {
//   try {
//     const donor = await Donor.findById(req.params.id);
    
//     if (!donor) {
//       return res.status(404).json({ message: 'Donor not found' });
//     }
    
//     res.status(200).json(donor);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching donor', error: error.message });
//   }
// };

// // Create a new donor
// export const createDonor = async (req, res) => {
//   try {
//     const newDonor = new Donor(req.body);
//     const savedDonor = await newDonor.save();
//     res.status(201).json(savedDonor);
//   } catch (error) {
//     res.status(400).json({ message: 'Error creating donor', error: error.message });
//   }
// };

// // Update a donor
// export const updateDonor = async (req, res) => {
//   try {
//     const updatedDonor = await Donor.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true, runValidators: true }
//     );
    
//     if (!updatedDonor) {
//       return res.status(404).json({ message: 'Donor not found' });
//     }
    
//     res.status(200).json(updatedDonor);
//   } catch (error) {
//     res.status(400).json({ message: 'Error updating donor', error: error.message });
//   }
// };

// // Delete a donor
// export const deleteDonor = async (req, res) => {
//   try {
//     const deletedDonor = await Donor.findByIdAndDelete(req.params.id);
    
//     if (!deletedDonor) {
//       return res.status(404).json({ message: 'Donor not found' });
//     }
    
//     res.status(200).json({ message: 'Donor deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error deleting donor', error: error.message });
//   }
// };