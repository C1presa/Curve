// Card component for displaying cards in hand and deck preview
import React from 'react';
import { ARCHETYPES } from '../gameLogic/helpers';

const Card = React.memo(({ card, onClick, isSelected, isPlayable, isPreview }) => {
  // Safety check for invalid card types
  if (!card || !card.type) {
    console.error('Invalid card:', card);
    return (
      <div className="w-32 h-48 rounded-xl bg-gray-800 border-2 border-red-500 flex items-center justify-center">
        <span className="text-red-500 text-xs text-center">Invalid Card</span>
      </div>
    );
  }

  const archetype = ARCHETYPES[card.type];
  if (!archetype) {
    console.error(`Invalid card type: ${card.type}`, card);
    return (
      <div className="w-32 h-48 rounded-xl bg-gray-800 border-2 border-red-500 flex items-center justify-center">
        <span className="text-red-500 text-xs text-center">Invalid Type: {card.type}</span>
      </div>
    );
  }

  const isTaunt = card.hasTaunt;
  
  return (
    <div 
      onClick={onClick}
      className={`relative w-32 h-48 rounded-xl transition-all duration-200 cursor-pointer
        ${isSelected ? 'scale-110 z-20' : 'hover:scale-105 hover:z-10'}
        ${isPlayable ? 'hover:shadow-lg hover:shadow-green-500/50' : 'opacity-50'}
        ${isPreview ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-900 to-black'}
        border-4 ${isTaunt ? 'border-yellow-400' : 'border-gray-700'}
        shadow-xl
      `}
    >
      {/* Cost Circle */}
      <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full 
        bg-gradient-to-br from-blue-600 to-blue-800 
        border-2 border-blue-400 flex items-center justify-center
        shadow-lg z-10">
        <span className="text-white font-bold">{card.cost}</span>
      </div>

      {/* Taunt Shield Badge */}
      {isTaunt && (
        <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full 
          bg-gradient-to-br from-yellow-400 to-yellow-600
          border-2 border-yellow-500 flex items-center justify-center
          shadow-lg z-10 transform rotate-12">
          <span className="text-lg">🛡️</span>
        </div>
      )}

      {/* Card Content */}
      <div className="h-full flex flex-col p-2">
        {/* Archetype Icon */}
        <div className="flex justify-center items-center h-16">
          <span className="text-4xl">{archetype.icon}</span>
        </div>

        {/* Card Name */}
        <div className="text-center mb-2">
          <div className="text-sm font-bold text-white truncate">
            {card.name}
          </div>
          {isTaunt && (
            <div className="text-xs text-yellow-300 font-semibold">
              Taunt
            </div>
          )}
        </div>

        {/* Card Description */}
        <div className="text-xs text-gray-300 text-center mb-2 flex-grow">
          {card.description}
        </div>

        {/* Stats Panel */}
        <div className="flex justify-around items-center bg-black/50 rounded-lg p-1">
          <div className="flex items-center gap-1">
            <span className="text-red-400">⚔️</span>
            <span className="text-white font-bold">{card.attack}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-green-400">❤️</span>
            <span className="text-white font-bold">{card.health}</span>
          </div>
        </div>
      </div>

      {/* Playable Indicator */}
      {isPlayable && (
        <div className="absolute inset-0 border-2 border-green-500 rounded-xl animate-pulse" />
      )}
    </div>
  );
});

export default Card; 