import React, { useState, useEffect } from 'react';
import { FaLeaf, FaShippingFast, FaAward, FaHeart, FaClock, FaUsers, FaCheese, FaFish, FaAppleAlt, FaCoffee, FaUtensils, FaStar, FaQuoteLeft, FaQuoteRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import AnimatedCounter from '../components/AnimatedCounter';
import FadeInAnimation from '../components/FadeInAnimation';

// Background images for the hero slider
const ABOUT_BACKGROUNDS = [
  "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg",
  "https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg",
  "https://images.pexels.com/photos/905847/pexels-photo-905847.jpeg",
  "https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg"
];

// Cuisine type icons for variety display
const CUISINE_TYPES = [
  { icon: <FaCheese />, name: "Italian", color: "from-yellow-500 to-amber-500" },
  { icon: <FaFish />, name: "Seafood", color: "from-blue-500 to-cyan-500" },
  { icon: <FaAppleAlt />, name: "Healthy", color: "from-green-500 to-emerald-500" },
  { icon: <FaCoffee />, name: "Desserts", color: "from-purple-500 to-pink-500" },
  { icon: <FaUtensils />, name: "Gourmet", color: "from-red-500 to-orange-500" }
];

function AboutPage() {
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Auto-sliding background effect
  useEffect(() => {
    const intervalId = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentBgIndex(prevIndex => (prevIndex + 1) % ABOUT_BACKGROUNDS.length);
        setIsVisible(true);
      }, 300);
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Enhanced Hero Section with Auto-Sliding Background */}
      <section className="relative h-[80vh] md:h-[85vh] overflow-hidden">
        {/* Background Slider */}
        <div className="absolute inset-0">
          {ABOUT_BACKGROUNDS.map((bg, index) => (
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-black/20"></div>
            </div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative h-full flex items-center justify-center px-4">
          <div className="max-w-4xl text-center">
            {/* Animated Badge */}
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold animate-pulse">
              <span>✨</span>
              <span>ESTABLISHED 2018</span>
            </div>

            {/* Main Title */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6">
              About <span className="block mt-4 bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-300 bg-clip-text text-transparent animate-gradient">
                Foody-Ham
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed">
              Where culinary excellence meets unforgettable dining experiences
            </p>

            {/* Cuisine Variety */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {CUISINE_TYPES.map((cuisine, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
                >
                  <div className={`p-2 rounded-full bg-gradient-to-br ${cuisine.color} text-white`}>
                    {cuisine.icon}
                  </div>
                  <span className="text-white font-medium">{cuisine.name}</span>
                </div>
              ))}
            </div>

            {/* Scroll Indicator */}
            <div className="animate-bounce mt-8">
              <svg className="w-6 h-6 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section - Starts immediately after hero */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image Column with Floating Elements */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                  alt="Chef preparing food" 
                  className="w-full h-[500px] object-cover transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
              
              {/* Floating Stats Card */}
              <div className="absolute -bottom-6 -right-6 bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-orange-100 max-w-xs">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
                    <FaStar className="text-white text-xl" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gray-900">4.9★</div>
                    <div className="text-sm text-gray-600">Customer Rating</div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">Consistently rated excellent since 2018</p>
              </div>
            </div>

            {/* Story Content */}
            <div>
              <div className="inline-flex items-center gap-2 text-sm text-orange-500 font-semibold mb-4">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                OUR JOURNEY
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                A Story of <span className="text-orange-500">Passion</span> & <span className="text-orange-500">Dedication</span>
              </h2>
              
              <div className="space-y-6">
                <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:border-orange-200 transition-colors duration-300">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">The Beginning</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Founded in 2018 by Kanhaiya Patel, a chef with 15+ years of experience, 
                    Foody-Ham started as a small kitchen with a big dream: to bring gourmet 
                    dining experiences to every home.
                  </p>
                </div>
                
                <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:border-orange-200 transition-colors duration-300">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Growth & Innovation</h3>
                  <p className="text-gray-600 leading-relaxed">
                    We've grown from a single kitchen to partnering with 50+ top restaurants, 
                    constantly innovating our menu and delivery systems to exceed customer 
                    expectations.
                  </p>
                </div>
                
                <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:border-orange-200 transition-colors duration-300">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Today's Vision</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Today, we're more than a food delivery service—we're a culinary community 
                    dedicated to sustainability, innovation, and creating unforgettable 
                    dining moments.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid - Enhanced */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-sm text-orange-500 font-semibold mb-3">
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
              WHY CHOOSE US
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              The Foody-Ham <span className="text-orange-500">Difference</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <FaLeaf />,
                title: "Farm-Fresh Ingredients",
                description: "Sourced daily from local farms and trusted suppliers for maximum freshness and flavor.",
                color: "from-green-500 to-emerald-500",
                bg: "bg-green-50"
              },
              {
                icon: <FaShippingFast />,
                title: "30-Minute Guarantee",
                description: "Your food arrives hot and fresh, or your meal is on us. We stand by our delivery promise.",
                color: "from-blue-500 to-cyan-500",
                bg: "bg-blue-50"
              },
              {
                icon: <FaAward />,
                title: "Award-Winning Chefs",
                description: "Our culinary team includes award-winning chefs with decades of combined experience.",
                color: "from-yellow-500 to-amber-500",
                bg: "bg-yellow-50"
              },
              {
                icon: <FaHeart />,
                title: "Crafted with Passion",
                description: "Every dish is prepared with love and attention to detail by our passionate culinary team.",
                color: "from-pink-500 to-rose-500",
                bg: "bg-pink-50"
              },
              {
                icon: <FaClock />,
                title: "24/7 Availability",
                description: "Satisfy your cravings anytime. We're always here to serve you, day or night.",
                color: "from-purple-500 to-indigo-500",
                bg: "bg-purple-50"
              },
              {
                icon: <FaUsers />,
                title: "Community Focus",
                description: "We support local farmers and businesses, building stronger communities together.",
                color: "from-teal-500 to-emerald-500",
                bg: "bg-teal-50"
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className={`${feature.bg} backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2`}
              >
                <div className={`w-20 h-20 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                  <div className="text-white text-2xl">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 text-center mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section - Enhanced */}
      <section className="py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-12">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { value: 10000, suffix: "+", label: "Happy Customers", description: "Served with love" },
                  { value: 50, suffix: "+", label: "Restaurant Partners", description: "Top chefs & kitchens" },
                  { value: 30, suffix: "min", label: "Avg. Delivery", description: "Fast & reliable" },
                  { value: 4.9, suffix: "★", label: "Rating", description: "Consistently excellent" }
                ].map((stat, index) => (
                  <FadeInAnimation key={index} delay={index * 200} className="text-center text-white">
                    <div className="text-5xl md:text-6xl font-black mb-2 drop-shadow-lg">
                      <AnimatedCounter end={stat.value} suffix={stat.suffix} duration={2000} />
                    </div>
                    <div className="text-lg font-semibold mb-1">{stat.label}</div>
                    <div className="text-orange-100 text-sm">{stat.description}</div>
                  </FadeInAnimation>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section - Enhanced */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-sm text-orange-500 font-semibold mb-3">
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
              MEET THE MAKERS
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our <span className="text-orange-500">Culinary</span> Experts
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Behind every delicious meal is a team of passionate professionals dedicated to culinary excellence
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Kanhaiya Patel",
                role: "Head Chef & Founder",
                image: "https://scontent.fcjb9-1.fna.fbcdn.net/v/t51.82787-15/518490686_18040697312640591_920984695367973955_n.webp?stp=dst-jpg_tt6&_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_ohc=_loR3isYy4QQ7kNvwElzzE8&_nc_oc=AdnbPUsmEhxL_HgrKTnKgjqidkATUBza1D_yk-LFbt8L-D5lfXPt3QRYetExVLquozo&_nc_zt=23&_nc_ht=scontent.fcjb9-1.fna&_nc_gid=NE7FJZVny523Xovq7kua_w&oh=00_Afl47ScqZeu-jcT2oPIPMhDpRIfM1wEh0f5stnkbIu7Vyw&oe=6948B475",
                expertise: "French & Italian Cuisine",
                experience: "3+ years"
              },
              {
                name: "Manish Basnet",
                role: "Operations Director",
                image: "https://scontent.fcjb9-1.fna.fbcdn.net/v/t39.30808-6/518351121_1113165284207358_2673730983408966392_n.jpg?stp=dst-jpg_s1080x2048_tt6&_nc_cat=108&ccb=1-7&_nc_sid=127cfc&_nc_ohc=qfDXiWv48X4Q7kNvwHBy75i&_nc_oc=Adk1dYBHTdIeZRnUQJZhmY_BYdep0ZSO0aGhmHt4KKSKv6CQ93HdodoIERIh5RBgXbM&_nc_zt=23&_nc_ht=scontent.fcjb9-1.fna&_nc_gid=M_DPbH9It5u0Nv2TwU72SQ&oh=00_AflEQPBR6ccYU1rzGsBDxLBVZQrkiEiA1Kgjp2NBi34PFA&oe=6948AD24",
                expertise: "Logistics & Service",
                experience: "2+ years"
              },
              {
                name: "Mansur Ansari",
                role: "Delivery Manager",
                image: "https://scontent.fcjb9-1.fna.fbcdn.net/v/t1.6435-9/109987350_171589127736219_8436484495003339226_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=cn7puPQhXx4Q7kNvwEJj_38&_nc_oc=Adn0UQq8fG-S0OXT_43nSunf-EIjU1wpNCJ5OGsQSjthV06ttby7aaSPTIsqR5WeeEY&_nc_zt=23&_nc_ht=scontent.fcjb9-1.fna&_nc_gid=cCN4h8j3MFy2T9qhkG2rfQ&oh=00_Afk6woGMfq3McKmI_W92U1MNrXVNXsIk7kveEzmGBvpj1g&oe=696A6255",
                expertise: "Supply Chain Management",
                experience: "2+ years"
              },
              {
                name: "Jp Shah",
                role: "Marketing Director",
                image: "https://scontent.fcjb9-1.fna.fbcdn.net/v/t39.30808-6/482322510_1180268196803307_8207768455086781827_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=ymiG6AtZkFgQ7kNvwHoqu4u&_nc_oc=AdnAjFj2YynggTBQLCrwqi1IzNLJyv9KPC7atZOFazvHcTQ7qa90OF_el9p8asBhK1E&_nc_zt=23&_nc_ht=scontent.fcjb9-1.fna&_nc_gid=xIdVdGYPe3-sk9Q8j_bnng&oh=00_Afn1ODRu03VnNTEjtysXuwTXfk4vVOIwsdYrI01zDb6qyg&oe=6948C03E",
                expertise: "Brand Strategy",
                experience: "2+ years"
              }
            ].map((member, index) => (
              <div 
                key={index} 
                className="group bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex justify-between items-end">
                      <div>
                        <h3 className="text-xl font-bold text-white">{member.name}</h3>
                        <p className="text-orange-300 font-medium">{member.role}</p>
                      </div>
                      <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        {member.experience}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <span className="text-sm font-medium text-orange-500">{member.expertise}</span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Bringing expertise and passion to create exceptional dining experiences
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-12 text-center text-white shadow-2xl">
            <FaQuoteLeft className="text-4xl text-orange-400 mx-auto mb-8 opacity-50" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              What Our <span className="text-orange-400">Customers</span> Say
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              "Foody-Ham transformed our family dinners! The quality and service are consistently exceptional. 
              From quick weeknight meals to special occasions, they never disappoint."
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="text-amber-500 flex">
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
              </div>
              <span className="text-gray-300">- Sarah Johnson, Regular Customer</span>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Ready to Experience <span className="text-orange-500">Culinary Magic</span>?
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of satisfied customers who trust Foody-Ham for exceptional dining experiences
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/menu" 
              className="group bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-2xl hover:shadow-orange-500/30 transition-all duration-300 transform hover:-translate-y-1 inline-flex items-center justify-center gap-3"
            >
              Explore Our Menu
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link 
              to="/contact" 
              className="bg-white text-gray-800 px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 hover:border-orange-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;