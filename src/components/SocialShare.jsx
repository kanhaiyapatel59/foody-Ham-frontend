import React, { useState } from 'react';
import { Share2, Facebook, Twitter, Instagram, Copy, Check } from 'lucide-react';

const SocialShare = ({ product, onClose }) => {
  const [copied, setCopied] = useState(false);
  
  const shareUrl = `${window.location.origin}/product/${product.id}`;
  const shareText = `Check out this delicious ${product.name} at Foody-Ham! 🍽️`;
  
  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    instagram: `https://www.instagram.com/` // Instagram doesn't support direct sharing
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = (platform) => {
    if (platform === 'copy') {
      copyToClipboard();
    } else {
      window.open(shareLinks[platform], '_blank', 'width=600,height=400');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold dark:text-white flex items-center">
            <Share2 className="w-5 h-5 mr-2" />
            Share this dish
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ×
          </button>
        </div>

        {/* Product Preview Card */}
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-gray-700 dark:to-gray-600 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-white">{product.name}</h4>
              <p className="text-orange-600 dark:text-orange-400 font-bold">${product.price}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Foody-Ham Restaurant</p>
            </div>
          </div>
        </div>

        {/* Share Options */}
        <div className="space-y-3">
          <button
            onClick={() => handleShare('facebook')}
            className="w-full flex items-center space-x-3 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Facebook className="w-5 h-5" />
            <span>Share on Facebook</span>
          </button>

          <button
            onClick={() => handleShare('twitter')}
            className="w-full flex items-center space-x-3 p-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition"
          >
            <Twitter className="w-5 h-5" />
            <span>Share on Twitter</span>
          </button>

          <button
            onClick={() => handleShare('instagram')}
            className="w-full flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition"
          >
            <Instagram className="w-5 h-5" />
            <span>Open Instagram</span>
          </button>

          <button
            onClick={() => handleShare('copy')}
            className="w-full flex items-center space-x-3 p-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
          >
            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            <span>{copied ? 'Copied!' : 'Copy Link'}</span>
          </button>
        </div>

        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-xs text-gray-600 dark:text-gray-300">
            Share this delicious dish with your friends and family!
          </p>
        </div>
      </div>
    </div>
  );
};

export default SocialShare;