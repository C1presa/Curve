// UnitDisplay component for displaying a unit on the battlefield
import React from 'react';
import { ARCHETYPES } from '../gameLogic/helpers';

const UnitDisplay = ({ unit }) => {
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
    <div className={`unit ${archetype.class} relative`}>
      {/* Unit Icon */}
      <div className="unit-icon">
        <span className="text-4xl relative z-10 drop-shadow-2xl">{archetype.icon}</span>
      </div>

      {/* Unit Stats */}
      <div className="unit-stats">
        <div className="stat attack">
          <span className="label">ATK</span>
          <span className="value">{unit.attack}</span>
        </div>
        <div className="stat health">
          <span className="label">HP</span>
          <span className="value">{unit.health}</span>
        </div>
      </div>

      {/* Health Bar */}
      <div className="health-bar">
        <div 
          className={`health-fill ${healthColor}`}
          style={{ width: `${healthPercentage}%` }}
        />
      </div>

      {/* Taunt Indicator */}
      {unit.hasTaunt && (
        <div className="taunt-indicator">
          <span className="text-2xl">🛡️</span>
        </div>
      )}
    </div>
  );
};

export default UnitDisplay; 