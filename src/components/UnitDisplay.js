// UnitDisplay component for displaying a unit on the battlefield
import React, { useState } from 'react';
import { FaShieldAlt, FaSword, FaHeart } from 'react-icons/fa';

const UnitDisplay = ({ unit }) => {
  const [showDetails, setShowDetails] = useState(false);

  if (!unit || !unit.archetype) {
    console.error('Invalid unit object', unit);
    return null;
  }

  const playerColor = unit.player === 0 ? 'bg-blue-500 border-blue-500' : 'bg-red-500 border-red-500';

  return (
    <div
      className={`w-full h-full flex flex-col relative border-3 ${playerColor}`}
      onMouseEnter={() => setShowDetails(true)}
      onMouseLeave={() => setShowDetails(false)}
    >
      <div className="h-1/3 relative" style={{ backgroundColor: unit.archetype.color }}>
        <div className="absolute top-1 left-1 text-2xl">{unit.archetype.icon}</div>
        <div
          className={`absolute top-1 right-1 ${playerColor} text-white rounded-full w-6 h-6 flex items-center justify-center text-xs`}
        >
          {unit.cost}
        </div>
      </div>
      <div className="h-2/3 bg-gray-800 relative">
        <div className="absolute bottom-1 left-1 bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
          <FaSword className="inline mr-1 text-xs" />
          {unit.attack}
        </div>
        <div className="absolute bottom-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
          <FaHeart className="inline mr-1 text-xs" />
          {unit.health}
        </div>
        {unit.taunt && (
          <div className="absolute top-1 left-1 text-white text-xs flex items-center">
            <FaShieldAlt className="mr-1" />
            Taunt
          </div>
        )}
      </div>
      {showDetails && (
        <div className="absolute z-20 bg-white p-2 shadow-md bottom-0 left-0 w-full text-sm">
          <div className="font-bold">{unit.name}</div>
          <div>Archetype: {unit.archetype.name}</div>
          <div>Cost: {unit.cost}</div>
          <div>Attack: {unit.attack}</div>
          <div>Health: {unit.health}</div>
          {unit.taunt && <div>Taunt: Yes</div>}
        </div>
      )}
    </div>
  );
};

export default UnitDisplay; 