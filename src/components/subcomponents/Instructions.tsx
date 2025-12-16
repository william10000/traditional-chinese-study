export const Instructions = () => {
  return (
    <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-red-800 mb-4 text-center">
        使用說明 How to Use This App
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-bold text-red-700 mb-2">🎴 Flashcard Study:</h4>
          <ul className="space-y-1 text-gray-700 text-sm">
            <li>
              • Click cards to reveal/hide pinyin and English translations
            </li>
            <li>• Use arrow buttons to navigate between cards</li>
            <li>• Mark answers as correct/incorrect to track progress</li>
            <li>• Choose sequential or random study modes</li>
            <li>• Filter by specific lesson numbers</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-red-700 mb-2">
            📝 Writing Practice:
          </h4>
          <ul className="space-y-1 text-gray-700 text-sm">
            <li>• Generate printable worksheets with practice grids</li>
            <li>• Each character gets individual practice boxes</li>
            <li>• Traditional Chinese grid format with guidelines</li>
            <li>• Includes pinyin and English for reference</li>
            <li>• Perfect for handwriting practice</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
