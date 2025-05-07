// GameBoard component for rendering the battlefield grid and units
import React from 'react';
import UnitDisplay from './UnitDisplay';

// Cell component for each board cell
const Cell = React.memo(({ unit, row, col, onClick, onUnitClick, isSpawnRow, isPlayer1Spawn, isPlayer2Spawn, isCurrentPlayerSpawn, selectedCard }) => {
  const cellColor = isPlayer1Spawn ? 'bg-blue-900/40' : isPlayer2Spawn ? 'bg-red-900/40' : 'bg-gray-800/40';
  const hoverColor = isCurrentPlayerSpawn && selectedCard ? 'hover:bg-green-800/60' : '';
  const borderColor = isCurrentPlayerSpawn && selectedCard ? 'border-green-500 border-4' : 'border-gray-700 border-2';
  const handleClick = (e) => {
    if (unit && onUnitClick) {
      e.stopPropagation();
      onUnitClick(unit);
    } else {
      onClick(row, col);
    }
  };
  return (
    <div
      onClick={handleClick}
      className={`w-24 h-28 flex items-center justify-center relative transition-all duration-200
        ${cellColor} ${hoverColor} ${borderColor}
        ${isCurrentPlayerSpawn && selectedCard ? 'cursor-pointer' : ''}
        ${unit ? 'cursor-pointer' : ''}
      `}
    >
      {unit && (
        <UnitDisplay unit={unit} />
      )}
      {/* Spawn row indicators */}
      {!unit && isPlayer1Spawn && (
        <div className="absolute inset-0 flex items-center justify-center opacity-30">
          <span className="text-blue-400 text-sm font-bold">P1 Spawn</span>
        </div>
      )}
      {!unit && isPlayer2Spawn && (
        <div className="absolute inset-0 flex items-center justify-center opacity-30">
          <span className="text-red-400 text-sm font-bold">P2 Spawn</span>
        </div>
      )}
    </div>
  );
});

const Unit = ({ unit, onClick }) => {
  const unitStyle = {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: unit.playerIndex === 0 ? '#4a90e2' : '#e24a4a',
    color: 'white',
    borderRadius: '4px',
    padding: '4px',
    position: 'relative',
    border: unit.hasTaunt ? '2px solid gold' : '1px solid #ccc',
    boxShadow: unit.hasTaunt ? '0 0 8px gold' : 'none'
  };

  return (
    <div style={unitStyle} onClick={onClick}>
      <div style={{ fontSize: '0.8em', fontWeight: 'bold' }}>{unit.name}</div>
      <div style={{ fontSize: '0.7em' }}>{unit.description}</div>
      <div style={{ fontSize: '0.7em' }}>ATK: {unit.attack} HP: {unit.health}</div>
      {unit.hasTaunt && (
        <div style={{
          position: 'absolute',
          top: -8,
          right: -8,
          backgroundColor: 'gold',
          color: 'black',
          borderRadius: '50%',
          width: '20px',
          height: '20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '12px',
          fontWeight: 'bold'
        }}>
          T
        </div>
      )}
    </div>
  );
};

// GameBoard main component
const GameBoard = ({ board, setSelectedUnit }) => {
  return (
    <div className="grid grid-cols-5 gap-1">
      {board.map((row, rowIndex) => (
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`border border-gray-600 p-1 h-24 w-24 flex items-center justify-center ${rowIndex < 2 ? 'bg-blue-900' : 'bg-red-900'}`}
          >
            {cell ? <UnitDisplay unit={cell} onClick={() => setSelectedUnit(cell)} /> : null}
          </div>
        ))
      ))}
    </div>
  );
};

export default GameBoard; 