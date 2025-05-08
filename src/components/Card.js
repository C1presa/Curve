// Card component for displaying a card in hand or deck
import React, { useState } from 'react';
import { FaShieldAlt, FaBolt, FaHeart } from 'react-icons/fa';
import { ARCHETYPES } from '../gameLogic/helpers';

const Card = ({ card, onClick }) => {
  const [showDetails, setShowDetails] = useState(false);

  if (!card || !card.type) {
    console.error('Invalid card object', card);
    return null;
  }

  const archetype = ARCHETYPES[card.type];
  if (!archetype) {
    console.error(`Archetype not found for type: ${card.type}`);
    return null;
  }

  const playerColor = card.player === 0 ? 'bg-blue-500 border-blue-500' : 'bg-red-500 border-red-500';

  return (
    <div
      className={`w-[70px] h-[100px] flex flex-col relative border-3 ${playerColor} cursor-pointer transform transition-transform hover:scale-105`}
      onMouseEnter={() => setShowDetails(true)}
      onMouseLeave={() => setShowDetails(false)}
      onClick={() => onClick && onClick(card)}
    >
      {/* Top 1/3: Archetype color with icon and mana */}
      <div className="h-1/3 relative" style={{ backgroundColor: archetype.color }}>
        <div className="absolute top-0.5 left-0.5 text-lg">{archetype.icon}</div>
        <div
          className={`absolute top-0.5 right-0.5 ${playerColor} text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px]`}
        >
          {card.cost}
        </div>
      </div>
      {/* Bottom 2/3: Dark background with indicators */}
      <div className="h-2/3 bg-gray-800 relative">
        <div className="absolute top-0.5 left-0.5 text-white text-[10px] truncate">{card.name}</div>
        <div className="absolute bottom-0.5 left-0.5 bg-yellow-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px]">
          <FaBolt className="inline mr-0.5 text-[10px]" />
          {card.attack}
        </div>
        <div className="absolute bottom-0.5 right-0.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px]">
          <FaHeart className="inline mr-0.5 text-[10px]" />
          {card.health}
        </div>
        {card.hasTaunt && (
          <div className="absolute top-4 left-0.5 text-white text-[10px] flex items-center">
            <FaShieldAlt className="mr-0.5 text-[10px]" />
            Taunt
          </div>
        )}
      </div>
      {showDetails && (
        <div className="absolute z-20 bg-white p-1 shadow-md bottom-0 left-0 w-full text-[10px]">
          <div className="font-bold">{card.name}</div>
          <div>Archetype: {archetype.name}</div>
          <div>Cost: {card.cost}</div>
          <div>Attack: {card.attack}</div>
          <div>Health: {card.health}</div>
          {card.hasTaunt && <div>Taunt: Yes</div>}
        </div>
      )}
    </div>
  );
};

export default Card; 