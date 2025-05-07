// CardModal component for displaying detailed card/unit info in a modal
import React from 'react';
import { ARCHETYPES } from '../gameLogic/helpers';

const CardModal = React.memo(({ card, onClose }) => {
  const archetype = ARCHETYPES[card.type];
  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 border-2 border-gray-600 rounded-xl p-6 max-w-md w-full mx-4 transform transition-all duration-200 scale-95 hover:scale-100"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">{card.name}</h2>
            <div className="flex items-center gap-2 text-gray-300">
              <span className="text-lg">{archetype.icon}</span>
              <span>{archetype.name}</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl font-bold"
          >
            ×
          </button>
        </div>
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-900/50 p-3 rounded-lg text-center">
            <div className="text-sm text-blue-300">Cost</div>
            <div className="text-2xl font-bold text-white">{card.cost}</div>
          </div>
          <div className="bg-red-900/50 p-3 rounded-lg text-center">
            <div className="text-sm text-red-300">Attack</div>
            <div className="text-2xl font-bold text-white">{card.attack}</div>
          </div>
          <div className="bg-green-900/50 p-3 rounded-lg text-center">
            <div className="text-sm text-green-300">Health</div>
            <div className="text-2xl font-bold text-white">{card.health}</div>
          </div>
        </div>
        {/* Description */}
        <div className="text-gray-300 text-sm">
          {card.description || archetype.description}
        </div>
      </div>
    </div>
  );
});

export default CardModal; 