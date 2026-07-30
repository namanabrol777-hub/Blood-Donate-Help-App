import React, { useState } from 'react';
import NavBar from './NavBar';
import useReportStore from '../stores/useReportStore.js'; // Assuming correct path

// Helper component for form inputs
const FormInput = ({ label, id, type = 'text', placeholder = '', value, onChange, required = false, name, min, step }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      id={id}
      name={name || id}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      min={min}
      step={step}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-400 focus:border-gray-400 sm:text-sm"
    />
  </div>
);

// Helper component for dropdowns
const FormSelect = ({ label, id, value, onChange, required = false, children, name }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      id={id}
      name={name || id}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-gray-400 focus:border-gray-400 sm:text-sm appearance-none"
      style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em' }}
    >
      {children}
    </select>
  </div>
);

// Helper component for text areas
const FormTextarea = ({ label, id, placeholder = '', value, onChange, rows = 4, name }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <textarea
      id={id}
      name={name || id}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      rows={rows}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-400 focus:border-gray-400 sm:text-sm resize-vertical" // Allow vertical resize
    />
  </div>
);

const BloodShortageReportPage = () => {
  // Get state and actions from the store 
  const {
    loading,
    error,
    createReport,
    clearError
  } = useReportStore();

  // Local state for the detailed form 
  const [newReport, setNewReport] = useState({
      reporter: { name: '', email: '', phone: '', role: 'Doctor', identification: { doctorId: '', hospitalName: '', governmentId: '', department: '', bloodBankId: '', organizationName: '', positionTitle: '' }, verified: false },
      facility: { name: '', type: 'Hospital', location: { address: '', city: '', state: '', country: '', postalCode: '', coordinates: { latitude: null, longitude: null } } },
      shortages: [{ bloodType: 'A+', unitsNeeded: 1, unitsAvailable: 0 }],
      urgency: 'Medium',
      neededBy: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Active',
      notes: ''
  });

  // State for the confirmation checkbox 
  const [confirmAccuracy, setConfirmAccuracy] = useState(false);

  // Clear any errors when unmounting
  React.useEffect(() => {
    return () => clearError();
  }, [clearError]);

  // Handle form input changes (Handles nested state updates)
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'confirmAccuracy' && type === 'checkbox') {
      setConfirmAccuracy(checked);
      return;
    }

    if (name.includes('.')) {
      const parts = name.split('.');
      setNewReport(prev => {
          let current = { ...prev };
          let Pointer = current;
          for (let i = 0; i < parts.length - 1; i++) {
              // Ensure nested object exists before trying to spread it
              if (!Pointer[parts[i]]) Pointer[parts[i]] = {};
              Pointer[parts[i]] = { ...Pointer[parts[i]] };
              Pointer = Pointer[parts[i]];
          }
          Pointer[parts[parts.length - 1]] = value;
          return current;
      });
    } else {
      setNewReport(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle blood shortage changes for specific entry
  const handleShortageChange = (index, field, value) => {
    setNewReport(prev => {
      const updatedShortages = [...prev.shortages];
      updatedShortages[index] = {
        ...updatedShortages[index],
        [field]: (field === 'unitsNeeded' || field === 'unitsAvailable') ? (value === '' ? '' : Number(value)) : value // Allow empty string for numbers temporarily
      };
      return { ...prev, shortages: updatedShortages };
    });
  };

  // Add new blood shortage entry
  const addShortageEntry = () => {
    setNewReport(prev => ({
      ...prev,
      shortages: [
        ...prev.shortages,
        { bloodType: 'A+', unitsNeeded: 1, unitsAvailable: 0 } // Default new entry
      ]
    }));
  };

  // Remove blood shortage entry
  const removeShortageEntry = (index) => {
    setNewReport(prev => {
      const updatedShortages = [...prev.shortages];
      updatedShortages.splice(index, 1);
      return { ...prev, shortages: updatedShortages };
    });
  };

  // Show identification fields based on role
   const renderIdentificationFields = () => {
     const role = newReport.reporter.role;
     const commonInputClass = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-400 focus:border-gray-400 sm:text-sm";
     const commonLabelClass = "block text-sm font-medium text-gray-700 mb-1";

     switch (role) {
       case 'Doctor':
         return (
           <>
             <div>
               <label className={commonLabelClass}>Doctor ID <span className="text-red-500">*</span></label>
               <input type="text" name="reporter.identification.doctorId" value={newReport.reporter.identification.doctorId} onChange={handleInputChange} className={commonInputClass} required />
             </div>
             <div>
               <label className={commonLabelClass}>Hospital Name <span className="text-red-500">*</span></label>
               <input type="text" name="reporter.identification.hospitalName" value={newReport.reporter.identification.hospitalName} onChange={handleInputChange} className={commonInputClass} required />
             </div>
           </>
         );
       case 'Government Official':
         return (
           <>
             <div>
               <label className={commonLabelClass}>Government ID <span className="text-red-500">*</span></label>
               <input type="text" name="reporter.identification.governmentId" value={newReport.reporter.identification.governmentId} onChange={handleInputChange} className={commonInputClass} required />
             </div>
             <div>
               <label className={commonLabelClass}>Department <span className="text-red-500">*</span></label>
               <input type="text" name="reporter.identification.department" value={newReport.reporter.identification.department} onChange={handleInputChange} className={commonInputClass} required />
             </div>
           </>
         );
       case 'Blood Bank Official':
         return (
           <div>
             <label className={commonLabelClass}>Blood Bank ID <span className="text-red-500">*</span></label>
             <input type="text" name="reporter.identification.bloodBankId" value={newReport.reporter.identification.bloodBankId} onChange={handleInputChange} className={commonInputClass} required />
           </div>
         );
       case 'Hospital Admin':
            // Assuming Hospital Admin also needs Hospital Name like Doctor
           return (
             <div>
               <label className={commonLabelClass}>Hospital Name <span className="text-red-500">*</span></label>
               <input type="text" name="reporter.identification.hospitalName" value={newReport.reporter.identification.hospitalName} onChange={handleInputChange} className={commonInputClass} required />
             </div>
           );
       case 'Other':
         return (
           <>
             <div>
               <label className={commonLabelClass}>Organization Name <span className="text-red-500">*</span></label>
               <input type="text" name="reporter.identification.organizationName" value={newReport.reporter.identification.organizationName} onChange={handleInputChange} className={commonInputClass} required />
             </div>
             <div>
               <label className={commonLabelClass}>Position Title <span className="text-red-500">*</span></label>
               <input type="text" name="reporter.identification.positionTitle" value={newReport.reporter.identification.positionTitle} onChange={handleInputChange} className={commonInputClass} required />
             </div>
           </>
         );
       default:
         return null;
     }
   };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!confirmAccuracy) {
        alert("Please confirm the accuracy of the report.");
        return;
    }
    // Optional: Add validation for minimum shortage entries if needed
    if (newReport.shortages.length === 0) {
        alert("Please add at least one blood type shortage.");
        return;
    }
    // Optional: Validate number fields aren't empty strings before submission
    const validatedReport = {
        ...newReport,
        shortages: newReport.shortages.map(s => ({
            ...s,
            unitsNeeded: Number(s.unitsNeeded) || 0, // Default to 0 if invalid number
            unitsAvailable: Number(s.unitsAvailable) || 0
        }))
    };

    try {
      await createReport(validatedReport);
      alert('Report submitted successfully!');
      // Reset form state
       setNewReport({
           reporter: { name: '', email: '', phone: '', role: 'Doctor', identification: { doctorId: '', hospitalName: '', governmentId: '', department: '', bloodBankId: '', organizationName: '', positionTitle: '' }, verified: false },
           facility: { name: '', type: 'Hospital', location: { address: '', city: '', state: '', country: '', postalCode: '', coordinates: { latitude: null, longitude: null } } },
           shortages: [{ bloodType: 'A+', unitsNeeded: 1, unitsAvailable: 0 }],
           urgency: 'Medium',
           neededBy: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
           status: 'Active',
           notes: ''
       });
      setConfirmAccuracy(false);
    } catch (err) {
      console.error("Failed to create report:", err);
      // Error is handled by the error state variable
    }
  };

  const bloodTypeOptions = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <>
      <NavBar />
      <div className="min-h-screen mt-20 bg-[#fdf6f7] py-12 px-4 sm:px-6 lg:px-8">

        {/* Error Display */}
        {error && (
          <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative shadow-md flex justify-between items-center" role="alert">
                <div>
                  <strong className="font-bold">Error: </strong>
                  <span className="block sm:inline">{error}</span>
                </div>
                <button onClick={clearError} className="ml-4">
                  <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
                </button>
              </div>
            </div>
        )}

        {/* Form Section */}
        <div className="max-w-4xl mx-auto mb-12"> {/* Wider max-width for form */}
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Report Blood Shortage
            </h1>
            <p className="text-sm text-gray-600 max-w-xl mx-auto">
              Help us identify areas with critical blood needs. Your report will help save lives by directing resources where they're needed most.
            </p>
          </div>

          {/* Form Container */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <form onSubmit={handleSubmit} className="space-y-8"> {/* Increased spacing */}

              {/* --- Reporter Information Section --- */}
              <fieldset className="border border-gray-300 p-4 rounded-md">
                  <legend className="text-lg font-semibold text-gray-800 px-2">Reporter Information</legend>
                  <div className="grid grid-cols-1 text-gray-500 md:grid-cols-2 gap-6 mt-4">
                      <FormInput label="Name" id="reporterName" name="reporter.name" value={newReport.reporter.name} onChange={handleInputChange} required />
                      <FormInput label="Email" id="reporterEmail" name="reporter.email" type="email" value={newReport.reporter.email} onChange={handleInputChange} required />
                      <FormInput label="Phone" id="reporterPhone" name="reporter.phone" type="tel" value={newReport.reporter.phone} onChange={handleInputChange} />
                      <FormSelect label="Role" id="reporterRole" name="reporter.role" value={newReport.reporter.role} onChange={handleInputChange} required>
                          <option value="Doctor">Doctor</option>
                          <option value="Government Official">Government Official</option>
                          <option value="Blood Bank Official">Blood Bank Official</option>
                          <option value="Hospital Admin">Hospital Admin</option>
                          <option value="Other">Other</option>
                      </FormSelect>
                      {/* Dynamic Identification Fields based on Role */}
                      {renderIdentificationFields()}
                  </div>
              </fieldset>

              {/* --- Facility Information Section --- */}
              <fieldset className="border border-gray-300 p-4 rounded-md">
                  <legend className="text-lg font-semibold text-gray-800 px-2">Facility Information</legend>
                  <div className="grid grid-cols-1 text-gray-500 md:grid-cols-2 gap-6 mt-4">
                      <FormInput label="Facility Name" id="facilityName" name="facility.name" value={newReport.facility.name} onChange={handleInputChange} required />
                      <FormSelect label="Facility Type" id="facilityType" name="facility.type" value={newReport.facility.type} onChange={handleInputChange} required>
                          <option value="Hospital">Hospital</option>
                          <option value="Blood Bank">Blood Bank</option>
                          <option value="Clinic">Clinic</option>
                          <option value="Donation Center">Donation Center</option>
                          <option value="Government Facility">Government Facility</option>
                          <option value="Other">Other</option>
                      </FormSelect>
                      {/* Address Fields */}
                      <div className="md:col-span-2">
                          <FormTextarea label="Address" id="facilityLocationAddress" name="facility.location.address" placeholder="Street Address" value={newReport.facility.location.address} onChange={handleInputChange} rows={2} />
                      </div>
                      <FormInput label="City" id="facilityLocationCity" name="facility.location.city" value={newReport.facility.location.city} onChange={handleInputChange} required />
                      <FormInput label="State/Province" id="facilityLocationState" name="facility.location.state" value={newReport.facility.location.state} onChange={handleInputChange} required />
                      <FormInput label="Country" id="facilityLocationCountry" name="facility.location.country" value={newReport.facility.location.country} onChange={handleInputChange} required />
                      <FormInput label="Postal Code" id="facilityLocationPostalCode" name="facility.location.postalCode" value={newReport.facility.location.postalCode} onChange={handleInputChange} />
                  </div>
              </fieldset>


              {/* --- Blood Shortage Information Section --- */}
              <fieldset className="border border-gray-300 p-4 rounded-md">
                  <legend className="text-lg font-semibold text-gray-800 px-2">Blood Shortage Details</legend>
                  <div className="space-y-6 text-gray-500 mt-4">
                      {newReport.shortages.map((shortage, index) => (
                          <div key={index} className="p-4 border border-gray-200 rounded-md bg-gray-50 relative">
                            {/* Remove Button for entries > 0 */}
                              {newReport.shortages.length > 1 && (
                                  <button
                                      type="button"
                                      onClick={() => removeShortageEntry(index)}
                                      className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-600 focus:outline-none"
                                      title="Remove Blood Type Entry"
                                  >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                  </button>
                              )}

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                                  <FormSelect
                                      label={`Blood Type #${index + 1}`}
                                      id={`shortage-${index}-bloodType`}
                                      value={shortage.bloodType}
                                      onChange={(e) => handleShortageChange(index, 'bloodType', e.target.value)}
                                      required
                                  >
                                      {bloodTypeOptions.map(bt => <option key={bt} value={bt}>{bt}</option>)}
                                  </FormSelect>
                                  <FormInput
                                      label="Units Needed"
                                      id={`shortage-${index}-unitsNeeded`}
                                      type="number"
                                      min="1"
                                      value={shortage.unitsNeeded}
                                      onChange={(e) => handleShortageChange(index, 'unitsNeeded', e.target.value)}
                                      required
                                  />
                                  <FormInput
                                      label="Units Available"
                                      id={`shortage-${index}-unitsAvailable`}
                                      type="number"
                                      min="0"
                                      value={shortage.unitsAvailable}
                                      onChange={(e) => handleShortageChange(index, 'unitsAvailable', e.target.value)}
                                      required
                                  />
                              </div>
                          </div>
                      ))}
                      {/* Add Button */}
                      <div className="flex justify-start">
                          <button
                              type="button"
                              onClick={addShortageEntry}
                              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                              <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                              Add Another Blood Type
                          </button>
                      </div>
                  </div>
              </fieldset>

              {/* --- Additional Information Section --- */}
              <fieldset className="border border-gray-300 p-4 rounded-md">
                  <legend className="text-lg font-semibold text-gray-800 px-2">Additional Information</legend>
                  <div className="grid grid-cols-1 text-gray-500 md:grid-cols-2 gap-6 mt-4">
                      <FormSelect label="Urgency Level" id="urgency" name="urgency" value={newReport.urgency} onChange={handleInputChange} required>
                          <option value="Critical">Critical</option>
                          <option value="High">High</option>
                          <option value="Medium">Medium</option>
                          <option value="Low">Low</option>
                      </FormSelect>
                      <FormInput label="Needed By Date" id="neededBy" name="neededBy" type="date" value={newReport.neededBy} onChange={handleInputChange} required />
                      <div className="md:col-span-2">
                          <FormTextarea label="Additional Notes" id="notes" name="notes" placeholder="Provide any relevant context or details..." value={newReport.notes} onChange={handleInputChange} rows={4} />
                      </div>
                  </div>
              </fieldset>


              {/* Confirmation Checkbox */}
              <div className="flex items-center mt-6">
                <input
                  id="confirmAccuracy"
                  name="confirmAccuracy"
                  type="checkbox"
                  checked={confirmAccuracy}
                  onChange={handleInputChange}
                  required
                  className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <label htmlFor="confirmAccuracy" className="ml-3 block text-sm text-gray-800 font-medium">
                  I confirm that this is a genuine report and all information provided is accurate. <span className="text-red-500">*</span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  disabled={loading || !confirmAccuracy}
                  className={`inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${
                    (loading || !confirmAccuracy)
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-[#dc3545] hover:bg-[#c82333] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#dc3545]'
                  }`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    'Submit Shortage Report'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default BloodShortageReportPage;