import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope, FaPhone } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold text-orange-500 mb-4">Foody-Ham</h3>
            <p className="text-gray-300">Your go-to platform for delicious and fresh foods delivered right to your doorstep.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-orange-400 transition">Home</Link></li>
              <li><Link to="/menu" className="text-gray-300 hover:text-orange-400 transition">Menu</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-orange-400 transition">About</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-orange-400 transition">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <FaEnvelope className="text-orange-400" />
                <span className="text-gray-300">info@foodyham.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaPhone className="text-orange-400" />
                <span className="text-gray-300">+91 9153890946</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/profile.php?id=100040335400748" className="text-gray-300 hover:text-blue-400 transition">
                <FaFacebook size={24} />
              </a>
              <a href="" className="text-gray-300 hover:text-blue-400 transition">
                <FaTwitter size={24} />
              </a>
              <a href="#" className="text-gray-300 hover:text-pink-400 transition">
                <FaInstagram size={24} />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; 2025 Foody-Ham. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;