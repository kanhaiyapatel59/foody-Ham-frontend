import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [newReservation, setNewReservation] = useState({
    date: '',
    time: '',
    partySize: 2,
    specialOccasion: '',
    specialRequests: '',
    contactPhone: ''
  });

  const timeSlots = [
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'
  ];

  const occasions = [
    'Birthday', 'Anniversary', 'Date Night', 'Business Meeting', 
    'Family Gathering', 'Celebration', 'Other'
  ];

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/reservations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReservations(response.data.data);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const createReservation = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/reservations`, newReservation, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowBookingModal(false);
      setNewReservation({
        date: '', time: '', partySize: 2, specialOccasion: '', specialRequests: '', contactPhone: ''
      });
      fetchReservations();
    } catch (error) {
      console.error('Error creating reservation:', error);
      alert('Failed to create reservation');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
    </div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Table Reservations</h1>
        <button
          onClick={() => setShowBookingModal(true)}
          className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
        >
          Book a Table
        </button>
      </div>

      <div className="grid gap-6">
        {reservations.map((reservation) => (
          <div key={reservation._id} className="bg-white rounded-lg shadow-md p-6 border">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {new Date(reservation.date).toLocaleDateString()} at {reservation.time}
                </h3>
                <p className="text-gray-600">Party of {reservation.partySize}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(reservation.status)}`}>
                {reservation.status}
              </span>
            </div>
            
            {reservation.specialOccasion && (
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Occasion:</span> {reservation.specialOccasion}
              </p>
            )}
            
            {reservation.specialRequests && (
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Special Requests:</span> {reservation.specialRequests}
              </p>
            )}
            
            {reservation.tableNumber && (
              <p className="text-gray-600">
                <span className="font-medium">Table:</span> {reservation.tableNumber}
              </p>
            )}
          </div>
        ))}
      </div>

      {reservations.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No reservations found</p>
          <p className="text-gray-400">Book your first table to get started!</p>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Book a Table</h2>
            <form onSubmit={createReservation}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Date</label>
                  <input
                    type="date"
                    value={newReservation.date}
                    onChange={(e) => setNewReservation({...newReservation, date: e.target.value})}
                    className="w-full p-3 border rounded-lg"
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Time</label>
                  <select
                    value={newReservation.time}
                    onChange={(e) => setNewReservation({...newReservation, time: e.target.value})}
                    className="w-full p-3 border rounded-lg"
                    required
                  >
                    <option value="">Select time</option>
                    {timeSlots.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Party Size</label>
                  <select
                    value={newReservation.partySize}
                    onChange={(e) => setNewReservation({...newReservation, partySize: parseInt(e.target.value)})}
                    className="w-full p-3 border rounded-lg"
                  >
                    {[...Array(20)].map((_, i) => (
                      <option key={i+1} value={i+1}>{i+1} {i === 0 ? 'person' : 'people'}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Special Occasion (Optional)</label>
                  <select
                    value={newReservation.specialOccasion}
                    onChange={(e) => setNewReservation({...newReservation, specialOccasion: e.target.value})}
                    className="w-full p-3 border rounded-lg"
                  >
                    <option value="">Select occasion</option>
                    {occasions.map(occasion => (
                      <option key={occasion} value={occasion}>{occasion}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Contact Phone</label>
                  <input
                    type="tel"
                    value={newReservation.contactPhone}
                    onChange={(e) => setNewReservation({...newReservation, contactPhone: e.target.value})}
                    className="w-full p-3 border rounded-lg"
                    placeholder="Your phone number"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Special Requests (Optional)</label>
                  <textarea
                    value={newReservation.specialRequests}
                    onChange={(e) => setNewReservation({...newReservation, specialRequests: e.target.value})}
                    className="w-full p-3 border rounded-lg h-20"
                    placeholder="Any special requests or dietary requirements..."
                  />
                </div>
              </div>
              
              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                >
                  Book Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationsPage;