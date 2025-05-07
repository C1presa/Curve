// PlayerHand component for displaying a player's hand of cards
import React from 'react';
import Card from './Card';

const PlayerHand = ({ hand, onCardClick, selectedCard, currentPlayer, mana }) => {
  // Safety check for hand
  if (!Array.isArray(hand)) {
    console.error('Invalid hand:', hand);
    return <div className="hand-invalid">Invalid Hand</div>;
  }

  return (
    <div className="player-hand flex flex-row gap-3 justify-center items-end mt-4 mb-2 overflow-x-auto pb-2">
      {hand.map(card => {
        // Safety check for each card
        if (!card || !card.type) {
          console.error('Invalid card in hand:', card);
          return null;
        }

        const isPlayable = card.cost <= mana;
        const isSelected = selectedCard && selectedCard.id === card.id;

        return (
          <Card
            key={card.id}
            card={card}
            onClick={() => onCardClick(card)}
            isSelected={isSelected}
            isPlayable={isPlayable}
          />
        );
      })}
    </div>
  );
};

export default PlayerHand; 