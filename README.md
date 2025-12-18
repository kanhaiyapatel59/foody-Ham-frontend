# 🍔 Foody-Ham - Restaurant Food Ordering Website

A comprehensive full-stack restaurant food ordering platform built with modern web technologies. This project provides a complete solution for restaurants to manage their online presence, orders, and customer interactions.

## 🚀 Tech Stack

### Frontend
- **React.js** with Vite for fast development
- **Tailwind CSS** for responsive styling
- **React Router** for navigation
- **React Context API** for state management
- **Axios** for API communication
- **Swiper.js** for carousels
- **React Icons** for UI icons

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Firebase Admin SDK** for additional auth options
- **bcryptjs** for password hashing
- **CORS** for cross-origin requests

## ✨ Features Implemented

### 🔐 Authentication & User Management
- User registration and login system
- JWT-based authentication with 30-day token expiration
- Role-based access control (Admin/User)
- Google authentication integration (configured)
- Comprehensive user profiles with image upload
- User preferences and dietary restrictions
- Address management system

### 🍕 Product Management
- Complete CRUD operations for food items
- Multi-category product system (burgers, pizza, salads, desserts, etc.)
- Advanced search and filtering capabilities
- Price range and ingredient-based filtering
- Multiple sorting options (newest, price, name, featured)
- Stock management with low stock alerts
- Detailed nutritional information tracking
- Product ratings and reviews system

### 🛒 Shopping Experience
- Smart shopping cart with localStorage fallback
- Wishlist/favorites functionality with backend sync
- Recently viewed products tracking
- Comprehensive product reviews and ratings
- Social sharing capabilities for favorite items
- Advanced search with multiple filter combinations

### 📦 Order Management
- Complete order processing workflow
- Real-time order status tracking (pending → preparing → ready → delivered)
- Comprehensive order history for users
- Admin order management dashboard
- Multiple payment methods (card, PayPal, cash on delivery)
- Order analytics and reporting

### 👨‍💼 Admin Features
- Comprehensive admin dashboard with side navigation
- Product management interface with tabbed forms
- Sales analytics and reporting dashboard
- Coupon/discount code management system
- Order management with status update capabilities
- User management and role assignment

### 🎨 UI/UX Enhancements
- Fully responsive design for all devices
- Modern dark theme for menu pages
- Smooth Swiper carousels for featured products
- Elegant side navigation panels for admin/user menus
- Loading states and comprehensive error handling
- Smooth animations and transitions throughout
- Professional gradient designs and modern layouts

### 🔧 Additional Features
- Customer feedback system
- Contact page with form validation
- About page with company information
- Error boundaries for graceful error handling
- Database cleanup utilities and scripts
- Environment-based configuration
- Comprehensive API error handling

### 🍽️ Table Reservation System
- Complete table booking functionality
- Date and time slot selection
- Party size management
- Special requests handling
- Admin reservation management dashboard
- Reservation status tracking (pending, confirmed, completed, cancelled)
- Email notifications for booking confirmations

### 📊 Food Diary & Nutrition Tracker
- Personal food diary for tracking daily meals
- Nutritional information logging
- Calorie and macro tracking
- Daily, weekly, and monthly nutrition reports
- Goal setting for dietary objectives
- Integration with ordered food items
- Visual charts and progress tracking

### 👥 Group Ordering System
- Create and manage group orders
- Invite multiple participants to join orders
- Individual item selection within group orders
- Split payment options
- Group order coordination and management
- Real-time collaboration features
- Order summary and participant tracking

### 🎯 Promotional Campaign Manager
- Advanced promotion creation and management
- Multiple campaign types (percentage discounts, fixed amounts, BOGO offers, flash sales)
- Time-based promotion activation and expiration
- Usage limits and tracking
- LED-style scrolling banner display on homepage
- Real-time countdown timers
- Campaign performance analytics
- Admin dashboard for promotion management

## 📁 Project Structure

```
food_website/
├── frontend/Foody-Ham/          # React frontend application
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/              # Page components
│   │   ├── context/            # React Context providers
│   │   └── assets/             # Static assets
│   └── public/                 # Public assets
├── backend/                    # Node.js backend application
│   ├── src/
│   │   ├── controllers/        # Route controllers
│   │   ├── models/            # MongoDB models
│   │   ├── routes/            # API routes
│   │   ├── middleware/        # Custom middleware
│   │   ├── config/            # Configuration files
│   │   └── utils/             # Utility functions
│   └── scripts/               # Database utility scripts
```

## 🗄️ Database Schema

### Core Models
- **Users**: Authentication, profiles, preferences, addresses
- **Products**: Food items with nutrition, ratings, stock management
- **Orders**: Order processing with status tracking and history
- **Cart**: Shopping cart with user synchronization
- **Wishlist**: Favorites with backend synchronization
- **Reviews**: Community reviews with ratings and replies
- **Coupons**: Discount codes with usage tracking and analytics
- **Analytics**: Sales data and business intelligence
- **Reservations**: Table booking system with date/time management
- **FoodDiary**: Personal nutrition tracking and meal logging
- **GroupOrders**: Collaborative ordering system for multiple users
- **Promotions**: Campaign management with time-based activation

## 🚦 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd food_website
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env  # Configure your environment variables
   npm start
   ```

3. **Frontend Setup**
   ```bash
   cd Foody-Ham
   npm install
   cp .env.example .env  # Configure your environment variables
   npm run dev
   ```

### Environment Variables

**Backend (.env)**
```
PORT=3005
MONGO_URI=mongodb://localhost:27017/Foody_Ham
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
ADMIN_EMAIL=admin@foodyham.com
ADMIN_PASSWORD=admin123
```

**Frontend (.env)**
```
VITE_API_BASE_URL=http://localhost:3005/api
VITE_NODE_ENV=development
```

## 🎯 Key Features Highlights

### For Customers
- Browse extensive food menu with advanced filtering
- Add items to cart and wishlist
- Track order status in real-time
- Leave reviews and ratings
- Manage profile and preferences
- Apply discount coupons
- Book table reservations with date/time selection
- Track daily nutrition with food diary
- Create and participate in group orders
- View promotional offers with countdown timers

### For Administrators
- Comprehensive dashboard with analytics
- Manage products, orders, and users
- Create and manage discount coupons
- View sales reports and trends
- Update order statuses
- Monitor customer feedback
- Manage table reservations and availability
- Monitor group orders and coordination
- Create and manage promotional campaigns
- Track campaign performance and analytics

## 🔒 Security Features
- JWT token-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Error handling without sensitive data exposure
- Role-based access control

## 📱 Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interfaces
- Optimized loading for all devices

## 🚀 Performance Optimizations
- Lazy loading for images
- Efficient state management
- Optimized database queries
- Compressed assets
- Smart caching strategies

## 🛠️ Development Tools
- Hot Module Replacement (HMR) with Vite
- ESLint for code quality
- Prettier for code formatting
- MongoDB Compass for database management
- Postman for API testing

## 📈 Future Enhancements
- Real-time notifications with WebSocket
- AI-powered food recommendations
- Mobile app development (React Native)
- Advanced analytics and reporting
- Integration with third-party delivery services
- Multi-language support
- Progressive Web App (PWA) features
- SMS notifications for reservations and orders
- Integration with fitness tracking apps
- Advanced group ordering features with chat
- Geolocation-based promotions
- Loyalty program integration

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
This project is licensed under the MIT License.

## 👨‍💻 Developer
Built with ❤️ by [Your Name]

---

**Foody-Ham** - Where food meets technology for an exceptional dining experience! 🍽️✨
