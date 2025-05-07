// DeckSelection component for choosing a deck/archetype and previewing cards
import React, { useState, useEffect } from 'react';
import { ARCHETYPES, generatePreviewDeck } from '../gameLogic/helpers';
import Card from './Card';
import CardModal from './CardModal';
import { Tooltip as ReactTooltip } from 'react-tooltip';

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
              onClick={() => setSelectedArchetype(key)}
              className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 
                ${selectedArchetype === key 
                  ? `${archetype.color} border-yellow-400 shadow-lg shadow-yellow-400/30` 
                  : `${archetype.color} border-gray-600 hover:border-gray-400`}`
            >
              <div className="flex items-center mb-2">
                <span className="text-3xl mr-2">{archetype.icon}</span>
                <h3 className="text-xl text-yellow-400">{archetype.name}</h3>
              </div>
              <p className="text-gray-400 mb-4">{archetype.description}</p>
              <div className="flex flex-wrap gap-2">
                {previewDecks[key].slice(0, 4).map(card => (
                  <div
                    key={card.id}
                    className="bg-gray-700 p-2 rounded shadow w-24 h-32 flex flex-col items-center justify-between cursor-pointer transform transition duration-300 hover:scale-105"
                    onClick={() => setSelectedArchetype(key)}
                    data-tooltip-id={`deck-card-${card.id}`}
                  >
                    <div className="text-yellow-400 text-sm truncate">{card.name}</div>
                    <span className="text-2xl">{archetype.icon}</span>
                    <div className="flex justify-between w-full text-white text-xs">
                      <span>⚔️ {card.attack}</span>
                      <span>❤️ {card.health}</span>
                    </div>
                    <div className="flex space-x-1 text-sm">
                      {card.hasTaunt && <span className="text-yellow-400" title="Taunt">🛡️</span>}
                      {card.hasBattlecast && <span className="text-purple-400" title="Battlecast">🔮</span>}
                      {card.hasRage && <span className="text-red-400" title="Rage">💢</span>}
                    </div>
                    <ReactTooltip id={`deck-card-${card.id}`} effect="solid">
                      <span>{card.description}</span>
                    </ReactTooltip>
                  </div>
                ))}
              </div>
              <button
                className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow-md transition duration-300"
                onClick={handleConfirmSelection}
              >
                Select {archetype.name} Deck
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeckSelection;