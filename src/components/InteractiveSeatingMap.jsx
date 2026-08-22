import React from 'react';
import { FaChair, FaUsers, FaCheckCircle, FaStar, FaStore } from 'react-icons/fa';

const tablesData = [
  // Window Zone
  { id: 'T1', name: 'Table 1', zone: 'Window View 🌅', capacity: 2, status: 'available', price: 'Standard' },
  { id: 'T2', name: 'Table 2', zone: 'Window View 🌅', capacity: 4, status: 'reserved', price: 'Popular' },
  { id: 'T3', name: 'Table 3', zone: 'Window View 🌅', capacity: 2, status: 'available', price: 'Standard' },

  // VIP Booths Zone
  { id: 'B1', name: 'Booth A', zone: 'VIP Booth 🛋️', capacity: 6, status: 'available', price: 'Premium' },
  { id: 'B2', name: 'Booth B', zone: 'VIP Booth 🛋️', capacity: 6, status: 'reserved', price: 'Premium' },
  { id: 'B3', name: 'Booth C', zone: 'VIP Booth 🛋️', capacity: 8, status: 'available', price: 'VIP Executive' },

  // Outdoor Terrace Zone
  { id: 'G1', name: 'Terrace 1', zone: 'Garden Terrace 🌿', capacity: 4, status: 'available', price: 'Romantic' },
  { id: 'G2', name: 'Terrace 2', zone: 'Garden Terrace 🌿', capacity: 4, status: 'available', price: 'Romantic' },
  { id: 'G3', name: 'Terrace 3', zone: 'Garden Terrace 🌿', capacity: 2, status: 'reserved', price: 'Standard' },

  // Main Hall Zone
  { id: 'M1', name: 'Main 1', zone: 'Main Dining Hall 🍽️', capacity: 4, status: 'available', price: 'Standard' },
  { id: 'M2', name: 'Main 2', zone: 'Main Dining Hall 🍽️', capacity: 4, status: 'available', price: 'Standard' },
  { id: 'M3', name: 'Main 3', zone: 'Main Dining Hall 🍽️', capacity: 8, status: 'available', price: 'Family Table' }
];

function InteractiveSeatingMap({ selectedTableId, onSelectTable }) {
  const selectedTable = tablesData.find((t) => t.id === selectedTableId);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-800 font-sans space-y-6">
      
      {/* Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-4">
        <div>
          <h3 className="font-extrabold text-lg text-gray-900 dark:text-white flex items-center gap-2">
            <FaChair className="text-orange-500" /> Choose Your Table Seating
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Click an available table on the 2D floorplan to lock your reservation.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs font-bold">
          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span> Available
          </span>
          <span className="flex items-center gap-1.5 text-orange-600 dark:text-orange-400">
            <span className="w-3 h-3 rounded-full bg-orange-500"></span> Selected
          </span>
          <span className="flex items-center gap-1.5 text-gray-400">
            <span className="w-3 h-3 rounded-full bg-red-400"></span> Reserved
          </span>
        </div>
      </div>

      {/* 2D Floor Plan Canvas Grid */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 relative overflow-hidden border border-slate-800 shadow-inner select-none">
        
        {/* Kitchen/Stage Banner Motif */}
        <div className="w-full py-2 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 text-white text-center font-extrabold text-xs rounded-xl uppercase tracking-widest mb-8 shadow-md flex items-center justify-center gap-2">
          <FaStore /> Main Kitchen & Bar Area
        </div>

        {/* Tables Grid Layout */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {tablesData.map((tbl) => {
            const isSelected = selectedTableId === tbl.id;
            const isReserved = tbl.status === 'reserved';

            return (
              <button
                key={tbl.id}
                type="button"
                disabled={isReserved}
                onClick={() => onSelectTable(tbl.id)}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-between gap-3 text-center relative ${
                  isReserved
                    ? 'bg-slate-800/60 border-slate-700/50 text-slate-500 cursor-not-allowed opacity-60'
                    : isSelected
                    ? 'bg-gradient-to-br from-orange-500 to-amber-500 border-white text-white shadow-xl scale-105 ring-4 ring-orange-500/30'
                    : 'bg-slate-800 hover:bg-slate-700/80 border-slate-700 hover:border-orange-500/50 text-slate-200'
                }`}
              >
                {/* Status Badge */}
                {isSelected ? (
                  <span className="absolute -top-2 -right-2 bg-white text-orange-600 p-1 rounded-full text-xs shadow-md">
                    <FaCheckCircle />
                  </span>
                ) : isReserved ? (
                  <span className="text-[10px] font-black uppercase text-red-400 bg-red-950/60 px-2 py-0.5 rounded-md border border-red-800/40">
                    Booked
                  </span>
                ) : (
                  <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/40">
                    Available
                  </span>
                )}

                <div className="w-10 h-10 rounded-xl bg-slate-900/60 flex items-center justify-center text-lg mt-1">
                  <FaChair className={isSelected ? 'text-white' : isReserved ? 'text-slate-600' : 'text-orange-400'} />
                </div>

                <div>
                  <h4 className="font-black text-sm">{tbl.name}</h4>
                  <p className="text-[11px] opacity-80 mt-0.5">{tbl.zone}</p>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-bold opacity-90">
                  <FaUsers size={11} /> {tbl.capacity} Seats
                </div>
              </button>
            );
          })}
        </div>

      </div>

      {/* Selected Table Summary Banner */}
      {selectedTable ? (
        <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500 text-white font-black flex items-center justify-center text-base">
              {selectedTable.id}
            </div>
            <div>
              <p className="font-extrabold text-gray-900 dark:text-white text-sm">
                Selected: {selectedTable.name} ({selectedTable.zone})
              </p>
              <p className="text-gray-500 dark:text-gray-400 mt-0.5">
                Seats up to {selectedTable.capacity} Guests • Tier: <span className="font-bold text-orange-600">{selectedTable.price}</span>
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-orange-500 text-white font-bold rounded-xl shadow-xs">
            Locked
          </span>
        </div>
      ) : (
        <p className="text-xs text-center text-gray-400 italic">
          👆 Please tap any available table box above to pick your preferred seating spot.
        </p>
      )}

    </div>
  );
}

export default InteractiveSeatingMap;
