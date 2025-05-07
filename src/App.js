import React, { useState, useEffect, useRef, useReducer, useCallback, useMemo } from 'react';
import { gameReducer, ACTIONS } from './gameLogic/gameReducer';
import { initializeGame, ARCHETYPES } from './gameLogic/helpers';
import Card from './components/Card';
import UnitDisplay from './components/UnitDisplay';
import GameBoard from './components/GameBoard';
import PlayerHand from './components/PlayerHand';
import CardModal from './components/CardModal';
import DeckSelection from './components/DeckSelection';
import GameMenu from './components/GameMenu';

// Game Constants
const ROWS = 5;
const COLS = 7;
const STARTING_HEALTH = 30;
const STARTING_HAND_SIZE = 3;
const MAX_MANA = 10;
const HAND_SIZE_LIMIT = 7;
const FATIGUE_DAMAGE = 1;

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Game Error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[600px] bg-gray-900 text-white p-4">
          <h1 className="text-2xl font-bold mb-4">Something went wrong.</h1>
          <p className="mb-4">{this.state.error && this.state.error.toString()}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          >
            Reload Game
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const getBackgroundClass = (archetype) => {
  switch (archetype) {
    case 'orc':
      return 'bg-gradient-to-r from-green-900 to-yellow-900';
    case 'undead':
      return 'bg-gradient-to-r from-purple-900 to-black';
    case 'human':
      return 'bg-gradient-to-r from-blue-900 to-gray-700';
    case 'minotaur':
      return 'bg-gradient-to-r from-red-900 to-orange-900';
    default:
      return 'bg-gray-900';
  }
};

// Main Game Component
const CardBattleGame = () => {
  const [state, dispatch] = useReducer(gameReducer, null);
  const [gameMode, setGameMode] = useState('menu');
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [playerDeckChoices, setPlayerDeckChoices] = useState({ player1: null, player2: null });
  const [deckSelectionPhase, setDeckSelectionPhase] = useState(null);
  const timeoutRefs = useRef([]);
  const logRef = useRef(null);
  
  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
    };
  }, []);
  
  // Auto-scroll game log
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [state?.log]);
  
  // AI Move Logic
  const findBestPosition = useCallback((card, currentBoard) => {
    const spawnRow = ROWS - 1;
    const availablePositions = [];
    
    for (let col = 0; col < COLS; col++) {
      if (!currentBoard[spawnRow][col]) {
        availablePositions.push({ row: spawnRow, col });
      }
    }
    
    if (availablePositions.length === 0) return null;
    
    const scoredPositions = availablePositions.map(pos => {
      let score = 0;
      
      let enemiesInColumn = 0;
      let alliedInColumn = 0;
      
      for (let row = 0; row < ROWS; row++) {
        const unit = currentBoard[row][pos.col];
        if (unit) {
          if (unit.playerIndex !== 1) {
            enemiesInColumn++;
            score += (10 - Math.abs(row - spawnRow));
          } else {
            alliedInColumn++;
          }
        }
      }
      
      score += enemiesInColumn * 5;
      score += alliedInColumn * 2;
      
      if (card.attack > 5) {
        score -= alliedInColumn * 3;
      }
      
      score += Math.random() * 3;
      
      return { ...pos, score };
    });
    
    scoredPositions.sort((a, b) => b.score - a.score);
    return scoredPositions[0];
  }, []);
  
  const makeAIMove = useCallback(async () => {
    if (!state || state.gameOver || state.currentPlayer !== 1 || state.isProcessingAI) return;
    
    dispatch({ type: ACTIONS.SET_AI_PROCESSING, payload: true });
    dispatch({ type: ACTIONS.ADD_LOG, payload: `Turn ${state.turn}: AI is thinking...` });
    
    const timeout1 = setTimeout(async () => {
      const aiPlayer = state.players[1];
      const playableCards = aiPlayer.hand.filter(card => card.cost <= aiPlayer.mana);
      
      if (playableCards.length === 0) {
        dispatch({ type: ACTIONS.ADD_LOG, payload: `Turn ${state.turn}: AI has no playable cards. Ending turn.` });
        await new Promise(resolve => setTimeout(resolve, 500));
        dispatch({ type: ACTIONS.END_TURN });
        dispatch({ type: ACTIONS.SET_AI_PROCESSING, payload: false });
        return;
      }
      
      // Sort cards by value
      playableCards.sort((a, b) => {
        const valueA = a.cost * (a.attack + a.health);
        const valueB = b.cost * (b.attack + b.health);
        return valueB - valueA;
      });
      
      // Play cards
      let manaLeft = aiPlayer.mana;
      const cardsToPlay = [];
      
      for (const card of playableCards) {
        if (card.cost <= manaLeft) {
          cardsToPlay.push(card);
          manaLeft -= card.cost;
        }
      }
      
      dispatch({ type: ACTIONS.ADD_LOG, payload: `Turn ${state.turn}: AI will play ${cardsToPlay.length} cards.` });
      
      // Play each card sequentially
      for (let i = 0; i < cardsToPlay.length; i++) {
        const card = cardsToPlay[i];
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const position = findBestPosition(card, state.board);
        
        if (position) {
          dispatch({ type: ACTIONS.SELECT_CARD, payload: { card } });
          await new Promise(resolve => setTimeout(resolve, 200));
          dispatch({ type: ACTIONS.PLACE_CARD, payload: position });
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      dispatch({ type: ACTIONS.END_TURN });
      dispatch({ type: ACTIONS.SET_AI_PROCESSING, payload: false });
    }, 1000);
    
    timeoutRefs.current.push(timeout1);
  }, [state, findBestPosition]);
  
  // Trigger AI move when it's AI's turn
  useEffect(() => {
    if (gameMode === 'ai' && 
        state && 
        state.currentPlayer === 1 && 
        !state.gameOver && 
        !state.isProcessingAI) {
      makeAIMove();
    }
  }, [state?.currentPlayer, state?.gameOver, state?.isProcessingAI, gameMode, makeAIMove]);
  
  // Deck selection logic
  const startDeckSelection = useCallback((mode) => {
    setGameMode(mode);
    setDeckSelectionPhase('player1');
    setPlayerDeckChoices({ player1: null, player2: null });
  }, []);

  const handleDeckSelect = useCallback((archetype) => {
    if (deckSelectionPhase === 'player1') {
      setPlayerDeckChoices(prev => ({ ...prev, player1: archetype }));
      
      if (gameMode === 'ai') {
        // AI randomly selects a deck
        const archetypes = Object.keys(ARCHETYPES);
        const aiArchetype = archetypes[Math.floor(Math.random() * archetypes.length)];
        
        // Start game immediately for AI mode
        const initialState = initializeGame(archetype, aiArchetype);
        initialState.gameMode = gameMode;
        
        dispatch({ 
          type: ACTIONS.START_GAME, 
          payload: initialState
        });
        setDeckSelectionPhase(null);
      } else {
        // 1v1 mode - player 2 selects deck
        setDeckSelectionPhase('player2');
      }
    } else if (deckSelectionPhase === 'player2') {
      setPlayerDeckChoices(prev => ({ ...prev, player2: archetype }));
      
      // Start game with both players' deck choices
      const initialState = initializeGame(playerDeckChoices.player1, archetype);
      initialState.gameMode = gameMode;
      
      dispatch({ 
        type: ACTIONS.START_GAME, 
        payload: initialState
      });
      setDeckSelectionPhase(null);
    }
  }, [deckSelectionPhase, gameMode, playerDeckChoices.player1]);

  const backToMenu = useCallback(() => {
    setGameMode('menu');
    setDeckSelectionPhase(null);
    setPlayerDeckChoices({ player1: null, player2: null });
  }, []);
  
  // Main render logic
  if (gameMode === 'menu') {
    return <GameMenu onStart1v1={() => startDeckSelection('1v1')} onStartAI={() => startDeckSelection('ai')} />;
  }

  if (deckSelectionPhase) {
    return (
      <DeckSelection 
        onSelectDeck={handleDeckSelect} 
        onBack={backToMenu}
      />
    );
  }

  if (!state) {
    return null;
  }

  // Game UI rendering
  return (
    <div className={`min-h-screen ${getBackgroundClass(state.players[0].archetype)} flex justify-center items-center`}>
      <div className="max-w-4xl w-full p-4">
        <div className="flex justify-between mb-4">
          <div className="bg-blue-900 p-2 rounded shadow-md">
            <h2 className="text-lg text-blue-300">Player 1: {state.players[0].archetype}</h2>
            <div className="w-full bg-blue-700 h-4 rounded" />
          </div>
          <div className="bg-red-900 p-2 rounded shadow-md">
            <h2 className="text-lg text-red-300">Player 2: {state.players[1].archetype}</h2>
            <div className="w-full bg-red-700 h-4 rounded" />
          </div>
        </div>
        <GameBoard
          board={state.board}
          onCellClick={(row, col) => {
            if (!state?.selectedCard) return;
            dispatch({ type: ACTIONS.PLACE_CARD, payload: { row, col } });
          }}
          onUnitClick={setSelectedUnit}
          currentPlayer={state.currentPlayer}
          selectedCard={state.selectedCard}
        />
        <PlayerHand
          hand={state.players[state.currentPlayer].hand}
          mana={state.players[state.currentPlayer].mana}
          selectedCard={state.selectedCard}
          currentPlayer={state.currentPlayer}
          onCardClick={card => {
            if (state?.gameMode === 'ai' && state?.currentPlayer === 1) return;
            dispatch({ type: ACTIONS.SELECT_CARD, payload: { card } });
          }}
        />
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => dispatch({ type: ACTIONS.END_TURN })}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed font-bold shadow-lg transition-all duration-200 transform hover:scale-105"
            disabled={state.gameOver || (state.gameMode === 'ai' && state.currentPlayer === 1) || state.isProcessingAI}
          >
            End Turn
          </button>
          
          {state.gameOver && (
            <button
              onClick={() => {
                const newGame = initializeGame(state.players[0].archetype, state.players[1].archetype);
                newGame.gameMode = state.gameMode;
                dispatch({ type: ACTIONS.START_GAME, payload: newGame });
              }}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 px-6 py-3 rounded-lg font-bold shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              Restart Game
            </button>
          )}
        </div>
      </div>
      
      {selectedUnit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" onClick={() => setSelectedUnit(null)}>
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl text-yellow-400 mb-2">{selectedUnit.name}</h2>
            <p className="text-white">Type: {selectedUnit.type}</p>
            <p className="text-white">Attack: {selectedUnit.attack}</p>
            <p className="text-white">Health: {selectedUnit.health}/{selectedUnit.maxHealth}</p>
            <p className="text-white mt-2">{selectedUnit.description}</p>
            <button className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded" onClick={() => setSelectedUnit(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Export wrapped with error boundary
export default function App() {
  return (
    <ErrorBoundary>
      <CardBattleGame />
    </ErrorBoundary>
  );
}