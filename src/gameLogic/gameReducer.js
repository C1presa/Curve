// Game reducer and action types for the card battle game
// Handles all state transitions for the game
import { 
  advanceUnits, 
  battleUnits, 
  drawCardOrFatigue, 
  checkWinCondition, 
  MAX_MANA, 
  ARCHETYPES,
  ROWS 
} from './helpers';

// Action Types for useReducer
export const ACTIONS = {
  START_GAME: 'START_GAME',
  PLACE_CARD: 'PLACE_CARD',
  SELECT_CARD: 'SELECT_CARD',
  END_TURN: 'END_TURN',
  BATTLE_PHASE: 'BATTLE_PHASE',
  ADD_LOG: 'ADD_LOG',
  SET_AI_PROCESSING: 'SET_AI_PROCESSING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Main game reducer
export const gameReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.START_GAME: {
      return {
        ...action.payload,
        log: ['New game started!']
      };
    }
    case ACTIONS.SELECT_CARD: {
      const { card } = action.payload;
      const currentPlayer = state.players[state.currentPlayer];
      
      // Debug logging
      console.log('Select Card Debug:', {
        card,
        currentPlayerMana: currentPlayer.mana,
        cardCost: card.cost
      });
      
      // Validate card type
      if (!ARCHETYPES[card.type]) {
        console.error('Invalid card type:', card);
        return { ...state, message: 'Invalid card type!', selectedCard: null };
      }
      
      // Check mana cost
      if (card.cost > currentPlayer.mana) {
        return {
          ...state,
          message: 'Not enough mana!',
          selectedCard: null
        };
      }
      
      return {
        ...state,
        selectedCard: card,
        message: 'Select a spawn position'
      };
    }
    case ACTIONS.PLACE_CARD: {
      const { row, col } = action.payload;
      const currentPlayer = state.currentPlayer;
      const validRow = currentPlayer === 0 ? 0 : ROWS - 1;
      
      // Debug logging
      console.log('Place Card Debug:', {
        row,
        col,
        currentPlayer,
        validRow,
        selectedCard: state.selectedCard,
        board: state.board
      });
      
      // Validate card and game state
      if (!state.selectedCard || state.gameOver) {
        console.log('Invalid state:', { selectedCard: state.selectedCard, gameOver: state.gameOver });
        return state;
      }
      
      // Validate spawn row
      if (row !== validRow) {
        console.log('Invalid row:', { row, validRow });
        return { ...state, message: `Must place on spawn row ${validRow}!` };
      }
      
      // Validate cell is empty
      if (state.board[row][col]) {
        console.log('Cell occupied:', { row, col, existingUnit: state.board[row][col] });
        return { ...state, message: 'Cell occupied!' };
      }
      
      // Prepare the unit to place
      const card = state.selectedCard;
      let unit = { ...card, playerIndex: currentPlayer, maxHealth: card.health };
      
      // Apply Battlecast effect if present
      if (unit.hasBattlecast) {
        unit.attack += 2;
        unit.health += 2;
        unit.maxHealth += 2;
      }
      
      // Place the card
      const newBoard = state.board.map(row => [...row]);
      newBoard[row][col] = unit;
      
      // Update player state
      const player = state.players[currentPlayer];
      const newHand = player.hand.filter(card => card.id !== state.selectedCard.id);
      const newMana = player.mana - state.selectedCard.cost;
      
      const newPlayers = state.players.map((p, idx) => 
        idx === currentPlayer 
          ? { ...p, hand: newHand, mana: newMana }
          : p
      );
      
      console.log('Card placed successfully:', {
        unit: newBoard[row][col],
        newMana,
        handSize: newHand.length
      });
      
      return {
        ...state,
        board: newBoard,
        players: newPlayers,
        selectedCard: null,
        message: 'Card placed!',
        log: [...state.log, `Turn ${state.turn}: Player ${currentPlayer + 1} placed ${state.selectedCard.name} at ${row},${col}`]
      };
    }
    case ACTIONS.BATTLE_PHASE: {
      // Process battle phase for current player
      let newState = battleUnits(state);
      
      // Check win conditions after battle
      if (!newState.gameOver) {
        const winResult = checkWinCondition(newState);
        if (winResult) {
          newState = { ...newState, ...winResult };
          newState.log = [...newState.log, winResult.message];
        }
      }
      
      return newState;
    }
    case ACTIONS.END_TURN: {
      // First, perform battle phase for current player
      let newState = battleUnits(state);
      
      // Check win conditions after battle
      if (!newState.gameOver) {
        const winResult = checkWinCondition(newState);
        if (winResult) {
          newState = { ...newState, ...winResult };
          newState.log = [...newState.log, winResult.message];
          return newState;
        }
      }
      
      // Switch to next player
      const nextPlayer = state.currentPlayer === 0 ? 1 : 0;
      newState = {
        ...newState,
        currentPlayer: nextPlayer,
        turn: nextPlayer === 0 ? state.turn + 1 : state.turn,
        isFirstTurn: nextPlayer === 1 ? false : state.isFirstTurn
      };
      
      // Draw phase for next player
      newState = drawCardOrFatigue(newState, nextPlayer);
      newState.log = [...newState.log, `Turn ${newState.turn}: Draw phase - Player ${nextPlayer + 1} draws a card`];
      
      // Advance phase for next player
      if (!newState.isFirstTurn) {
        newState = advanceUnits(newState);
        newState.log = [...newState.log, `Turn ${newState.turn}: Advance phase - Player ${nextPlayer + 1}'s units advance`];
      }
      
      // Update mana for next player
      const updatedPlayers = newState.players.map((p, idx) => {
        if (idx === nextPlayer) {
          const manaCapacity = p.manaCapacity < MAX_MANA ? p.manaCapacity + 1 : p.manaCapacity;
          return { ...p, manaCapacity, mana: manaCapacity };
        }
        return p;
      });
      newState = { ...newState, players: updatedPlayers };
      
      // Set message for play phase
      newState.message = nextPlayer === 1 && state.gameMode === 'ai' ? 
        'AI Turn: Play phase - Place your units!' : 
        `Player ${nextPlayer + 1} Turn: Play phase - Place your units!`;
      
      return newState;
    }
    case ACTIONS.ADD_LOG: {
      return {
        ...state,
        log: [...state.log, action.payload]
      };
    }
    case ACTIONS.SET_AI_PROCESSING: {
      return {
        ...state,
        isProcessingAI: action.payload
      };
    }
    case ACTIONS.SET_ERROR: {
      return {
        ...state,
        error: action.payload
      };
    }
    case ACTIONS.CLEAR_ERROR: {
      return {
        ...state,
        error: null
      };
    }
    default:
      return state;
  }
}; 