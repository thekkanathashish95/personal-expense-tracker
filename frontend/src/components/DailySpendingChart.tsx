import React, { memo } from 'react';

interface DailyData {
  date: string;
  amount: number;
}

interface DailySpendingChartProps {
  dailyData: DailyData[];
}

const DailySpendingChart: React.FC<DailySpendingChartProps> = memo(({ dailyData }) => {
  const maxAmount = Math.max(...dailyData.map(day => day.amount));
  
  // Show all days, including zero-spending days
  const allDays = dailyData;
  
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Spending</h3>
      <div className="relative">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-8 w-12 flex flex-col justify-between text-xs text-gray-500">
          <span>₹{maxAmount.toLocaleString()}</span>
          <span>₹{Math.round(maxAmount * 0.75).toLocaleString()}</span>
          <span>₹{Math.round(maxAmount * 0.5).toLocaleString()}</span>
          <span>₹{Math.round(maxAmount * 0.25).toLocaleString()}</span>
          <span>₹0</span>
        </div>
        
        {/* Chart area */}
        <div className="ml-12 mr-4">
          <div className="relative h-48 border-b border-gray-200">
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
              <div
                key={index}
                className="absolute w-full border-t border-gray-100"
                style={{ top: `${ratio * 100}%` }}
              />
            ))}
            
            {/* Bars */}
            <div className="absolute inset-0 flex items-end justify-between px-2 pb-8">
              {allDays.map((day, index) => {
                // Calculate height in pixels instead of percentage
                const maxHeight = 160; // Reduced from 180 to leave padding at top
                const height = maxAmount > 0 ? (day.amount / maxAmount) * maxHeight : 0;
                const finalHeight = Math.max(height, 4); // Minimum 4px height
                
                
                return (
                  <div key={index} className="flex flex-col items-center flex-1 relative">
                    {/* Bar */}
                    <div 
                      className={`w-6 rounded-t-sm transition-all duration-300 ease-in-out hover:opacity-80 cursor-pointer ${
                        day.amount > 0 ? 'bg-blue-500' : 'bg-gray-200'
                      }`}
                      style={{ 
                        height: `${finalHeight}px`
                      }}
                      title={`${day.date}: ₹${day.amount.toLocaleString()}`}
                    />
                    
                    {/* X-axis label */}
                    <div className="absolute -bottom-6 text-xs text-gray-600 transform -rotate-45 origin-top whitespace-nowrap">
                      {day.date}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

DailySpendingChart.displayName = 'DailySpendingChart';

export default DailySpendingChart;
