import mongoose from 'mongoose';

const bloodShortageReportSchema = new mongoose.Schema({
  reporter: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: String,
    role: {
      type: String,
      enum: ['Doctor', 'Government Official', 'Blood Bank Official', 'Hospital Admin', 'Other'],
      required: true
    },
    identification: {
      doctorId: {
        type: String,
        required: function() {
          return this.reporter.role === 'Doctor';
        }
      },
      hospitalName: {
        type: String,
        required: function() {
          return this.reporter.role === 'Doctor' || this.reporter.role === 'Hospital Admin';
        }
      },
      governmentId: {
        type: String,
        required: function() {
          return this.reporter.role === 'Government Official';
        }
      },
      department: {
        type: String,
        required: function() {
          return this.reporter.role === 'Government Official';
        }
      },
      bloodBankId: {
        type: String,
        required: function() {
          return this.reporter.role === 'Blood Bank Official';
        }
      },
      organizationName: {
        type: String,
        required: function() {
          return this.reporter.role === 'Other';
        }
      },
      positionTitle: {
        type: String,
        required: function() {
          return this.reporter.role === 'Other';
        }
      }
    },
    verified: {
      type: Boolean,
      default: false
    }
  },
  
  facility: {
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['Hospital', 'Blood Bank', 'Donation Center', 'Government Facility', 'Other'],
      required: true
    },
    location: {
      address: String,
      city: {
        type: String,
        required: true
      },
      state: {
        type: String,
        required: true
      },
      country: {
        type: String,
        required: true
      },
      postalCode: String,
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    }
  },
  
  shortages: [{
    bloodType: {
      type: String,
      required: true,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },
    unitsNeeded: {
      type: Number,
      required: true,
      min: 1
    },
    unitsAvailable: {
      type: Number,
      default: 0
    }
  }],
  
  urgency: {
    type: String,
    required: true,
    enum: ['Critical', 'High', 'Medium', 'Low']
  },
  
  reportedAt: {
    type: Date,
    default: Date.now
  },
  neededBy: {
    type: Date,
    required: true
  },
  
  status: {
    type: String,
    enum: ['Active', 'Resolved', 'Expired'],
    default: 'Active'
  },
  
  notes: String,
  
  resolution: {
    resolvedAt: Date,
    resolvedBy: String,
    notes: String
  }
});

bloodShortageReportSchema.index({ 'facility.location.city': 1, 'urgency': 1 });

bloodShortageReportSchema.index({ 'status': 1, 'neededBy': 1 });

bloodShortageReportSchema.index({ 'reporter.role': 1, 'reporter.identification.doctorId': 1 });
bloodShortageReportSchema.index({ 'reporter.role': 1, 'reporter.identification.governmentId': 1 });

bloodShortageReportSchema.set('timestamps', true);

export default mongoose.model('BloodShortageReport', bloodShortageReportSchema);