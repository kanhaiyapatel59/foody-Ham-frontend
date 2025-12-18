import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const Button = ({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    loading = false, 
    disabled = false,
    onClick,
    type = 'button',
    ...props 
}) => {
    const baseClasses = 'font-medium rounded-lg focus:outline-none focus:ring-2 transition-colors';
    
    const variants = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
        outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500'
    };
    
    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2',
        lg: 'px-6 py-3 text-lg'
    };

    const isDisabled = disabled || loading;

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={isDisabled}
            className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${
                isDisabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            {...props}
        >
            {loading ? (
                <div className="flex items-center justify-center">
                    <LoadingSpinner size="sm" text="" />
                    <span className="ml-2">{children}</span>
                </div>
            ) : (
                children
            )}
        </button>
    );
};

export default Button;