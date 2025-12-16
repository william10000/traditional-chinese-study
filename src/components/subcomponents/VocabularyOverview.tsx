import { VocabularyWord } from "../../types";

interface VocabularyOverviewProps {
  filteredVocabulary: VocabularyWord[];
  selectedLesson: string;
  cardOrder: number[];
  currentCardIndex: number;
  onCardSelect: (index: number) => void;
  kidMode: boolean;
}

export const VocabularyOverview = ({
  filteredVocabulary,
  selectedLesson,
  cardOrder,
  currentCardIndex,
  onCardSelect,
  kidMode,
}: VocabularyOverviewProps) => {
  if (kidMode) return null;

  return (
    <div
      className="bg-white rounded-xl shadow-lg p-6"
      data-testid="vocab-overview-section"
    >
      <h3 className="text-2xl font-bold text-red-800 mb-6 text-center">
        詞彙總覽 Vocabulary Overview
        <span className="text-lg text-gray-600 ml-3">
          (
          {selectedLesson === "all"
            ? "All Lessons"
            : `Lesson ${selectedLesson}`}
          )
        </span>
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredVocabulary.map((word, index) => (
          <div
            key={index}
            className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 transform hover:scale-105 ${
              cardOrder[currentCardIndex] === index
                ? "bg-red-100 border-red-400 shadow-lg"
                : "bg-gray-50 hover:bg-blue-50 border-gray-200 hover:border-blue-300 shadow-md"
            }`}
            onClick={() => onCardSelect(index)}
          >
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-red-800">
                {word.characters}
              </div>
              <div className="text-sm text-red-600 font-medium">
                {word.pinyin}
              </div>
              <div className="text-sm text-gray-700">{word.english}</div>
              <div className="inline-block bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                {word.lesson}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
