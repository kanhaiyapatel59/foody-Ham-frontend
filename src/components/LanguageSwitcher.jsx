import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ChevronDown } from 'lucide-react';

const LanguageSwitcher = () => {
  const { language, changeLanguage, availableLanguages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = availableLanguages.find(lang => lang.code === language);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
      >
        <span className="text-lg">{currentLanguage?.flag}</span>
        <span className="text-sm font-medium dark:text-white">{currentLanguage?.code.toUpperCase()}</span>
        <ChevronDown className="w-4 h-4 dark:text-white" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 z-50">
          {availableLanguages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                changeLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                language === lang.code ? 'bg-orange-50 dark:bg-orange-900/20' : ''
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span className="font-medium dark:text-white">{lang.name}</span>
              {language === lang.code && (
                <span className="ml-auto text-orange-500">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;