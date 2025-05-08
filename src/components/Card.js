// Card component for displaying a card in hand or deck
import React from 'react';
import { ARCHETYPES } from '../gameLogic/helpers';

const Card = ({ card, isSelected, onClick }) => {
  const archetype = ARCHETYPES[card.type];
  const playerBorder = card.playerIndex === 0 ? 'border-blue-500' : 'border-red-500';

  return (
    <div
      className={`
        relative w-20 h-28 cursor-pointer
        transition-all duration-200 border-4 ${playerBorder}
        ${isSelected ? 'scale-110 shadow-lg' : 'hover:scale-105'}
        overflow-hidden rounded-lg
      `}
      onClick={onClick}
    >
      {/* Top third - Archetype color with icon */}
      <div className={`w-full h-1/3 flex items-center justify-center bg-gradient-to-br ${archetype.unitColor}`}>
        <span className="text-xl">{archetype.icon}</span>
      </div>

      {/* Bottom two thirds - Dark theme */}
      <div className="w-full h-2/3 bg-gray-800 flex flex-col items-center justify-between p-1">
        {/* Mana Cost - Upper Right */}
        <div className="absolute top-1 right-1 bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-lg">
          {card.cost}
        </div>

        {/* Card Name */}
        <div className="text-center px-1 pt-1">
          <div className="font-bold text-xs truncate text-white">{card.name}</div>
        </div>

        {/* Stats Bar - Bottom */}
        <div className="w-full bg-black/50 text-white text-xs px-1 py-0.5 flex justify-between">
          <span className="text-red-400">⚔️ {card.attack}</span>
          <span className="text-green-400">❤️ {card.health}</span>
        </div>
      </div>

      {/* Hover Tooltip */}
      <div className="absolute z-50 bg-gray-900/95 p-2 rounded-lg shadow-xl -top-2 left-full ml-2 w-40 border border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
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