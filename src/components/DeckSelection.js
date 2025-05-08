// DeckSelection component for choosing a deck/archetype and previewing cards
import React, { useState, useEffect } from 'react';
import { ARCHETYPES, generatePreviewDeck } from '../gameLogic/helpers';
import CardDisplay from './CardDisplay';
import CardModal from './CardModal';

const DeckSelection = ({ onSelectDeck, onBack }) => {
  const [selectedArchetype, setSelectedArchetype] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
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
    if (!archetypeKey || !previewDecks[archetypeKey]) {
      return <div className="text-gray-500">No cards available for this deck.</div>;
    }

    const deck = previewDecks[archetypeKey];
    if (!Array.isArray(deck)) {
      console.error('Invalid deck format:', deck);
      return <div className="text-red-500">Error: Invalid deck format</div>;
    }

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-3">Deck Cards ({deck.length})</h3>
          <div className={`${viewMode === 'grid' ? 'grid grid-cols-5 gap-4' : 'space-y-2'}`}>
            {deck.map((card, index) => {
              if (!card || !card.type) {
                console.error('Invalid card in deck:', card);
                return null;
              }
              return (
                <div 
                  key={`${card.type}-${index}`}
                  className="cursor-pointer transform transition-transform hover:scale-105"
                  onClick={() => setExpandedCard(card)}
                >
                  <CardDisplay card={card} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Choose Your Deck</h1>
          <button
            onClick={onBack}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg"
          >
            Back to Menu
          </button>
        </div>
        
        {/* Archetype selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Object.entries(ARCHETYPES).map(([key, archetype]) => (
            <div
              key={key}
              className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 
                ${selectedArchetype === key 
                  ? `${archetype.color} border-yellow-400 shadow-lg shadow-yellow-400/30` 
                  : `${archetype.color} border-gray-600 hover:border-gray-400`}`}
              onClick={() => setSelectedArchetype(key)}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl">{archetype.icon}</span>
                <h3 className="text-2xl font-bold">{archetype.name}</h3>
              </div>
              <p className="text-gray-300">{archetype.description}</p>
            </div>
          ))}
        </div>

        {/* Deck preview section */}
        {selectedArchetype && (
          <div className="bg-gray-800/50 rounded-xl p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">
                {ARCHETYPES[selectedArchetype]?.name || 'Selected'} Deck Preview
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
                  disabled={!selectedArchetype}
                  className={`px-6 py-2 rounded-lg font-bold ${
                    selectedArchetype 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-gray-600 cursor-not-allowed'
                  }`}
                >
                  Confirm Selection
                </button>
              </div>
            </div>
            {renderDeckPreview(selectedArchetype)}
          </div>
        )}

        {/* Expanded card modal */}
        {expandedCard && (
          <CardModal card={expandedCard} onClose={() => setExpandedCard(null)} />
        )}
      </div>
    </div>
  );
};

export default DeckSelection; 