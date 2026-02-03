import React, { createContext, useContext, useState, useEffect } from 'react';

const ChatContext = createContext();

const FAQ_RESPONSES = {
 
  'order': 'To place an order: 1) Browse our Menu, 2) Add items to Cart, 3) Click Checkout, 4) Enter delivery details, 5) Make payment. Orders typically take 20-45 minutes for delivery.',
  'how to order': 'To place an order: 1) Browse our Menu, 2) Add items to Cart, 3) Click Checkout, 4) Enter delivery details, 5) Make payment. It\'s that simple!',
  'place order': 'To place an order: 1) Browse our Menu, 2) Add items to Cart, 3) Click Checkout, 4) Enter delivery details, 5) Make payment.',
  'ordering': 'To place an order: 1) Browse our Menu, 2) Add items to Cart, 3) Click Checkout, 4) Enter delivery details, 5) Make payment.',
  
 
  'order status': 'You can check your order status in the "Orders" section of your profile. Orders typically take 20-45 minutes for delivery.',
  'track order': 'You can track your order in the "Orders" section of your profile. You\'ll see real-time updates on preparation and delivery.',
  'where is my order': 'You can check your order status in the "Orders" section of your profile. Orders typically take 20-45 minutes for delivery.',
  
  // Delivery
  'delivery time': 'Our standard delivery time is 20-45 minutes depending on your location and order complexity.',
  'delivery': 'Our standard delivery time is 20-45 minutes depending on your location and order complexity. We deliver to most areas within 10km.',
  'how long': 'Our standard delivery time is 20-45 minutes depending on your location and order complexity.',
  'fast delivery': 'Our standard delivery time is 20-45 minutes. For faster service, try our premium delivery option!',
  
  // Payment
  'payment': 'We accept all major credit cards, PayPal, and cash on delivery.',
  'payment methods': 'We accept all major credit cards, PayPal, and cash on delivery.',
  'pay': 'We accept all major credit cards, PayPal, and cash on delivery.',
  'credit card': 'Yes, we accept all major credit cards including Visa, MasterCard, and American Express.',
  
  // Cancellation and refunds
  'cancel': 'You can cancel your order within 5 minutes of placing it. After that, please contact our support team.',
  'cancel order': 'You can cancel your order within 5 minutes of placing it. After that, please contact our support team.',
  'refund': 'Refunds are processed within 3-5 business days to your original payment method.',
  
  // Menu and food
  'menu': 'You can browse our full menu on the Menu page. We offer burgers, pizza, pasta, salads, and more!',
  'food': 'You can browse our full menu on the Menu page. We offer burgers, pizza, pasta, salads, and more!',
  'what do you have': 'We offer a variety of delicious options including burgers, pizza, pasta, salads, desserts, and beverages. Check our Menu page!',
  'dishes': 'We offer a variety of delicious options including burgers, pizza, pasta, salads, desserts, and beverages. Check our Menu page!',
  
  // Allergies and dietary
  'allergies': 'Please check the ingredients list for each item. Contact us directly for specific allergy concerns.',
  'vegetarian': 'Yes, we have many vegetarian options! Use the dietary filter on our Menu page to find vegetarian dishes.',
  'vegan': 'Yes, we have vegan options available! Use the dietary filter on our Menu page to find vegan dishes.',
  'gluten free': 'We have gluten-free options available. Please check individual item descriptions or contact us for details.',
  
  // Location and delivery area
  'location': 'We deliver to most areas within 10km of our restaurant. Enter your address at checkout to confirm delivery availability.',
  'delivery area': 'We deliver to most areas within 10km of our restaurant. Enter your address at checkout to confirm delivery availability.',
  'do you deliver': 'Yes! We deliver to most areas within 10km. Enter your address at checkout to confirm delivery availability.',
  
  // Hours and availability
  'hours': 'We are open daily from 10:00 AM to 11:00 PM.',
  'open': 'We are open daily from 10:00 AM to 11:00 PM.',
  'closed': 'We are open daily from 10:00 AM to 11:00 PM. We\'re currently open!',
  'timing': 'We are open daily from 10:00 AM to 11:00 PM.',
  
  // Contact and support
  'contact': 'You can reach us at support@foodyham.com or through this chat system.',
  'help': 'I\'m here to help! You can ask me about orders, delivery, menu, payments, or anything else.',
  'support': 'You can reach us at support@foodyham.com or through this chat system for any assistance.',
  
  // Greetings
  'hi': 'Hello! Welcome to Foody-Ham! How can I help you today? You can ask me about our menu, placing orders, delivery, or anything else!',
  'hello': 'Hello! Welcome to Foody-Ham! How can I help you today? You can ask me about our menu, placing orders, delivery, or anything else!',
  'hey': 'Hey there! Welcome to Foody-Ham! How can I help you today?',
  
  // Pricing
  'price': 'Our menu items range from $8-35. You can see exact prices on our Menu page. We also offer combo deals and discounts!',
  'cost': 'Our menu items range from $8-35. You can see exact prices on our Menu page. We also offer combo deals and discounts!',
  'expensive': 'We offer great value for quality food! Our items range from $8-35 with frequent discounts and combo deals.',
  
  // Promotions
  'discount': 'We regularly offer discounts and promotions! Check our homepage for current deals, or sign up for our newsletter.',
  'offer': 'We regularly offer discounts and promotions! Check our homepage for current deals, or sign up for our newsletter.',
  'coupon': 'We have various coupon codes available! Check your profile for available coupons or our homepage for current promotions.'
};

export const ChatProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your virtual assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const findFAQResponse = (message) => {
    const lowerMessage = message.toLowerCase().trim();
    
    // Direct exact matches first
    if (FAQ_RESPONSES[lowerMessage]) {
      return FAQ_RESPONSES[lowerMessage];
    }
    
    // Partial matches - check if message contains any key phrases
    for (const [key, response] of Object.entries(FAQ_RESPONSES)) {
      if (lowerMessage.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerMessage)) {
        return response;
      }
    }
    
    // Additional keyword matching for common variations
    const keywords = {
      'order': ['buy', 'purchase', 'get food', 'ordering'],
      'delivery': ['deliver', 'shipping', 'send'],
      'payment': ['pay', 'money', 'card', 'cash'],
      'menu': ['food', 'eat', 'dish', 'meal'],
      'help': ['assist', 'support', 'question'],
      'time': ['when', 'how long', 'duration'],
      'location': ['address', 'area', 'where']
    };
    
    for (const [mainKey, variations] of Object.entries(keywords)) {
      if (variations.some(variation => lowerMessage.includes(variation))) {
        if (FAQ_RESPONSES[mainKey]) {
          return FAQ_RESPONSES[mainKey];
        }
      }
    }
    
    return null;
  };

  const sendMessage = (text) => {
    const userMessage = {
      id: Date.now(),
      text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate bot response delay
    setTimeout(() => {
      const faqResponse = findFAQResponse(text);
      const botResponse = {
        id: Date.now() + 1,
        text: faqResponse || "I'm here to help! You can ask me about:\n\n• How to place an order\n• Delivery time and areas\n• Payment methods\n• Menu items and prices\n• Order status and tracking\n• Cancellations and refunds\n\nWhat would you like to know?",
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);

      // If no FAQ match, suggest human agent after 2 seconds
      if (!faqResponse) {
        setTimeout(() => {
          const agentMessage = {
            id: Date.now() + 2,
            text: "If you need more specific help, I can connect you with a human agent. Just type 'agent' or 'human help'.",
            sender: 'bot',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, agentMessage]);
        }, 2000);
      }
    }, 1000);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        text: "Hello! I'm your virtual assistant. How can I help you today?",
        sender: 'bot',
        timestamp: new Date()
      }
    ]);
  };

  return (
    <ChatContext.Provider value={{
      isOpen,
      setIsOpen,
      messages,
      sendMessage,
      clearChat,
      isTyping
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};