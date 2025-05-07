// UnitDisplay component for displaying a unit on the battlefield
import React from 'react';
import { ARCHETYPES } from '../gameLogic/helpers';

const UnitDisplay = ({ unit, onClick }) => {
  // Safety check for unit and type
  if (!unit || !unit.type) {
    console.error('Invalid unit:', unit);
    return <div className="unit-invalid">Invalid Unit</div>;
  }

  // Get archetype with safety check
  const archetype = ARCHETYPES[unit.type];
  if (!archetype) {
    console.error('Invalid unit type:', unit.type);
    return <div className="unit-invalid">Invalid Type</div>;
  }

  // Calculate health percentage for the health bar
  const healthPercentage = (unit.health / unit.maxHealth) * 100;
  const healthColor = healthPercentage > 50 ? 'bg-green-500' : 
                     healthPercentage > 25 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div
      className="flex flex-col items-center justify-center h-full w-full cursor-pointer bg-gray-800 rounded p-1 shadow hover:scale-105 transition"
      onClick={onClick}
      title={unit.description}
    >
      <span className="text-2xl mb-1">{archetype ? archetype.icon : '❓'}</span>
      <div className="text-xs text-white truncate font-bold mb-1">{unit.name}</div>
      <div className="flex space-x-2 text-xs text-white mb-1">
        <span>⚔️ {unit.attack}</span>
        <span>❤️ {unit.health}</span>
      </div>
      <div className="flex space-x-1 text-lg">
        {unit.hasTaunt && <span className="text-yellow-400" title="Taunt">🛡️</span>}
        {unit.hasBattlecast && <span className="text-purple-400" title="Battlecast">🔮</span>}
        {unit.hasRage && <span className="text-red-400" title="Rage">💢</span>}
      </div>
    </div>
  );
};

export default UnitDisplay; 