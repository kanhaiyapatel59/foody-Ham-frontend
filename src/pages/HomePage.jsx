import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import FoodCard from '../components/FoodCard';
import PromotionBanner from '../components/PromotionBanner';
import axios from 'axios';
// Import Swiper React components - you'll need to install this
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import { FaBookmark } from 'react-icons/fa'; // Added icon for the product card overlay

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

// =======================================================
// Global Setup (Keep outside component)
// =======================================================
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Image URLs for hero background
const HERO_IMAGES = [
  "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg",
  "https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg",
  "https://images.pexels.com/photos/905847/pexels-photo-905847.jpeg",
  "https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg",
  "https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg",
  "https://images.pexels.com/photos/106343/pexels-photo-106343.jpeg",
];

// Stats data for the hero section
const STATS = [
  { value: '500+', label: 'Happy Customers' },
  { value: '50+', label: 'Menu Items' },
  { value: '24/7', label: 'Delivery Service' },
  { value: '15 min', label: 'Avg. Delivery Time' },
];

// =======================================================
// Enhanced Home Page Component with Professional Design
// =======================================================
function HomePage() {
  const [featuredFoods, setFeaturedFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const heroSectionRef = useRef(null);

  // Enhanced Background Slider with crossfade effect
  useEffect(() => {
    const intervalId = setInterval(() => {
      setIsHeroVisible(false);
      setTimeout(() => {
        setHeroImageIndex(prevIndex => (prevIndex + 1) % HERO_IMAGES.length);
        setIsHeroVisible(true);
      }, 300);
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  // Enhanced Data Fetching with error handling
  const fetchFeaturedProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/products?featured=true&limit=12');
      
      if (response.data.success) {
        const products = response.data.data.map(product => ({
          id: product._id || product.id,
          name: product.name,
          image: product.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop',
          description: product.description,
          price: product.price,
          category: product.category,
          rating: product.rating || 4.5,
          isFeatured: product.isFeatured || false,
        }));
        
        setFeaturedFoods(products);
      }
    } catch (err) {
      console.error('Error fetching featured products:', err);
      // Fallback to mock data if API fails
      setFeaturedFoods([
        {
          id: 1,
          name: "Gourmet Pizza",
          image: "https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg",
          description: "Freshly baked with premium ingredients",
          price: 24.99,
          category: "pizza",
          rating: 4.8,
        },
        {
          id: 2,
          name: "Caesar Salad",
          image: "https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg",
          description: "Crisp romaine with house-made dressing",
          price: 16.99,
          category: "salad",
          rating: 4.6,
        },
        {
          id: 3,
          name: "Pasta Carbonara",
          image: "https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg",
          description: "Creamy Italian classic",
          price: 22.99,
          category: "pasta",
          rating: 4.7,
        },
        {
          id: 4,
          name: "Chocolate Lava Cake",
          image: "https://images.pexels.com/photos/132694/pexels-photo-132694.jpeg",
          description: "Warm molten chocolate center",
          price: 14.99,
          category: "dessert",
          rating: 4.9,
        },
        {
          id: 5,
          name: "Burger Deluxe",
          image: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg",
          description: "Premium beef with special sauce",
          price: 18.99,
          category: "burger",
          rating: 4.5,
        },
        {
          id: 6,
          name: "Sushi Platter",
          image: "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg",
          description: "Assorted fresh sushi selection",
          price: 32.99,
          category: "sushi",
          rating: 4.8,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  return (
    // Set a dark background for the entire page body for a consistent look
    <div className="min-h-screen bg-gray-900 text-white">
      
      {/* ======================================================= 
          HERO SECTION - Custom Dribbble Style with Dark BG
          ======================================================= */}
      <section 
        ref={heroSectionRef}
        // Keep original dark background and height
        className="relative h-[90vh] md:h-[85vh] overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"
      >
        
        {/* KEEP ORIGINAL DARK BACKGROUND SLIDER LOGIC */}
        <div className="absolute inset-0 w-full h-full z-0">
          <img 
            src={HERO_IMAGES[heroImageIndex]} 
            alt="Delicious food background" 
            className={`w-full h-full object-cover transition-all duration-1000 ease-in-out ${
              isHeroVisible ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ filter: 'brightness(0.9)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-black/20"></div>
        </div>

        {/* Hero Content - Adapted to Dribbble Image Structure (Text + Rounded Image) */}
        <div className="relative z-10 h-full flex flex-col justify-center px-4 md:px-8 lg:px-16">
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 items-center gap-10">
            
            {/* Left Content (Text and Buttons) - Matching the Dribbble structure/text */}
            <div className="text-left py-10 lg:py-0">
                {/* Main Heading - Using Dribbble text */}
                <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
                    It's not just <br />
                    Food, It's an <br />
                    <span className="text-red-500">Experience.</span>
                </h1>

                {/* Subtitle/Description */}
                <p className="text-xl text-gray-300 mb-8 max-w-md">
                    Experience culinary excellence with our chef-crafted dishes.
                </p>

                {/* CTA Buttons */}
                <div className="flex space-x-4 items-center mb-12">
                    <Link 
                        to="/menu" 
                        // Red fill button for dark background
                        className="px-8 py-3 bg-red-600 text-white text-lg font-semibold rounded-full shadow-lg shadow-red-500/30 hover:bg-red-700 transition-colors"
                    >
                        View Menu
                    </Link>
                    <Link 
                        to="/contact" 
                        // White outline button for dark background
                        className="px-8 py-3 text-white border-2 border-white/30 bg-transparent text-lg font-semibold rounded-full hover:bg-white/10 transition-colors"
                    >
                        Book a Table
                    </Link>
                </div>
                
                {/* Promotion Banner */}
                <PromotionBanner />
                
           
            </div>

            {/* Right Content (Rounded Dish Visual) - DIRECTLY MIMICKING DRIBBBLE VISUAL */}
            <div className="hidden lg:flex justify-center items-center relative">
                <div className="w-full max-w-lg aspect-square bg-white/10 rounded-full flex items-center justify-center relative shadow-2xl shadow-black/50">
                   {/* 🚨 Updated Image URL to an attractive pizza image */}
                   <img 
                        src="https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg"
                        alt="Main Feature Pizza Dish"
                        className="w-[85%] h-[85%] object-cover rounded-full shadow-inner shadow-gray-700/50"
                    />
                    {/* Floating elements (15% discount badge) */}
                    <div className="absolute top-10 right-0 p-3 bg-red-600 rounded-full shadow-xl flex flex-col items-center justify-center w-16 h-16">
                        <span className="text-sm font-bold text-white leading-none">15% OFF</span>
                        <span className="text-xs text-white leading-none">Voucher</span>
                    </div>
                    {/* Placeholder for floating elements */}
                    <div className="absolute bottom-5 left-5 w-12 h-12 bg-green-500/20 rounded-full animate-pulse blur-sm"></div>
                    <div className="absolute top-1/4 right-5 w-8 h-8 bg-red-500/20 rounded-full animate-pulse blur-sm"></div>
                </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator (Kept from original code) */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* ======================================================= 
          FEATURED FOODS SECTION - Background Changed to Dark
          ======================================================= */}
      <section className="py-16 md:py-24 px-4 md:px-8 lg:px-16 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          {/* Section Header (Text color adjusted for dark BG) */}
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 text-sm text-red-500 font-semibold mb-3">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              OUR SPECIALTIES
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Featured <span className="text-red-500">Delicacies</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Discover our chef's selection of premium dishes, crafted with passion and perfection
            </p>
          </div>

          {/* Loading State (Colors adjusted for dark BG) */}
          {loading ? (
            <div className="flex justify-center items-center h-96">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-400 text-lg">Loading featured delicacies...</p>
              </div>
            </div>
          ) : featuredFoods.length === 0 ? (
            <div className="text-center py-16 bg-gray-800 rounded-2xl border border-gray-700">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-700 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">No Featured Items</h3>
              <p className="text-gray-400 mb-6">Check back soon for new featured dishes!</p>
              <Link to="/menu" className="inline-flex items-center gap-2 text-red-500 hover:text-red-600 font-semibold">
                Browse Full Menu
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          ) : (
            <div className="relative">
              {/* Professional Swiper Slider - Shows 4 items at once */}
              <Swiper
                modules={[Navigation, Autoplay, Pagination]}
                spaceBetween={24}
                slidesPerView={1}
                breakpoints={{
                  640: { slidesPerView: 2 },
                  768: { slidesPerView: 3 },
                  1024: { slidesPerView: 4 },
                }}
                navigation={{
                  nextEl: '.swiper-button-next',
                  prevEl: '.swiper-button-prev',
                }}
                pagination={{ 
                  clickable: true,
                  dynamicBullets: true,
                }}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                loop={featuredFoods.length > 4}
                className="pb-12"
              >
                {featuredFoods.map((food) => (
                  <SwiperSlide key={food.id}>
                    <div className="h-full transform transition-transform duration-300 hover:-translate-y-2">
                      {/* FIX: REMOVED the redundant <Link> wrapper here. 
                         The FoodCard component is now responsible for its own navigation link.
                      */}
                      
                        {/* Ensure FoodCard content is readable on dark background */}
                        <FoodCard 
                          {...food} 
                          className="h-full bg-gray-800 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-700 overflow-hidden"
                        />
                        {/* Rating Badge */}
                        {food.rating && (
                          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                            <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-sm font-bold text-gray-900">{food.rating}</span>
                          </div>
                        )}
                      
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Custom Navigation Buttons (Adjusted colors for dark BG) */}
              <div className="swiper-button-prev !w-12 !h-12 !rounded-full !bg-white !shadow-xl !text-gray-800 hover:!bg-red-50 !transition-all after:!text-lg after:!font-bold"></div>
              <div className="swiper-button-next !w-12 !h-12 !rounded-full !bg-white !shadow-xl !text-gray-800 hover:!bg-red-50 !transition-all after:!text-lg after:!font-bold"></div>
            </div>
          )}

          {/* View All Button (Adjusted colors for dark BG) */}
          {featuredFoods.length > 0 && (
            <div className="text-center mt-12">
              <Link 
                to="/menu" 
                className="inline-flex items-center gap-2 text-lg font-semibold text-gray-300 hover:text-red-500 transition-colors group"
              >
                View Full Menu
                <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default HomePage;