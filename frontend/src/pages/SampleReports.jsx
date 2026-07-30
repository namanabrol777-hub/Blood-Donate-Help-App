import React, { useState, useEffect } from 'react';
import NavBar from './NavBar';
import useReportStore from '../stores/useReportStore.js'; // Assuming correct path

const SampleReports = () => {
  // Get state and actions from the store
  const {
    reports,
    loading,
    error,
    fetchReports,
    deleteReport,
    clearError
  } = useReportStore();

  // State for tracking which report's details are currently expanded
  const [expandedReportId, setExpandedReportId] = useState(null);
  
  // Load reports on component mount
  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // Clear any errors when unmounting
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  // Function to toggle report details expansion
  const toggleReportDetails = (id) => {
    if (expandedReportId === id) {
      setExpandedReportId(null);
    } else {
      setExpandedReportId(id);
    }
  };

  // Handle report deletion
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        await deleteReport(id);
      } catch (err) {
        console.error("Failed to delete report:", err);
      }
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return 'Invalid Date';
    }
  };

  // Get urgency badge color
  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-blue-100 text-blue-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Resolved': return 'bg-gray-100 text-gray-800';
      case 'Expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen mt-20 bg-[#fff7f6] py-12 px-4 sm:px-6 lg:px-8">
        {/* Error Display */}
        {error && (
          <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative shadow-md flex justify-between items-center" role="alert">
              <div>
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
              </div>
              <button onClick={clearError} className="ml-4">
                <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <title>Close</title>
                  <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
                </svg>
              </button>
            </div>
          </div>
        )}

        <div className="max-w-6xl mx-auto shadow-lg p-6 bg-white rounded-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Blood Shortage Reports
          </h2>

          {/* Filter Controls */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search reports..." 
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-400" 
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-400">
              <option value="">All Urgencies</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-400">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="resolved">Resolved</option>
              <option value="expired">Expired</option>
            </select>
          </div>

          {/* Report Cards */}
          <div className="space-y-6">
            {loading && (!reports || reports.length === 0) ? (
              <div className="text-center py-12">
                <svg className="animate-spin mx-auto h-10 w-10 text-[#dc3545]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="mt-4 text-lg text-gray-500">Loading reports...</p>
              </div>
            ) : (!reports || reports.length === 0) ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="mt-2 text-gray-500">No blood shortage reports found.</p>
                <button className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  Create a New Report
                </button>
              </div>
            ) : (
              reports.map(report => (
                <div key={report._id} className="border border-gray-200 rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow">
                  <div className="p-4 sm:p-6">
                    {/* Report Header */}
                    <div className="flex flex-wrap items-start justify-between mb-4">
                      <div className="mb-2 sm:mb-0">
                        <h3 className="text-lg font-semibold text-gray-900">{report.facility.name}</h3>
                        <p className="text-sm text-gray-600">
                          {report.facility.type} • {report.facility.location.city}, {report.facility.location.state}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getUrgencyColor(report.urgency)}`}>
                          {report.urgency}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                      </div>
                    </div>

                    {/* Blood Types Needed */}
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-500 mb-2">Blood Types Needed:</p>
                      <div className="flex flex-wrap gap-2">
                        {report.shortages.map((shortage, idx) => (
                          <div key={idx} className="px-3 py-1 bg-red-50 border border-red-200 rounded-md">
                            <span className="font-medium text-red-700">{shortage.bloodType}</span>
                            <span className="text-sm text-gray-600"> • {shortage.unitsNeeded} units needed</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Basic Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Reported by:</p>
                        <p className="text-sm text-gray-400">{report.reporter.name} ({report.reporter.role})</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Date Reported:</p>
                        <p className="text-sm text-gray-400">{formatDate(report.createdAt || new Date())}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Needed By:</p>
                        <p className="text-sm text-gray-400">{formatDate(report.neededBy).split(' ')[0]}</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between items-center mt-4">
                      <button 
                        onClick={() => toggleReportDetails(report._id)} 
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                      >
                        {expandedReportId === report._id ? (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                            Hide Details
                          </>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                            View Details
                          </>
                        )}
                      </button>
                      <div className="space-x-2">
                        <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(report._id)}
                          disabled={loading}
                          className={`px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {expandedReportId === report._id && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Contact Information:</p>
                            <p className="text-sm text-gray-400">{report.reporter.email}</p>
                            <p className="text-sm text-gray-400">{report.reporter.phone}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Facility Address:</p>
                            <p className="text-sm text-gray-400">
                              {report.facility.location.address && `${report.facility.location.address}, `}
                              {report.facility.location.city}, {report.facility.location.state}, {report.facility.location.country}
                              {report.facility.location.postalCode && ` ${report.facility.location.postalCode}`}
                            </p>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-500">Available Units:</p>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1">
                            {report.shortages.map((shortage, idx) => (
                              <div key={idx} className="bg-gray-50 p-2 rounded">
                                <p className="text-center">
                                  <span className="font-medium">{shortage.bloodType}</span>
                                  <span className="block text-xs text-gray-500">
                                    {shortage.unitsAvailable}/{shortage.unitsNeeded} units
                                  </span>
                                </p>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                  <div 
                                    className="bg-red-600 h-2 rounded-full" 
                                    style={{ width: `${(shortage.unitsAvailable / shortage.unitsNeeded) * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {report.notes && (
                          <div>
                            <p className="text-sm font-medium text-gray-500">Notes:</p>
                            <p className="text-sm bg-gray-50 p-3 rounded mt-1 text-gray-600">{report.notes}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {reports && reports.length > 0 && (
            <div className="flex justify-between items-center mt-6">
              <p className="text-sm text-gray-600">Showing {reports.length} reports</p>
              <div className="flex space-x-1">
                <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-400 disabled:opacity-50" disabled>
                  Previous
                </button>
                <button className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700">
                  1
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-400">
                  2
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-400">
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SampleReports;