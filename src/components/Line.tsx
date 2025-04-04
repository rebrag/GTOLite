import React from 'react';

interface LineProps {
  line: string[];
  // Called when a line button is clicked; index indicates which button.
  onLineClick: (action: number) => void;
}

const Line: React.FC<LineProps> = ({ line, onLineClick }) => {
  return (
    <div className="flex space-x-2 p-4">
        Line: 
      {line.map((label, index) => (
        <button
          key={index}
          onClick={() => onLineClick(index)}
          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-black rounded-lg transition-colors"
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default Line;
