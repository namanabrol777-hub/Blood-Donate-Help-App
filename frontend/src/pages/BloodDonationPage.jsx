import { useState } from 'react';
import Navbar from './NavBar.jsx';
import BloodBankLocator from '../components/BloodBankLocator';
import AppointmentForm from '../components/AppointmentForm';
import UserAppointments from '../components/UserAppointments';

const BloodDonationPage = () => {
  const [activeTab, setActiveTab] = useState('donate');

  const tabs = [
    { id: 'donate', label: 'Donate Blood' },
    { id: 'appointments', label: 'My Appointments' }
  ];

  return (
    <div className="min-h-screen mt-20 bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-red-600 mb-3">Blood Donation Center</h1>
          <p className="text-lg text-gray-600">
            Schedule your appointment to donate blood and save lives
          </p>
        </header>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-sm font-semibold transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'text-red-600 border-b-2 border-red-600'
                  : 'text-gray-500 hover:text-red-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'donate' ? (
          <div className="grid grid-cols-1 text-gray-600 md:grid-cols-2 gap-8">
            <BloodBankLocator />
            <AppointmentForm />
          </div>
        ) : (
          <div className="mt-4">
            <UserAppointments />
          </div>
        )}

        {/* Why Donate Section */}
        <section className="mt-16 bg-white p-8 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold text-red-600 mb-6">Why Donate Blood?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="bg-red-50 p-5 rounded-lg shadow hover:shadow-md transition-shadow">
              <h3 className="font-bold text-lg text-gray-600 mb-2">Save Lives</h3>
              <p className="text-sm text-gray-700">
                One donation can save up to three lives. Your contribution matters!
              </p>
            </div>
            <div className="bg-red-50 p-5 rounded-lg shadow hover:shadow-md transition-shadow">
              <h3 className="font-bold text-gray-600 text-lg mb-2">Health Benefits</h3>
              <p className="text-sm text-gray-700">
                Regular donors have reduced risk of heart disease and lower blood pressure.
              </p>
            </div>
            <div className="bg-red-50 p-5 rounded-lg shadow hover:shadow-md transition-shadow">
              <h3 className="font-bold text-gray-600 text-lg mb-2">Community Support</h3>
              <p className="text-sm text-gray-700">
                Help maintain the blood supply for emergencies and medical procedures.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Blood Donation Center. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default BloodDonationPage;
