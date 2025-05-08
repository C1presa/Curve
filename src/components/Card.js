// Card component for displaying a card in hand or deck
import React from 'react';
import { ARCHETYPES } from '../gameLogic/helpers';

const Card = ({ card, isSelected, onClick, disabled }) => {
  if (!card) return null; // Prevent rendering if card is undefined
  
  const archetype = ARCHETYPES[card.type];
  const playerBorder = card.playerIndex === 0 ? 'border-blue-500' : 'border-red-500';
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105';

  return (
    <div
      className={`
        relative w-20 h-28
        transition-all duration-200 border-4 ${playerBorder}
        ${isSelected ? 'scale-110 shadow-lg' : disabledClass}
        overflow-hidden rounded-lg
      `}
      onClick={disabled ? undefined : onClick}
    >
      {/* Top third - Archetype color with icon */}
      <div className={`w-full h-1/3 flex items-center justify-center bg-gradient-to-br ${archetype.unitColor}`}>
        <span className="text-xl">{archetype.icon}</span>
      </div>

      {/* Bottom two thirds - Dark theme */}
      <div className="w-full h-2/3 bg-gray-800 relative">
        {/* Mana Cost - Upper Right */}
        <div className="absolute top-1 right-1 bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-lg">
          {card.cost}
        </div>

        {/* Card Name - Top Left */}
        <div className="absolute top-1 left-1 text-white text-xs font-bold truncate max-w-[60%]">
          {card.name}
        </div>

        {/* Taunt Indicator - Below Name */}
        {card.hasTaunt && (
          <div className="absolute top-6 left-1 text-yellow-400 text-sm">
            🛡️
          </div>
        )}

        {/* Stats Bar - Bottom */}
        <div className="w-full bg-black/50 text-white text-xs px-1 py-0.5 flex justify-between absolute bottom-0">
          <span className="text-red-400">⚔️ {card.attack}</span>
          <span className="text-green-400">❤️ {card.health}</span>
        </div>
      </div>

      {/* Hover Tooltip */}
      <div className="absolute z-50 bg-gray-900/95 p-2 rounded-lg shadow-xl -top-2 left-full ml-2 w-40 border border-gray-700 hidden group-hover:block">
        <div className="font-bold text-yellow-400 text-sm mb-1">{card.name}</div>
        <div className="text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-gray-400">Type:</span>
            <span className="text-white">{archetype.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Cost:</span>
            <span className="text-blue-400">{card.cost}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Attack:</span>
            <span className="text-red-400">{card.attack}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Health:</span>
            <span className="text-green-400">{card.health}</span>
          </div>
          {card.hasTaunt && (
            <div className="text-yellow-400 text-xs mt-1">
              🛡️ Has Taunt
            </div>
          )}
          <div className="text-gray-400 text-xs mt-1">
            {card.description}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card; 