import React from 'react';
import NavBar from './NavBar';
import HeroSection from './HeroSection';
import Statistics from './Statistics';
import Requirements from './Requirements';
import Footer from './Footer';

const HomePage = () => {
  return (
    <div className="font-sans mt-10">
      <NavBar />
      <HeroSection />
      <Statistics />
      <Requirements />
      <Footer />
    </div>
  );
};

export default HomePage;
