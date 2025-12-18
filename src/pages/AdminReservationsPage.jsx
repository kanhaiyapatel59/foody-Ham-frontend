import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/reservations/admin/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReservations(response.data.data);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateReservationStatus = async (id, status, tableNumber = '') => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/reservations/${id}/status`, 
        { status, tableNumber }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchReservations();
    } catch (error) {
      console.error('Error updating reservation:', error);
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
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Manage Reservations</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Party Size</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Table</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {reservations.map((reservation) => (
              <tr key={reservation._id}>
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-gray-900">{reservation.user.name}</div>
                    <div className="text-sm text-gray-500">{reservation.contactPhone}</div>
                    {reservation.specialOccasion && (
                      <div className="text-sm text-blue-600">{reservation.specialOccasion}</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {new Date(reservation.date).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-500">{reservation.time}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {reservation.partySize} people
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                    {reservation.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {reservation.status === 'confirmed' ? (
                    <input
                      type="text"
                      value={reservation.tableNumber || ''}
                      onChange={(e) => updateReservationStatus(reservation._id, 'confirmed', e.target.value)}
                      className="w-20 p-1 border rounded text-sm"
                      placeholder="Table #"
                    />
                  ) : (
                    <span className="text-sm text-gray-500">{reservation.tableNumber || '-'}</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {reservation.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateReservationStatus(reservation._id, 'confirmed')}
                          className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => updateReservationStatus(reservation._id, 'cancelled')}
                          className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {reservation.status === 'confirmed' && (
                      <button
                        onClick={() => updateReservationStatus(reservation._id, 'completed')}
                        className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                      >
                        Complete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {reservations.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No reservations found</p>
        </div>
      )}
    </div>
  );
};

export default AdminReservationsPage;