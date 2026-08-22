import React, { useState, useRef, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { FaRobot, FaTimes, FaPaperPlane, FaShoppingBag, FaSparkles, FaFire, FaCheckCircle } from 'react-icons/fa';

function HamAIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "👋 Hi! I'm HamAI, your personal food concierge. What are you craving today? Tell me your budget or dietary preferences!",
      combos: []
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [addedToast, setAddedToast] = useState(null);
  const messagesEndRef = useRef(null);
  const { addToCart } = useCart();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isTyping, isOpen]);

  // AI Meal Knowledge Base
  const aiDatabase = [
    {
      id: '694245cf89fe278184ccbc1b',
      name: 'Margherita Pizza',
      price: 14.99,
      category: 'pizza',
      calories: '280 kcal',
      protein: '12g',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300',
      tags: ['vegetarian', 'dinner', 'popular', 'pizza', 'under 15']
    },
    {
      id: '694245cf89fe278184ccbc1a',
      name: 'Classic Beef Burger',
      price: 12.99,
      category: 'burgers',
      calories: '520 kcal',
      protein: '28g',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300',
      tags: ['beef', 'burger', 'popular', 'high protein', 'under 15']
    },
    {
      id: '694245cf89fe278184ccbc1e',
      name: 'Spicy Chicken Wings',
      price: 11.99,
      category: 'appetizers',
      calories: '380 kcal',
      protein: '24g',
      image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=300',
      tags: ['spicy', 'chicken', 'wings', 'high protein', 'under 15']
    },
    {
      id: '694245cf89fe278184ccbc1c',
      name: 'Caesar Salad',
      price: 9.99,
      category: 'salads',
      calories: '180 kcal',
      protein: '8g',
      image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300',
      tags: ['healthy', 'salad', 'low calorie', 'under 10', 'vegetarian']
    },
    {
      id: '694245cf89fe278184ccbc1d',
      name: 'Decadent Chocolate Cake',
      price: 6.99,
      category: 'desserts',
      calories: '420 kcal',
      protein: '6g',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300',
      tags: ['dessert', 'sweet', 'chocolate', 'under 10']
    }
  ];

  const quickPrompts = [
    "🍕 Dinner under $15",
    "🥗 High protein low calorie",
    "🍰 Best dessert picks",
    "🍔 Top rated burgers"
  ];

  const handleSend = (userText) => {
    const query = (userText || inputQuery).trim();
    if (!query) return;

    // Add user message
    const userMsg = { id: Date.now(), sender: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    if (!userText) setInputQuery('');
    setIsTyping(true);

    // Simulate AI intelligent processing
    setTimeout(() => {
      const lowerQ = query.toLowerCase();
      let matchedItems = [];

      if (lowerQ.includes('under') || lowerQ.includes('15') || lowerQ.includes('cheap') || lowerQ.includes('budget')) {
        matchedItems = aiDatabase.filter((i) => i.price <= 15);
      } else if (lowerQ.includes('protein') || lowerQ.includes('gym') || lowerQ.includes('muscle')) {
        matchedItems = aiDatabase.filter((i) => i.tags.includes('high protein'));
      } else if (lowerQ.includes('salad') || lowerQ.includes('healthy') || lowerQ.includes('diet')) {
        matchedItems = aiDatabase.filter((i) => i.category === 'salads' || i.tags.includes('healthy'));
      } else if (lowerQ.includes('dessert') || lowerQ.includes('sweet') || lowerQ.includes('cake')) {
        matchedItems = aiDatabase.filter((i) => i.category === 'desserts');
      } else if (lowerQ.includes('burger')) {
        matchedItems = aiDatabase.filter((i) => i.category === 'burgers');
      } else {
        matchedItems = aiDatabase.slice(0, 3);
      }

      let responseText = "Here are my top AI recommendations tailored for you:";
      if (matchedItems.length === 0) {
        responseText = "I've curated our chef's signature favorites for you:";
        matchedItems = aiDatabase.slice(0, 2);
      }

      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: responseText,
        combos: matchedItems
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1000);
  };

  const handleAddToCart = (item) => {
    addToCart(item, 1);
    setAddedToast(item.name);
    setTimeout(() => setAddedToast(null), 2500);
  };

  return (
    <>
      {/* Toast Notification */}
      {addedToast && (
        <div className="fixed bottom-24 right-6 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl z-50 flex items-center gap-2 border border-slate-700 animate-bounce text-xs font-bold">
          <FaCheckCircle className="text-emerald-400 text-base" />
          <span>{addedToast} added to your cart!</span>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white p-4 rounded-full shadow-2xl shadow-orange-500/40 hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center ring-4 ring-orange-400/30 group"
        title="Chat with HamAI Food Concierge"
      >
        <div className="relative">
          <FaRobot size={26} className="group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-2 -right-2 bg-emerald-500 w-3.5 h-3.5 rounded-full ring-2 ring-white animate-ping"></span>
          <span className="absolute -top-2 -right-2 bg-emerald-500 w-3.5 h-3.5 rounded-full ring-2 ring-white"></span>
        </div>
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-2rem)] h-[520px] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 z-50 flex flex-col font-sans overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center ring-2 ring-white/30">
                <FaRobot size={22} className="text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-base text-white">HamAI Concierge</h3>
                  <FaSparkles className="text-amber-200 text-xs animate-spin-slow" />
                </div>
                <p className="text-[11px] text-orange-100 font-medium">AI Food & Craving Specialist</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-colors"
            >
              <FaTimes size={18} />
            </button>
          </div>

          {/* Quick Prompts Carousel */}
          <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 overflow-x-auto flex gap-1.5 no-scrollbar">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(qp)}
                className="whitespace-nowrap text-[11px] font-bold px-3 py-1.5 rounded-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:border-orange-400 hover:text-orange-500 transition-all shadow-xs shrink-0"
              >
                {qp}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-gray-950/40 scrollbar-thin">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-br-none font-bold'
                      : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-none border border-gray-100 dark:border-gray-700 font-medium'
                  }`}
                >
                  {msg.text}
                </div>

                {/* AI Item Recommendations Cards */}
                {msg.combos && msg.combos.length > 0 && (
                  <div className="mt-3 space-y-2.5 w-full">
                    {msg.combos.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-3 p-2.5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-3">
                          <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover" />
                          <div>
                            <p className="font-extrabold text-xs text-gray-900 dark:text-white">{item.name}</p>
                            <div className="flex items-center gap-2 text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                              <span className="font-bold text-orange-500">${item.price}</span>
                              <span>•</span>
                              <span>{item.calories}</span>
                              <span>•</span>
                              <span className="text-emerald-600 font-semibold">{item.protein} protein</span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleAddToCart(item)}
                          className="px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-[11px] font-extrabold shadow-md shadow-orange-500/20 flex items-center gap-1.5 shrink-0 transition-transform active:scale-95"
                        >
                          <FaShoppingBag size={11} /> + Add
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-3 rounded-2xl w-fit text-xs text-gray-500 border border-gray-100 dark:border-gray-700">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce delay-100"></span>
                <span className="w-2 h-2 rounded-full bg-orange-600 animate-bounce delay-200"></span>
                <span className="ml-1 font-semibold text-gray-400">HamAI is thinking...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask HamAI for recommendations..."
                className="flex-1 px-4 py-2.5 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="submit"
                disabled={!inputQuery.trim()}
                className="p-3 rounded-2xl bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white transition-colors flex items-center justify-center shadow-md shadow-orange-500/20"
              >
                <FaPaperPlane size={13} />
              </button>
            </form>
          </div>

        </div>
      )}
    </>
  );
}

export default HamAIChatbot;
