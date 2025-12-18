import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';
import WishlistButton from '../components/WishlistButton';
import StarRating from '../components/StarRating';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';
import SocialShare from '../components/SocialShare';
import axios from 'axios';
import { FaStar, FaRegStar, FaComment } from 'react-icons/fa';
import { Share2 } from 'lucide-react';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
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

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();
  const { user } = useAuth();
  
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showSocialShare, setShowSocialShare] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const { addToRecentlyViewed } = useRecentlyViewed();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (food && food.category) {
      fetchRelatedProducts(food.category, food.id);
    }
  }, [food?.category, food?.id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError('');

      // If product is passed via state (from menu click), use it
      if (location.state?.product) {
        setFood(location.state.product);
        setLoading(false);
        return;
      }

      // Otherwise fetch from API
      const response = await api.get(`/products/${id}`);
      
      if (response.data.success) {
        const productData = response.data.data;
        
        // Transform data to match expected format
        const formattedProduct = {
          id: productData._id || productData.id,
          name: productData.name,
          image: productData.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop',
          description: productData.description,
          fullDescription: productData.fullDescription || productData.description,
          price: productData.price,
          ingredients: productData.ingredients || ['Fresh ingredients'],
          nutritionalInfo: productData.nutritionalInfo || {
            calories: 0,
            protein: "0g",
            carbs: "0g",
            fat: "0g"
          },
          category: productData.category
        };

        setFood(formattedProduct);
        
        // Add to recently viewed
        addToRecentlyViewed(formattedProduct);
        

      } else {
        setError('Product not found');
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      
      // Fallback: Check for custom product in localStorage
      if (id && id.startsWith('custom-')) {
        const customId = id.replace('custom-', '');
        const customProducts = JSON.parse(localStorage.getItem('customProducts') || '[]');
        const customProduct = customProducts.find(p => p.id.toString() === customId);
        
        if (customProduct) {
          setFood(customProduct);
          addToRecentlyViewed(customProduct);
        } else {
          setError('Product not found');
        }
      } else {
        setError(err.response?.data?.message || 'Failed to load product');
      }
    } finally {
      setLoading(false);
    }
  };



  const fetchRelatedProducts = async (category, currentProductId) => {
    try {
      console.log('Fetching related products for category:', category);
      const response = await api.get(`/products?category=${category}&limit=8`);
      if (response.data.success) {
        console.log('Related products response:', response.data.data);
        const filtered = response.data.data
          .filter(product => product._id !== currentProductId)
          .slice(0, 4)
          .map(product => ({
            id: product._id,
            name: product.name,
            image: product.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop',
            price: product.price,
            category: product.category
          }));
        console.log('Filtered related products:', filtered);
        setRelatedProducts(filtered);
      }
    } catch (error) {
      console.error('Error fetching related products:', error);
    }
  };

  const handleReviewSubmit = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3005/api/reviews', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        setShowReviewForm(false);
        // Refresh reviews by re-rendering ReviewList component
        window.location.reload();
      } else {
        alert('Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review');
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      alert('Please login to add items to cart');
      navigate('/login', { state: { from: location } });
      return;
    }
    
    const cartProduct = {
      id: food.id,
      name: food.name,
      image: food.image,
      description: food.description,
      price: typeof food.price === 'string' ? parseFloat(food.price) : food.price
    };
    
    addToCart(cartProduct, 1);
    alert(`${food.name} has been added to your cart!`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading product details...</div>
        </div>
      </div>
    );
  }

  if (error || !food) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Product not found</h1>
        <p className="text-gray-600 mb-6">{error || 'The product you are looking for does not exist.'}</p>
        <button 
          onClick={() => navigate('/menu')}
          className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 transition"
        >
          Back to Menu
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      <div className="container mx-auto px-4 py-12">
      <button 
        onClick={() => navigate(-1)}
        className="text-orange-500 hover:text-orange-600 mb-6 flex items-center"
      >
        ← Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div>
          <img 
            src={food.image} 
            alt={food.name} 
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>

        {/* Product Details */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{food.name}</h1>
          <p className="text-gray-600 text-lg mb-6">{food.description}</p>
          
          {food.fullDescription && food.fullDescription !== food.description && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Full Description</h2>
              <p className="text-gray-700">{food.fullDescription}</p>
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Ingredients</h2>
            <ul className="list-disc list-inside text-gray-700">
              {Array.isArray(food.ingredients) ? 
                food.ingredients.map((ingredient, index) => (
                  <li key={index} className="mb-1">{ingredient}</li>
                )) : 
                <li>{food.ingredients}</li>
              }
            </ul>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Nutritional Information</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-100 p-4 rounded text-center">
                <div className="text-sm text-gray-600">Calories</div>
                <div className="text-xl font-bold text-gray-800">{food.nutritionalInfo?.calories || 0}</div>
              </div>
              <div className="bg-gray-100 p-4 rounded text-center">
                <div className="text-sm text-gray-600">Protein</div>
                <div className="text-xl font-bold text-gray-800">{food.nutritionalInfo?.protein || "0g"}</div>
              </div>
              <div className="bg-gray-100 p-4 rounded text-center">
                <div className="text-sm text-gray-600">Carbs</div>
                <div className="text-xl font-bold text-gray-800">{food.nutritionalInfo?.carbs || "0g"}</div>
              </div>
              <div className="bg-gray-100 p-4 rounded text-center">
                <div className="text-sm text-gray-600">Fat</div>
                <div className="text-xl font-bold text-gray-800">{food.nutritionalInfo?.fat || "0g"}</div>
              </div>
            </div>
          </div>

          {/* Rating Display */}
          {food.averageRating > 0 && (
            <div className="mb-6">
              <StarRating 
                rating={food.averageRating} 
                totalReviews={food.totalReviews} 
                size="lg" 
              />
            </div>
          )}

          <div className="flex items-center justify-between border-t pt-8">
            <div>
              <div className="text-3xl font-bold text-orange-500">
                ${typeof food.price === 'number' ? food.price.toFixed(2) : parseFloat(food.price).toFixed(2)}
              </div>
              <div className="text-gray-500">Price includes tax</div>
            </div>
            <div className="flex items-center gap-4">
              <WishlistButton product={food} className="text-2xl" />
              <button 
                onClick={() => setShowSocialShare(true)}
                className="bg-blue-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-300 flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
              <button 
                onClick={handleAddToCart}
                disabled={!user}
                className="bg-orange-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-orange-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                title={!user ? "Login to add to cart" : "Add to cart"}
              >
                {!user ? "Login to Add to Cart" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16 bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Reviews & Photos</h2>
          {user && (
            <button
              onClick={() => setShowReviewForm(true)}
              className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
            >
              <FaComment className="w-4 h-4" />
              <span>Write Review</span>
            </button>
          )}
        </div>
        
        <ReviewList productId={food.id} />
        
        {showReviewForm && (
          <ReviewForm
            productId={food.id}
            onSubmit={handleReviewSubmit}
            onClose={() => setShowReviewForm(false)}
          />
        )}
        
        {showSocialShare && (
          <SocialShare
            product={food}
            onClose={() => setShowSocialShare(false)}
          />
        )}
      </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">You might also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 transform"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">{product.name}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-orange-500 font-bold text-lg">
                        ${product.price.toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-500 capitalize">
                        {product.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetailPage;