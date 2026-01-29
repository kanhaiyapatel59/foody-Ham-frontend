import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    // Navigation
    home: 'Home',
    menu: 'Menu',
    cart: 'Cart',
    orders: 'Orders',
    profile: 'Profile',
    login: 'Login',
    logout: 'Logout',
    about: 'About',
    contact: 'Contact',
    
    // Common
    search: 'Search',
    addToCart: 'Add to Cart',
    price: 'Price',
    total: 'Total',
    subtotal: 'Subtotal',
    tax: 'Tax',
    delivery: 'Delivery',
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    
    // Menu
    allCategories: 'All Categories',
    searchPlaceholder: 'Search dishes by name, description, or ingredients...',
    noResults: 'No Results Found',
    clearFilters: 'Clear Filters',
    filters: 'Filters',
    sortBy: 'Sort By',
    
    // Cart
    emptyCart: 'Your cart is empty',
    checkout: 'Checkout',
    remove: 'Remove',
    quantity: 'Quantity',
    
    // Orders
    orderHistory: 'Order History',
    orderStatus: 'Order Status',
    reorder: 'Reorder',
    
    // Profile
    myProfile: 'My Profile',
    myOrders: 'My Orders',
    wishlist: 'Wishlist',
    
    // Currency
    currency: '$',
    currencyCode: 'USD'
  },
  ne: {
    // Navigation
    home: 'घर',
    menu: 'मेनु',
    cart: 'कार्ट',
    orders: 'अर्डरहरू',
    profile: 'प्रोफाइल',
    login: 'लगइन',
    logout: 'लगआउट',
    about: 'बारेमा',
    contact: 'सम्पर्क',
    
    // Common
    search: 'खोज्नुहोस्',
    addToCart: 'कार्टमा थप्नुहोस्',
    price: 'मूल्य',
    total: 'जम्मा',
    subtotal: 'उप-जम्मा',
    tax: 'कर',
    delivery: 'डेलिभरी',
    loading: 'लोड हुँदै...',
    save: 'सेभ गर्नुहोस्',
    cancel: 'रद्द गर्नुहोस्',
    edit: 'सम्पादन गर्नुहोस्',
    delete: 'मेटाउनुहोस्',
    
    // Menu
    allCategories: 'सबै श्रेणीहरू',
    searchPlaceholder: 'नाम, विवरण वा सामग्रीहरूद्वारा खानाहरू खोज्नुहोस्...',
    noResults: 'कुनै परिणाम फेला परेन',
    clearFilters: 'फिल्टरहरू सफा गर्नुहोस्',
    filters: 'फिल्टरहरू',
    sortBy: 'क्रमबद्ध गर्नुहोस्',
    
    // Cart
    emptyCart: 'तपाईंको कार्ट खाली छ',
    checkout: 'चेकआउट',
    remove: 'हटाउनुहोस्',
    quantity: 'मात्रा',
    
    // Orders
    orderHistory: 'अर्डर इतिहास',
    orderStatus: 'अर्डर स्थिति',
    reorder: 'पुनः अर्डर गर्नुहोस्',
    
    // Profile
    myProfile: 'मेरो प्रोफाइल',
    myOrders: 'मेरा अर्डरहरू',
    wishlist: 'इच्छा सूची',
    
    // Currency
    currency: '$',
    currencyCode: 'USD'
  },
  hi: {
    // Navigation
    home: 'होम',
    menu: 'मेन्यू',
    cart: 'कार्ट',
    orders: 'ऑर्डर',
    profile: 'प्रोफाइल',
    login: 'लॉगिन',
    logout: 'लॉगआउट',
    about: 'के बारे में',
    contact: 'संपर्क',
    
    // Common
    search: 'खोजें',
    addToCart: 'कार्ट में जोड़ें',
    price: 'कीमत',
    total: 'कुल',
    subtotal: 'उप-योग',
    tax: 'कर',
    delivery: 'डिलीवरी',
    loading: 'लोड हो रहा है...',
    save: 'सेव करें',
    cancel: 'रद्द करें',
    edit: 'संपादित करें',
    delete: 'हटाएं',
    
    // Menu
    allCategories: 'सभी श्रेणियां',
    searchPlaceholder: 'नाम, विवरण या सामग्री द्वारा व्यंजन खोजें...',
    noResults: 'कोई परिणाम नहीं मिला',
    clearFilters: 'फिल्टर साफ़ करें',
    filters: 'फिल्टर',
    sortBy: 'क्रमबद्ध करें',
    
    // Cart
    emptyCart: 'आपका कार्ट खाली है',
    checkout: 'चेकआउट',
    remove: 'हटाएं',
    quantity: 'मात्रा',
    
    // Orders
    orderHistory: 'ऑर्डर इतिहास',
    orderStatus: 'ऑर्डर स्थिति',
    reorder: 'फिर से ऑर्डर करें',
    
    // Profile
    myProfile: 'मेरी प्रोफाइल',
    myOrders: 'मेरे ऑर्डर',
    wishlist: 'विशलिस्ट',
    
    // Currency
    currency: '$',
    currencyCode: 'USD'
  },
  ta: {
    // Navigation
    home: 'முகப்பு',
    menu: 'மெனு',
    cart: 'கார்ட்',
    orders: 'ஆர்டர்கள்',
    profile: 'சுயவிவரம்',
    login: 'உள்நுழைவு',
    logout: 'வெளியேறு',
    about: 'பற்றி',
    contact: 'தொடர்பு',
    
    // Common
    search: 'தேடு',
    addToCart: 'கார்ட்டில் சேர்',
    price: 'விலை',
    total: 'மொத்தம்',
    subtotal: 'துணை மொத்தம்',
    tax: 'வரி',
    delivery: 'டெலிவரி',
    loading: 'ஏற்றுகிறது...',
    save: 'சேமி',
    cancel: 'ரத்து செய்',
    edit: 'திருத்து',
    delete: 'நீக்கு',
    
    // Menu
    allCategories: 'அனைத்து வகைகள்',
    searchPlaceholder: 'பெயர், விளக்கம் அல்லது பொருட்களால் உணவுகளைத் தேடுங்கள்...',
    noResults: 'முடிவுகள் எதுவும் கிடைக்கவில்லை',
    clearFilters: 'வடிப்பான்களை அழி',
    filters: 'வடிப்பான்கள்',
    sortBy: 'வரிசைப்படுத்து',
    
    // Cart
    emptyCart: 'உங்கள் கார்ட் காலியாக உள்ளது',
    checkout: 'செக்அவுட்',
    remove: 'அகற்று',
    quantity: 'அளவு',
    
    // Orders
    orderHistory: 'ஆர்டர் வரலாறு',
    orderStatus: 'ஆர்டர் நிலை',
    reorder: 'மீண்டும் ஆர்டர் செய்',
    
    // Profile
    myProfile: 'என் சுயவிவரம்',
    myOrders: 'என் ஆர்டர்கள்',
    wishlist: 'விஷ்லிஸ்ட்',
    
    // Currency
    currency: '$',
    currencyCode: 'USD'
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key) => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  const formatCurrency = (amount) => {
    const currency = translations[language].currency;
    return `${currency}${amount.toFixed(2)}`;
  };

  return (
    <LanguageContext.Provider value={{
      language,
      changeLanguage,
      t,
      formatCurrency,
      availableLanguages: [
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'ne', name: 'नेपाली', flag: '🇳🇵' },
        { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
        { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' }
      ]
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};