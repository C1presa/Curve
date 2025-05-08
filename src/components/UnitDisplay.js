// UnitDisplay component for displaying a unit on the battlefield
import React from 'react';
import { ARCHETYPES } from '../gameLogic/helpers';

const UnitDisplay = React.memo(({ unit }) => {
  const archetype = ARCHETYPES[unit.type];
  const healthPercent = (unit.health / unit.maxHealth) * 100;
  const isDamaged = unit.health < unit.maxHealth;
  return (
    <div className={`w-20 h-24 rounded-xl relative overflow-hidden border-4 transition-all duration-200
      ${unit.playerIndex === 0 ? 'border-blue-400 shadow-blue-500/50' : 'border-red-400 shadow-red-500/50'}
      bg-gradient-to-br ${archetype.unitColor}
      hover:scale-110 hover:z-30 shadow-xl
      transform-gpu hover:-translate-y-1
    `}>
      {/* Enhanced player ribbon with glow */}
      <div className={`absolute top-0 left-0 right-0 h-2
        ${unit.playerIndex === 0 ? 'bg-gradient-to-r from-blue-600 to-blue-400' : 'bg-gradient-to-r from-red-600 to-red-400'}
        shadow-lg
      `} />
      {/* Archetype icon with enhanced visibility */}
      <div className="absolute top-3 left-0 right-0 flex justify-center">
        <div className="relative">
          {/* Enhanced glow effect */}
          <div className="absolute inset-0 w-12 h-12 bg-white/20 rounded-full blur-md animate-pulse" />
          <div className="absolute inset-0 w-12 h-12 bg-black/40 rounded-full blur-sm" />
          <span className="text-4xl relative z-10 drop-shadow-2xl">{archetype.icon}</span>
        </div>
      </div>
      {/* Unit name - more prominent */}
      <div className="absolute top-14 left-0 right-0 px-1">
        <div className="text-xs font-bold text-white text-center truncate bg-black/60 rounded py-0.5 px-1">
          {unit.name}
        </div>
      </div>
      {/* Enhanced stats panel */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 to-black/80 p-2">
        <div className="flex justify-around items-center">
          {/* Attack stat with glow */}
          <div className="flex items-center gap-1">
            <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-800 rounded-lg border-2 border-red-400 flex items-center justify-center shadow-inner">
              <span className="text-white font-bold text-sm">{unit.attack}</span>
            </div>
            <span className="text-red-300 text-xs">⚔️</span>
          </div>
          {/* Health stat with dynamic color */}
          <div className="flex items-center gap-1">
            <span className="text-green-300 text-xs">❤️</span>
            <div className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center shadow-inner ${
              isDamaged 
                ? 'bg-gradient-to-br from-orange-600 to-orange-800 border-orange-400' 
                : 'bg-gradient-to-br from-green-600 to-green-800 border-green-400'
            }`}>
              <span className="text-white font-bold text-sm">{unit.health}</span>
            </div>
          </div>
        </div>
        {/* Enhanced health bar */}
        <div className="mt-1 w-full h-1 bg-gray-800 rounded-full overflow-hidden border border-gray-600">
          <div 
            className={`h-full transition-all duration-300 rounded-full ${
              healthPercent > 60 ? 'bg-gradient-to-r from-green-600 to-green-400' : 
              healthPercent > 30 ? 'bg-gradient-to-r from-yellow-600 to-yellow-400' : 
              'bg-gradient-to-r from-red-600 to-red-400 animate-pulse'
            }`}
            style={{ width: `${healthPercent}%` }}
          />
        </div>
      </div>
      {/* Cost indicator with glow */}
      <div className="absolute top-12 left-1">
        <div className="w-5 h-5 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center border border-blue-400 shadow-lg">
          <span className="text-[10px] text-white font-bold">{unit.cost}</span>
        </div>
      </div>
    </div>
  );
});

export default UnitDisplay; 