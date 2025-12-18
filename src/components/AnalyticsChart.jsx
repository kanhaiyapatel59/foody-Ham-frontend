import React from 'react';

function AnalyticsChart({ data, title, type = 'bar', color = 'orange' }) {
  const maxValue = Math.max(...data.map(item => item.value));
  
  const getBarHeight = (value) => {
    return (value / maxValue) * 100;
  };

  const colorClasses = {
    orange: 'bg-gradient-to-t from-orange-500 to-orange-400',
    blue: 'bg-gradient-to-t from-blue-500 to-blue-400',
    green: 'bg-gradient-to-t from-green-500 to-green-400',
    purple: 'bg-gradient-to-t from-purple-500 to-purple-400'
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">{title}</h3>
      
      {type === 'bar' && (
        <div className="flex items-end justify-between h-48 gap-2">
          {data.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="w-full flex justify-center mb-2">
                <div 
                  className={`w-full max-w-12 ${colorClasses[color]} rounded-t transition-all duration-1000 ease-out`}
                  style={{ height: `${getBarHeight(item.value)}%` }}
                ></div>
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400 text-center">{item.label}</span>
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{item.value}</span>
            </div>
          ))}
        </div>
      )}
      
      {type === 'line' && (
        <div className="h-48 flex items-end">
          <svg className="w-full h-full" viewBox="0 0 400 200">
            <polyline
              fill="none"
              stroke={`rgb(249 115 22)`}
              strokeWidth="3"
              points={data.map((item, index) => 
                `${(index / (data.length - 1)) * 380 + 10},${190 - (item.value / maxValue) * 170}`
              ).join(' ')}
            />
            {data.map((item, index) => (
              <circle
                key={index}
                cx={(index / (data.length - 1)) * 380 + 10}
                cy={190 - (item.value / maxValue) * 170}
                r="4"
                fill="rgb(249 115 22)"
              />
            ))}
          </svg>
        </div>
      )}
    </div>
  );
}

export default AnalyticsChart;