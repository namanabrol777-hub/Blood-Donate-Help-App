// controllers/reportController.js
import BloodShortageReport from '../models/report.model.js';

// Create a new blood shortage report
export const createReport = async (req, res) => {
  try {
    const report = new BloodShortageReport(req.body);
    await report.save();
    res.status(201).json({
      success: true,
      data: report
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get all reports
export const getAllReports = async (req, res) => {
  try {
    const reports = await BloodShortageReport.find().sort({ reportedAt: -1 });
    
    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get a single report by ID
export const getReportById = async (req, res) => {
  try {
    const report = await BloodShortageReport.findById(req.params.id);
    
    if (!report) {
      return res.status(404).json({
        success: false,
        error: 'Report not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Delete a report
export const deleteReport = async (req, res) => {
  try {
    const report = await BloodShortageReport.findByIdAndDelete(req.params.id);
    
    if (!report) {
      return res.status(404).json({
        success: false,
        error: 'Report not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Report deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const getReportsCount = async (req, res) => {
  try {
    const count = await BloodShortageReport.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reports count', error: error.message });
  }
};