import React, { useState } from "react";

const ReportBlood = () => {
  const [form, setForm] = useState({
    institutionType: "Hospital",
    bloodType: "A+",
    units: "",
    priority: "Urgent",
    location: "",
    notes: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", form);
    // You can add your submission logic here
  };

  return (
    <section className="bg-gray-50 min-h-screen flex items-center justify-center py-12">
      <div className="bg-white max-w-2xl rounded-xl shadow-md w-full p-8">
        <h2 className="text-xl font-semibold text-black text-center mb-6">
          Report Blood Requirement
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Row 1: Institution Type & Blood Type */}
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Institution Type
              </label>
              <select
                name="institutionType"
                value={form.institutionType}
                onChange={handleChange}
                className="w-full text-gray-400 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                <option value="Hospital">Hospital</option>
                <option value="Clinic">Clinic</option>
                <option value="NGO">NGO</option>
              </select>
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Blood Type
              </label>
              <select
                name="bloodType"
                value={form.bloodType}
                onChange={handleChange}
                className="w-full border text-gray-400 border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Units & Priority */}
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Units Required
              </label>
              <input
                type="number"
                name="units"
                value={form.units}
                onChange={handleChange}
                className="w-full text-gray-400 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-full text-gray-400 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                <option value="Urgent">Urgent</option>
                <option value="Normal">Normal</option>
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Enter complete address"
              className="w-full text-gray-400 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Notes
            </label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-md transition"
          >
            Submit Report
          </button>
        </form>
      </div>
    </section>
  );
};

export default ReportBlood;
