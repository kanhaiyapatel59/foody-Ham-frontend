import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaSave, FaLock, FaCalendar, FaUserShield, FaCamera, FaHeart, FaStar, FaBell } from 'react-icons/fa';

function ProfilePage() {
  const { user, updateProfile, changePassword, loading: authLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
    dateOfBirth: '',
    dietaryRestrictions: [],
    favoriteCategories: []
  });
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Initialize form data when user loads
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: typeof user.address === 'string' ? user.address : '',
        bio: user.bio || '',
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
        dietaryRestrictions: user.preferences?.dietaryRestrictions || [],
        favoriteCategories: user.preferences?.favoriteCategories || []
      });
      setImagePreview(user.profileImage || '');
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setMessage('');
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
    setError('');
    setMessage('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleArrayChange = (field, value, checked) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      // Prepare data with proper structure
      const profileData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        bio: formData.bio,
        dateOfBirth: formData.dateOfBirth,
        dietaryRestrictions: formData.dietaryRestrictions,
        favoriteCategories: formData.favoriteCategories
      };
      
      await updateProfile(profileData);
      setMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password length
    if (passwordData.newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      setMessage('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setIsChangingPassword(false);
    } catch (err) {
      setError(err.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="text-lg text-gray-600">Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Please Login</h1>
        <p className="text-gray-600 mb-8">You need to be logged in to view your profile.</p>
      </div>
    );
  }

  // Format date from backend (handle both createdAt and created_at)
  const getMemberSince = () => {
    const date = user.createdAt || user.created_at;
    if (date) {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    return 'N/A';
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
          {!isEditing && !isChangingPassword && !loading && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition flex items-center gap-2 disabled:opacity-50"
              disabled={loading}
            >
              <FaEdit /> Edit Profile
            </button>
          )}
        </div>

        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Profile Information */}
        {!isEditing && !isChangingPassword ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-6">
                <div className="relative">
                  {user.profileImage || imagePreview ? (
                    <img 
                      src={imagePreview || user.profileImage} 
                      alt="Profile" 
                      className="w-20 h-20 rounded-full object-cover border-4 border-orange-100"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
                      {user.isAdmin ? (
                        <FaUserShield className="text-3xl text-orange-500" />
                      ) : (
                        <FaUser className="text-3xl text-orange-500" />
                      )}
                    </div>
                  )}
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 bg-orange-500 text-white p-1 rounded-full cursor-pointer hover:bg-orange-600">
                      <FaCamera className="text-xs" />
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleImageChange}
                      />
                    </label>
                  )}
                </div>
                <div className="ml-4">
                  <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
                  <p className="text-gray-600">{user.email}</p>
                  {user.isAdmin && (
                    <span className="inline-block mt-2 bg-orange-500 text-white text-sm px-3 py-1 rounded">
                      Administrator
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <FaEnvelope className="text-gray-400 mr-3" />
                  <div>
                    <div className="text-sm text-gray-500">Email</div>
                    <div className="font-medium">{user.email}</div>
                  </div>
                </div>

                {user.phone && (
                  <div className="flex items-center">
                    <FaPhone className="text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm text-gray-500">Phone</div>
                      <div className="font-medium">{user.phone}</div>
                    </div>
                  </div>
                )}

                {(user.address || (typeof user.address === 'object' && user.address.street)) && (
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm text-gray-500">Address</div>
                      <div className="font-medium">
                        {typeof user.address === 'string' ? user.address : 
                         `${user.address?.street || ''} ${user.address?.city || ''} ${user.address?.state || ''}`}
                      </div>
                    </div>
                  </div>
                )}

                {user.bio && (
                  <div className="flex items-start">
                    <FaUser className="text-gray-400 mr-3 mt-1" />
                    <div>
                      <div className="text-sm text-gray-500">Bio</div>
                      <div className="font-medium">{user.bio}</div>
                    </div>
                  </div>
                )}

                <div className="flex items-center">
                  <FaCalendar className="text-gray-400 mr-3" />
                  <div>
                    <div className="text-sm text-gray-500">Member Since</div>
                    <div className="font-medium">{getMemberSince()}</div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => setIsChangingPassword(true)}
                    className="text-orange-500 hover:text-orange-600 flex items-center gap-2 disabled:opacity-50"
                    disabled={loading}
                  >
                    <FaLock /> Change Password
                  </button>
                </div>
              </div>
            </div>

            {/* Account Info & Preferences */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Account & Preferences</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Account Type</h4>
                  <p className="text-gray-600">
                    {user.isAdmin ? 'Administrator Account' : 'Regular User Account'}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">User ID</h4>
                  <p className="text-gray-600 text-sm font-mono break-all">
                    {user._id || user.id || 'N/A'}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Account Status</h4>
                  <span className="inline-block bg-green-100 text-green-800 text-sm px-3 py-1 rounded">
                    Active
                  </span>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Role</h4>
                  <p className="text-gray-600 capitalize">
                    {user.role || 'user'}
                  </p>
                </div>

                {user.preferences?.dietaryRestrictions?.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Dietary Restrictions</h4>
                    <div className="flex flex-wrap gap-2">
                      {user.preferences.dietaryRestrictions.map((restriction, index) => (
                        <span key={index} className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                          {restriction}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {user.preferences?.favoriteCategories?.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Favorite Categories</h4>
                    <div className="flex flex-wrap gap-2">
                      {user.preferences.favoriteCategories.map((category, index) => (
                        <span key={index} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : isEditing ? (
          /* Edit Profile Form */
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Profile</h2>
            
            <form onSubmit={handleSaveProfile}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-700 mb-2">Full Name *</label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full pl-10 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Email *</label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Phone Number</label>
                  <div className="relative">
                    <FaPhone className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-10 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Address</label>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full pl-10 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Tell us about yourself..."
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-700 mb-2">Dietary Restrictions</label>
                  <div className="space-y-2">
                    {['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 'Halal', 'Kosher'].map(restriction => (
                      <label key={restriction} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.dietaryRestrictions.includes(restriction)}
                          onChange={(e) => handleArrayChange('dietaryRestrictions', restriction, e.target.checked)}
                          className="mr-2"
                          disabled={loading}
                        />
                        <span className="text-sm">{restriction}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Favorite Categories</label>
                  <div className="space-y-2">
                    {['burgers', 'pizza', 'pasta', 'salads', 'desserts', 'seafood', 'chicken'].map(category => (
                      <label key={category} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.favoriteCategories.includes(category)}
                          onChange={(e) => handleArrayChange('favoriteCategories', category, e.target.checked)}
                          className="mr-2"
                          disabled={loading}
                        />
                        <span className="text-sm capitalize">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition disabled:opacity-50"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 transition flex items-center gap-2 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave /> Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Change Password Form */
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Change Password</h2>
            
            <form onSubmit={handleChangePassword}>
              <div className="space-y-6 mb-6">
                <div>
                  <label className="block text-gray-700 mb-2">Current Password *</label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full pl-10 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">New Password *</label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full pl-10 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                      disabled={loading}
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Must be at least 6 characters long</p>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Confirm New Password *</label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full pl-10 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsChangingPassword(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition disabled:opacity-50"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 transition flex items-center gap-2 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <FaLock /> Change Password
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;