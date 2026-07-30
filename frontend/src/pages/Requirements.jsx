import React, { useState, useEffect } from 'react';
import useReportStore from '../stores/useReportStore.js'; // Ensure the path is correct

const Requirements = () => {
  // Get state and actions from the store
  const {
    reports,
    loading,
    error,
    fetchReports,
    clearError
  } = useReportStore();

  // Load reports on component mount
  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // Clear any errors when unmounting
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  // Get the latest 5 reports
  const latestReports = reports ? [...reports].sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  }).slice(0, 5) : [];

  // Helper function to format blood type priority based on urgency
  const getPriorityStyle = (urgency) => {
    if (urgency === 'Critical' || urgency === 'High') {
      return "bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-semibold";
    } else {
      return "bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full text-xs font-semibold";
    }
  };

  // Convert urgency to priority for UI consistency
  const mapUrgencyToPriority = (urgency) => {
    if (urgency === 'Critical' || urgency === 'High') {
      return 'Urgent';
    }
    return 'Normal';
  };

  return (
    <section className="bg-gray-50 py-12 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-xl font-semibold mb-6 text-black">Latest Requirements</h2>
        
        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
            <button onClick={clearError} className="float-right">
              <span className="text-red-500">&times;</span>
            </button>
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-red-600"></div>
          </div>
        ) : latestReports.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-xl">
            <p className="text-gray-500">No blood shortage reports found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-xl overflow-hidden">
              <thead className="bg-gray-100 text-gray-600 text-sm uppercase text-left">
                <tr>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Blood Type</th>
                  <th className="px-6 py-4">Priority</th>
                  <th className="px-6 py-4">Required Units</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {latestReports.flatMap(report => 
                  report.shortages.map((shortage, index) => (
                    <tr key={`${report._id}-${index}`} className="border-b">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {report.facility.name}, {report.facility.location.city}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-black">
                        {shortage.bloodType}
                      </td>
                      <td className="px-6 py-4">
                        <span className={getPriorityStyle(report.urgency)}>
                          {mapUrgencyToPriority(report.urgency)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-black">
                        {shortage.unitsNeeded - shortage.unitsAvailable}
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-red-600 hover:underline font-medium text-sm">
                          Donate
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default Requirements;