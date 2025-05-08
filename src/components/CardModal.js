// CardModal component for displaying detailed card/unit info in a modal
import React from 'react';
import CardDisplay from './CardDisplay';

const CardModal = ({ card, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <CardDisplay card={card} />
        <button
          onClick={onClose}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default CardModal; 