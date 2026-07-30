import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#0F172A] text-gray-300 py-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Logo & Description */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span className="text-white font-semibold text-lg">BloodLink</span>
          </div>
          <p className="text-sm text-gray-400">
            Connecting blood donors with those in need, saving lives one donation at a time.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:underline">About Us</a></li>
            <li><a href="#" className="hover:underline">How it Works</a></li>
            <li><a href="#" className="hover:underline">FAQs</a></li>
            <li><a href="#" className="hover:underline">Contact</a></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="text-white font-semibold mb-3">Resources</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:underline">Donation Guide</a></li>
            <li><a href="#" className="hover:underline">Blood Types</a></li>
            <li><a href="#" className="hover:underline">Eligibility</a></li>
            <li><a href="#" className="hover:underline">News</a></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h4 className="text-white font-semibold mb-3">Connect</h4>
          <div className="flex gap-4">
            <span className="w-5 h-5 bg-gray-400 rounded-full hover:bg-white transition cursor-pointer"></span>
            <span className="w-5 h-5 bg-gray-400 rounded-full hover:bg-white transition cursor-pointer"></span>
            <span className="w-5 h-5 bg-gray-400 rounded-full hover:bg-white transition cursor-pointer"></span>
            <span className="w-5 h-5 bg-gray-400 rounded-full hover:bg-white transition cursor-pointer"></span>
          </div>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-500">
        © 2025 BloodLink. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
