import React, { useState, useEffect, useMemo } from 'react'; 
import { 
  FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaPaperPlane, FaUser, FaCheckCircle, 
  FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaHeadset, FaWhatsapp, FaCommentAlt, 
  FaShippingFast, FaUtensils, FaCreditCard, FaCommentDots, FaSignInAlt
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FeedbackPage from './FeedbackPage'; 

const CONTACT_BACKGROUNDS = [
  "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg",
  "https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg",
  "https://images.pexels.com/photos/905847/pexels-photo-905847.jpeg",
  "https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg"
];

function ContactPage() {
  const { user } = useAuth();
  
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentBgIndex(prevIndex => (prevIndex + 1) % CONTACT_BACKGROUNDS.length);
        setIsVisible(true);
      }, 2000);
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);
  const formContent = useMemo(() => {
    if (user) {
      return (
        <div className="p-0">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                <FaCommentDots className="text-white text-2xl" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Share Your Feedback</h2>
                <p className="text-gray-600 mt-2">Logged in? Let us know about your recent experience!</p>
              </div>
            </div>
          <FeedbackPage standalone={true} />
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center mb-6 shadow-xl">
              <FaSignInAlt className="text-orange-500 text-3xl" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Login Required for Feedback</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-sm">
              Please log in to your Foody-Ham account to submit your valuable feedback.
          </p>
          <Link
              to="/login"
              className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 py-4 rounded-xl text-xl font-semibold hover:shadow-2xl hover:shadow-orange-500/30 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-3 group"
          >
              <FaUser className="group-hover:scale-105 transition-transform" />
              Go to Login
          </Link>
      </div>
    );
  }, [user]);


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          {CONTACT_BACKGROUNDS.map((bg, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                index === currentBgIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img 
                src={bg} 
                alt="Food background" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/40"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-900/40 to-transparent"></div>
            </div>
          ))}
        </div>

        <div className="relative h-full flex items-center justify-center px-4">
          <div className="max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 mb-6 px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold animate-pulse">
              <FaHeadset className="text-white" />
              <span>24/7 CUSTOMER SUPPORT</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6">
              {user ? 'Share Your' : 'Get in' } 
              <span className="block mt-4 bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-300 bg-clip-text text-transparent">
                {user ? 'Feedback' : 'Touch' }
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed">
              {user 
                ? 'We rely on your feedback to continuously improve our food and service.'
                : "We're here to help, answer questions, and provide exceptional support"
              }
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-gray-200/50">
            {formContent} 
          </div>

          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8 border border-blue-200/50 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <FaMapMarkerAlt className="text-white text-2xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Visit Our Restaurant</h3>
                <p className="text-gray-700 leading-relaxed">
                  123 Gourmet Street, Culinary District<br />
                  Food City, FC 10101
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-3xl p-8 border border-green-200/50 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <FaPhone className="text-white text-2xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Call Us</h3>
                <p className="text-gray-700 text-lg font-semibold mb-2">+91 83478265444</p>
                <p className="text-gray-600 text-sm">General Inquiries</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl p-8 border border-purple-200/50 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <FaEnvelope className="text-white text-2xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Email Us</h3>
                <p className="text-gray-700 text-lg font-semibold mb-2">kanhaiya@foodyham.com</p>
                <p className="text-gray-600 text-sm">Support & Inquiries</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-amber-100 rounded-3xl p-8 border border-yellow-200/50 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <FaClock className="text-white text-2xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Business Hours</h3>
                <div className="space-y-1">
                  <p className="text-gray-700">Mon-Fri: 10:00 AM - 10:00 PM</p>
                  <p className="text-gray-700">Weekends: 9:00 AM - 11:00 PM</p>
                  <p className="text-gray-600 text-sm">Delivery available during business hours</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-500 via-orange-500 to-amber-500 rounded-3xl p-8 text-white shadow-2xl transform hover:-translate-y-1 transition-all duration-500">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <FaWhatsapp className="text-white text-3xl" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">24/7 Emergency Support</h3>
                    <p className="text-white/90">For urgent order issues and immediate assistance</p>
                  </div>
                </div>
                <div className="text-center md:text-right">
                  <div className="text-3xl font-black mb-2">+1 (800) 555-HELP</div>
                  <div className="bg-white text-orange-600 px-6 py-2 rounded-xl font-bold text-sm inline-block">
                    AVAILABLE 24/7
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
                    <FaMapMarkerAlt className="text-white text-xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Find Us on the Map</h3>
                </div>
                <div className="rounded-2xl overflow-hidden border-2 border-gray-100">
                  <div className="h-80">
                    <iframe
                      title="Foody-Ham Location"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.177858804427!2d-73.98784468459418!3d40.70555177933205!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a315cdf4c9b%3A0x8b934de5cae6f7a!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1624567890123!5m2!1sen!2s"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      className="rounded-lg"
                    ></iframe>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <p className="text-gray-600">Get directions to our flagship restaurant</p>
                  <button className="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-semibold hover:bg-black transition-colors">
                    Get Directions
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24">
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl shadow-2xl p-12 text-center text-white">
            <h3 className="text-3xl font-bold mb-6">Connect With Us</h3>
            <p className="text-gray-300 mb-10 max-w-2xl mx-auto text-lg leading-relaxed">
              Follow us on social media for daily specials, cooking tips, and behind-the-scenes content
            </p>
            
            <div className="flex flex-wrap justify-center gap-6">
              {[
                { icon: <FaFacebook />, label: "Facebook", color: "from-blue-600 to-blue-700", hover: "hover:from-blue-700 hover:to-blue-800" },
                { icon: <FaInstagram />, label: "Instagram", color: "from-pink-500 to-purple-500", hover: "hover:from-pink-600 hover:to-purple-600" },
                { icon: <FaTwitter />, label: "Twitter", color: "from-blue-400 to-cyan-500", hover: "hover:from-blue-500 hover:to-cyan-600" },
                { icon: <FaYoutube />, label: "YouTube", color: "from-red-500 to-red-600", hover: "hover:from-red-600 hover:to-red-700" },
                { icon: <FaWhatsapp />, label: "WhatsApp", color: "from-green-500 to-green-600", hover: "hover:from-green-600 hover:to-green-700" }
              ].map((social, index) => (
                <a
                  key={index}
                  href="#"
                  className={`group bg-gradient-to-br ${social.color} ${social.hover} w-24 h-24 rounded-3xl flex flex-col items-center justify-center gap-3 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2`}
                >
                  <div className="text-3xl text-white">{social.icon}</div>
                  <span className="text-white text-sm font-medium">{social.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;