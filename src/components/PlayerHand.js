// PlayerHand component for displaying a player's hand of cards
import React from 'react';
import { ARCHETYPES } from '../gameLogic/helpers';

const PlayerHand = ({ hand, onSelect }) => {
  return (
    <div className="flex flex-wrap justify-center space-x-2 p-4">
      {hand.map(card => {
        const archetype = ARCHETYPES[card.type];
        return (
          <div
            key={card.id}
            className="bg-gray-800 p-4 rounded-lg shadow-lg w-32 h-48 flex flex-col items-center justify-between cursor-pointer transform transition duration-300 hover:scale-105"
            onClick={() => onSelect(card)}
            title={card.description}
          >
            <div className="text-yellow-400 text-lg truncate font-bold mb-1">{card.name}</div>
            <span className="text-4xl mb-1">{archetype ? archetype.icon : '❓'}</span>
            <div className="flex justify-between w-full text-white text-xs mb-1">
              <span>⚔️ {card.attack}</span>
              <span>❤️ {card.health}</span>
            </div>
            <div className="text-sm text-gray-400 truncate mb-1">{card.description}</div>
            <div className="flex space-x-1 text-lg mt-1">
              {card.hasTaunt && <span className="text-yellow-400" title="Taunt">🛡️</span>}
              {card.hasBattlecast && <span className="text-purple-400" title="Battlecast">🔮</span>}
              {card.hasRage && <span className="text-red-400" title="Rage">💢</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PlayerHand; 