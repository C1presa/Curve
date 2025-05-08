// DeckSelection component for choosing a deck/archetype and previewing cards
import React, { useState, useEffect } from 'react';
import { ARCHETYPES, generatePreviewDeck } from '../gameLogic/helpers';
import Card from './Card';
import CardModal from './CardModal';
import CardDisplay from './CardDisplay';

const DeckSelection = ({ onSelectDeck, onBack }) => {
  const [selectedArchetype, setSelectedArchetype] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [previewDecks, setPreviewDecks] = useState({});
  const [expandedCard, setExpandedCard] = useState(null);

  useEffect(() => {
    // Generate preview decks for all archetypes
    const decks = {};
    Object.keys(ARCHETYPES).forEach(archetypeKey => {
      decks[archetypeKey] = generatePreviewDeck(archetypeKey);
    });
    setPreviewDecks(decks);
  }, []);

  const handleConfirmSelection = () => {
    if (selectedArchetype) {
      onSelectDeck(selectedArchetype);
    }
  };

  // Render deck preview
  const renderDeckPreview = (archetypeKey) => {
    const deck = previewDecks[archetypeKey];
    if (!deck) return null;
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-3">Deck Cards (15)</h3>
          <div className={`${viewMode === 'grid' ? 'grid grid-cols-5 gap-4' : 'space-y-2'}`}>
            {deck.map(card => (
              viewMode === 'grid' ? (
                <Card 
                  key={card.id} 
                  card={card} 
                  archetype={archetypeKey}
                  onClick={setExpandedCard}
                />
              ) : (
                <div 
                  key={card.id} 
                  className="bg-gray-800 p-3 rounded-lg flex items-center justify-between hover:bg-gray-700 cursor-pointer"
                  onClick={() => setExpandedCard(card)}
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-700 w-8 h-8 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">{card.cost}</span>
                    </div>
                    <span className="text-white font-bold">{card.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-red-400">⚔️ {card.attack}</span>
                    <span className="text-green-400">❤️ {card.health}</span>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-3/4">
        <h2 className="text-2xl font-bold mb-4">Select Your Deck</h2>
        <div className="grid grid-cols-4 gap-4">
          {Object.entries(ARCHETYPES).map(([key, archetype]) => (
            <div
              key={key}
              className="bg-gray-100 p-4 rounded cursor-pointer hover:bg-gray-200"
              onClick={() => setSelectedArchetype(key)}
            >
              <div className="font-bold">{archetype.name}</div>
              <div>Archetype: {key}</div>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {previewDecks[key].map((card, index) => (
                  <CardDisplay key={index} card={card} />
                ))}
              </div>
            </div>
          ))}
        </div>
        {selectedArchetype && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">
                {ARCHETYPES[selectedArchetype].name} Deck Preview
              </h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-gray-700 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-1 rounded ${viewMode === 'grid' ? 'bg-blue-600' : 'hover:bg-gray-600'}`}
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-1 rounded ${viewMode === 'list' ? 'bg-blue-600' : 'hover:bg-gray-600'}`}
                  >
                    List
                  </button>
                </div>
                <button
                  onClick={handleConfirmSelection}
                  className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg font-bold"
                >
                  Confirm Selection
                </button>
              </div>
            </div>
            {renderDeckPreview(selectedArchetype)}
          </div>
        )}
        {expandedCard && (
          <CardModal card={expandedCard} onClose={() => setExpandedCard(null)} />
        )}
      </div>
    </div>
  );
};

export default DeckSelection; 