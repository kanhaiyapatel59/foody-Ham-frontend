import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FoodDiaryPage = () => {
  const [diary, setDiary] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showAddFood, setShowAddFood] = useState(false);
  const [showGoals, setShowGoals] = useState(false);
  const [products, setProducts] = useState([]);
  const [newEntry, setNewEntry] = useState({
    productId: '',
    customFood: { name: '', calories: 0, protein: '0g', carbs: '0g', fat: '0g' },
    quantity: 1,
    mealType: 'breakfast',
    isCustom: false
  });

  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];

  useEffect(() => {
    fetchDiary();
    fetchProducts();
  }, [selectedDate]);

  const fetchDiary = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/food-diary?date=${selectedDate}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDiary(response.data.data);
    } catch (error) {
      console.error('Error fetching diary:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/products`);
      setProducts(response.data.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const addFoodEntry = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const entryData = {
        date: selectedDate,
        quantity: newEntry.quantity,
        mealType: newEntry.mealType
      };

      if (newEntry.isCustom) {
        entryData.customFood = newEntry.customFood;
      } else {
        entryData.productId = newEntry.productId;
      }

      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/food-diary/entry`, entryData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setShowAddFood(false);
      setNewEntry({
        productId: '', customFood: { name: '', calories: 0, protein: '0g', carbs: '0g', fat: '0g' },
        quantity: 1, mealType: 'breakfast', isCustom: false
      });
      fetchDiary();
    } catch (error) {
      console.error('Error adding food entry:', error);
    }
  };

  const updateGoals = async (goals) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/food-diary/goals`, {
        date: selectedDate,
        goals
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchDiary();
    } catch (error) {
      console.error('Error updating goals:', error);
    }
  };

  const getProgressPercentage = (current, goal) => {
    return Math.min((current / goal) * 100, 100);
  };

  const getEntriesByMeal = (mealType) => {
    return diary?.entries.filter(entry => entry.mealType === mealType) || [];
  };

  if (!diary) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
    </div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Food Diary</h1>
        <div className="flex gap-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          />
          <button
            onClick={() => setShowGoals(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Set Goals
          </button>
        </div>
      </div>

      {/* Daily Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {['calories', 'protein', 'carbs', 'fat'].map((nutrient) => {
          const current = diary.totalNutrition[nutrient];
          const goal = diary.dailyGoals[nutrient];
          const percentage = getProgressPercentage(current, goal);
          
          return (
            <div key={nutrient} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 capitalize mb-2">{nutrient}</h3>
              <div className="flex justify-between items-center mb-2">
                <span className="text-2xl font-bold text-orange-500">
                  {nutrient === 'calories' ? Math.round(current) : `${Math.round(current)}g`}
                </span>
                <span className="text-gray-500">
                  / {nutrient === 'calories' ? goal : `${goal}g`}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-1">{Math.round(percentage)}% of goal</p>
            </div>
          );
        })}
      </div>

      {/* Meals */}
      <div className="space-y-6">
        {mealTypes.map((mealType) => {
          const entries = getEntriesByMeal(mealType);
          
          return (
            <div key={mealType} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800 capitalize">{mealType}</h2>
                <button
                  onClick={() => {
                    setNewEntry({...newEntry, mealType});
                    setShowAddFood(true);
                  }}
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
                >
                  Add Food
                </button>
              </div>
              
              {entries.length === 0 ? (
                <p className="text-gray-500">No food logged for {mealType}</p>
              ) : (
                <div className="space-y-2">
                  {entries.map((entry, index) => {
                    const food = entry.product || entry.customFood;
                    const nutrition = entry.product?.nutritionalInfo || entry.customFood;
                    
                    return (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <div>
                          <span className="font-medium">{food.name}</span>
                          <span className="text-gray-500 ml-2">x{entry.quantity}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {Math.round((nutrition?.calories || 0) * entry.quantity)} cal
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Food Modal */}
      {showAddFood && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-2xl font-bold mb-4">Add Food</h2>
            <form onSubmit={addFoodEntry}>
              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      checked={newEntry.isCustom}
                      onChange={(e) => setNewEntry({...newEntry, isCustom: e.target.checked})}
                    />
                    Custom Food
                  </label>
                </div>

                {newEntry.isCustom ? (
                  <>
                    <input
                      type="text"
                      placeholder="Food name"
                      value={newEntry.customFood.name}
                      onChange={(e) => setNewEntry({
                        ...newEntry,
                        customFood: {...newEntry.customFood, name: e.target.value}
                      })}
                      className="w-full p-3 border rounded-lg"
                      required
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        placeholder="Calories"
                        value={newEntry.customFood.calories}
                        onChange={(e) => setNewEntry({
                          ...newEntry,
                          customFood: {...newEntry.customFood, calories: parseInt(e.target.value)}
                        })}
                        className="p-3 border rounded-lg"
                      />
                      <input
                        type="text"
                        placeholder="Protein (g)"
                        value={newEntry.customFood.protein}
                        onChange={(e) => setNewEntry({
                          ...newEntry,
                          customFood: {...newEntry.customFood, protein: e.target.value}
                        })}
                        className="p-3 border rounded-lg"
                      />
                    </div>
                  </>
                ) : (
                  <select
                    value={newEntry.productId}
                    onChange={(e) => setNewEntry({...newEntry, productId: e.target.value})}
                    className="w-full p-3 border rounded-lg"
                    required
                  >
                    <option value="">Select food</option>
                    {products.map((product) => (
                      <option key={product._id} value={product._id}>
                        {product.name} ({product.nutritionalInfo?.calories || 0} cal)
                      </option>
                    ))}
                  </select>
                )}

                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={newEntry.quantity}
                  onChange={(e) => setNewEntry({...newEntry, quantity: parseFloat(e.target.value)})}
                  className="w-full p-3 border rounded-lg"
                  placeholder="Quantity"
                  required
                />
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddFood(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                >
                  Add Food
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Goals Modal */}
      {showGoals && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-2xl font-bold mb-4">Set Daily Goals</h2>
            <div className="space-y-4">
              {['calories', 'protein', 'carbs', 'fat'].map((nutrient) => (
                <div key={nutrient}>
                  <label className="block text-sm font-medium mb-2 capitalize">{nutrient}</label>
                  <input
                    type="number"
                    value={diary.dailyGoals[nutrient]}
                    onChange={(e) => {
                      const newGoals = {...diary.dailyGoals, [nutrient]: parseInt(e.target.value)};
                      setDiary({...diary, dailyGoals: newGoals});
                    }}
                    className="w-full p-3 border rounded-lg"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setShowGoals(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  updateGoals(diary.dailyGoals);
                  setShowGoals(false);
                }}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Save Goals
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodDiaryPage;