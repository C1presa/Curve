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

// GameBoard main component
const GameBoard = React.memo(({ board, onCellClick, currentPlayer, selectedCard, onUnitClick }) => (
  <div className="bg-gray-900/50 p-4 rounded-xl mb-4 inline-block mx-auto">
    <div className="border-4 border-gray-700 rounded-lg overflow-hidden">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="flex">
          {row.map((unit, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              unit={unit}
              row={rowIndex}
              col={colIndex}
              onClick={onCellClick}
              onUnitClick={onUnitClick}
              isPlayer1Spawn={rowIndex === 0}
              isPlayer2Spawn={rowIndex === board.length - 1}
              isCurrentPlayerSpawn={
                (rowIndex === 0 && currentPlayer === 0) || 
                (rowIndex === board.length - 1 && currentPlayer === 1)
              }
              selectedCard={selectedCard}
            />
          ))}
        </div>
      ))}
    </div>
    {/* Battle lines indicator */}
    <div className="mt-3 flex justify-between px-4">
      <div className="text-xs text-blue-400 font-bold">Player 1 Spawn</div>
      <div className="text-xs text-gray-500">⚔️ Battlefield ⚔️</div>
      <div className="text-xs text-red-400 font-bold">Player 2 Spawn</div>
    </div>
    <div className="text-xs text-gray-400 text-center mt-1">Click on units to see details</div>
  </div>
));

export default GameBoard; 