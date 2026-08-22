import React, { useState, useEffect } from 'react';
import { FaMotorcycle, FaStore, FaHome, FaPhoneAlt, FaCommentDots, FaStar, FaShieldAlt, FaCompass } from 'react-icons/fa';

function DeliveryMap({ orderStatus = 'Out for Delivery', driverName = "Ramesh Patel", etaMinutes = 14 }) {
  const [progress, setProgress] = useState(0.45);
  const [isSimulating, setIsSimulating] = useState(true);

  useEffect(() => {
    if (!isSimulating || orderStatus === 'Delivered') return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 0.95) return 0.95;
        return prev + 0.015;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [isSimulating, orderStatus]);

  const startX = 60;
  const startY = 220;
  const endX = 540;
  const endY = 80;
  const controlX = 300;
  const controlY = 280;

  const t = progress;
  const driverX = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * controlX + t * t * endX;
  const driverY = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * controlY + t * t * endY;

  const dynamicEta = Math.max(1, Math.round(etaMinutes * (1 - progress)));

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden font-sans">
      {/* Map Header Overlay */}
      <div className="p-4 bg-gradient-to-r from-slate-900 via-gray-900 to-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center ring-1 ring-orange-500/30">
            <FaCompass className="animate-spin-slow text-xl" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-white">Live GPS Delivery Map</h3>
            <p className="text-xs text-slate-400">Real-time driver telemetry</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span> GPS Active
          </span>
          <button
            onClick={() => setProgress(0.1)}
            className="text-xs px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700"
          >
            Reset GPS
          </button>
        </div>
      </div>

      {/* Interactive Vector Map Canvas */}
      <div className="relative w-full h-[340px] bg-[#eef2f6] dark:bg-[#131b2e] overflow-hidden select-none">
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" className="text-gray-200 dark:text-gray-800/40" strokeWidth="1" />
            </pattern>
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="50%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>

          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Secondary Roads Visual Mesh */}
          <path d="M 0 100 Q 200 120 600 90" fill="none" stroke="currentColor" className="text-gray-300 dark:text-gray-800" strokeWidth="8" strokeLinecap="round" />
          <path d="M 120 0 Q 150 200 180 340" fill="none" stroke="currentColor" className="text-gray-300 dark:text-gray-800" strokeWidth="10" strokeLinecap="round" />
          <path d="M 400 0 Q 420 180 460 340" fill="none" stroke="currentColor" className="text-gray-300 dark:text-gray-800" strokeWidth="8" strokeLinecap="round" />

          {/* Active Route Curve */}
          <path
            d={`M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`}
            fill="none"
            stroke="url(#routeGradient)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="8 6"
            className="animate-pulse"
          />
        </svg>

        {/* Restaurant Marker */}
        <div className="absolute flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2 z-10" style={{ left: `${startX}px`, top: `${startY}px` }}>
          <div className="bg-orange-600 text-white p-2.5 rounded-2xl shadow-lg shadow-orange-600/40 ring-4 ring-orange-500/20">
            <FaStore size={20} />
          </div>
          <span className="mt-1 px-2 py-0.5 bg-slate-900/90 text-white text-[10px] font-extrabold rounded-md shadow-md">
            Foody-Ham Kitchen
          </span>
        </div>

        {/* Customer Marker */}
        <div className="absolute flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2 z-10" style={{ left: `${endX}px`, top: `${endY}px` }}>
          <div className="bg-emerald-600 text-white p-2.5 rounded-2xl shadow-lg shadow-emerald-600/40 ring-4 ring-emerald-500/20">
            <FaHome size={20} />
          </div>
          <span className="mt-1 px-2 py-0.5 bg-slate-900/90 text-white text-[10px] font-extrabold rounded-md shadow-md">
            Delivery Address
          </span>
        </div>

        {/* Driver Scooter Marker */}
        <div 
          className="absolute flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-700 ease-out"
          style={{ left: `${driverX}px`, top: `${driverY}px` }}
        >
          <div className="absolute w-14 h-14 bg-amber-500/30 rounded-full animate-ping -z-10"></div>
          <div className="bg-gradient-to-tr from-amber-500 to-orange-500 text-white p-3 rounded-2xl shadow-2xl shadow-orange-500/50 ring-4 ring-amber-400/40">
            <FaMotorcycle size={22} className="animate-pulse" />
          </div>
          <div className="mt-1 flex items-center gap-1.5 bg-slate-900 text-white px-2.5 py-1 rounded-full shadow-xl border border-slate-700">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
            <span className="text-[11px] font-black text-amber-400">{dynamicEta} mins</span>
          </div>
        </div>
      </div>

      {/* Driver Info Banner */}
      <div className="p-5 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 border-t border-gray-100 dark:border-gray-800">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 p-0.5 shadow-md">
                <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-white font-extrabold text-xl">
                  {driverName.charAt(0)}
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full text-[10px] ring-2 ring-white dark:ring-gray-900">
                <FaShieldAlt />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-extrabold text-gray-900 dark:text-gray-100 text-base">{driverName}</h4>
                <span className="flex items-center gap-1 text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold px-2 py-0.5 rounded-md border border-amber-500/20">
                  <FaStar size={11} className="text-amber-500" /> 4.9 (140+ Deliveries)
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Honda Activa 6G • <span className="font-bold text-gray-700 dark:text-gray-300">BA 2 PA 4521</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <a
              href="tel:+9779800000000"
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-lg shadow-orange-500/20 transition-all"
            >
              <FaPhoneAlt size={12} /> Call Driver
            </a>
            <button
              onClick={() => alert(`Chatting with driver ${driverName}...`)}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold text-xs transition-all"
            >
              <FaCommentDots size={14} /> Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeliveryMap;
