import React from "react";
import heroImage from "/hero-image.png";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleDonate = async () => {
    try {
      navigate("/sampleAppointment");
    } catch (error) {
      console.log("erorr", error);
    }
  }

  const handleReport = async () => {
    try {
      navigate("/sampleFileReport");
    } catch (error) {
      console.log("erorr", error);
    }
  }
  return (
    <section className="bg-red-50 min-h-screen flex items-center">
      <div className="w-full max-w-8xl mx-auto px-6 md:px-12 lg:px-20 py-12 flex flex-col-reverse md:flex-row items-center justify-between">
        
        {/* Left Section */}
        <div className="w-full md:w-3/5 pr-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Connect Blood Donors <br /> with Those in Need
          </h1>
          <p className="text-gray-700 text-lg mb-8">
            Help us create a comprehensive database of blood requirements and connect donors with those who need it most.
          </p>
          <div className="flex space-x-4">
            <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md font-semibold shadow cursor-pointer" onClick={handleDonate}>
              Donate Blood
            </button>
            <button className="border-2 border-red-500 text-red-500 hover:bg-red-100 px-6 py-3 rounded-md font-semibold cursor-pointer" onClick={handleReport}>
              Report Shortage
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-2/5 mb-10 md:mb-0">
          <img src={heroImage} alt="Doctors and Heart Illustration" className="w-full" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
