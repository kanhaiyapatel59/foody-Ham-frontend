import React, { useState, useEffect } from 'react';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';

function VoiceSearch({ onResult, placeholder = "Try saying 'pizza' or 'chicken burger'" }) {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
        setIsListening(false);
      };
      
      recognitionInstance.onerror = () => {
        setIsListening(false);
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
      setIsSupported(true);
    }
  }, [onResult]);

  const startListening = () => {
    if (recognition && !isListening) {
      setIsListening(true);
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={isListening ? stopListening : startListening}
        className={`p-3 rounded-lg transition-all duration-300 ${
          isListening 
            ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse' 
            : 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white'
        }`}
        title={isListening ? 'Stop listening' : 'Start voice search'}
      >
        {isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
      </button>
      
      {isListening && (
        <div className="absolute top-full left-0 mt-2 p-2 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-10">
          🎤 Listening... {placeholder}
        </div>
      )}
    </div>
  );
}

export default VoiceSearch;