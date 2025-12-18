import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const PromotionBanner = () => {
  const [activePromotions, setActivePromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const location = useLocation();
  
  const showOnPages = ['/'];
  const shouldShow = showOnPages.includes(location.pathname);

  useEffect(() => {
    fetchActivePromotions();
  }, []);

  const fetchActivePromotions = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/promotions/active`);
      setActivePromotions(response.data.data);
    } catch (error) {
      console.error('Error fetching active promotions:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTimeLeft = (endDate) => {
    const difference = +new Date(endDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    if (activePromotions.length > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(calculateTimeLeft(activePromotions[currentIndex].endDate));
      }, 1000);
      return () => clearTimeout(timer);
    }
  });

  useEffect(() => {
    if (activePromotions.length > 1) {
      const slideTimer = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % activePromotions.length);
      }, 5000);
      return () => clearInterval(slideTimer);
    }
  }, [activePromotions.length]);



  // Don't render if not on home/menu pages or no promotions
  if (!shouldShow || activePromotions.length === 0) {
    return null;
  }

  if (loading || activePromotions.length === 0) return null;

  const promotion = activePromotions[currentIndex];
  const timerComponents = [];

  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval]) return;
    timerComponents.push(
      <span key={interval} className="text-4xl md:text-5xl font-bold">
        {timeLeft[interval]} {interval}{" "}
      </span>
    );
  });

  return (
    <div className="text-center mt-6 overflow-hidden">
      <div className="text-5xl md:text-7xl font-extrabold text-white leading-tight">
        <div className="animate-marquee whitespace-nowrap">
          🔥 {promotion?.name} - {promotion?.description}
        </div>
        {timerComponents.length > 0 && (
          <div className="text-4xl md:text-5xl text-red-400 mt-4">
            ⏰ {timeLeft.days || 0}D {timeLeft.hours || 0}H {timeLeft.minutes || 0}M {timeLeft.seconds || 0}S
          </div>
        )}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 10s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default PromotionBanner;