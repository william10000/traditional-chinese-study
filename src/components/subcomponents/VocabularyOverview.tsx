import { useMemo } from "react";
import { VocabularyWord } from "../../types";

interface VocabularyOverviewProps {
  filteredVocabulary: VocabularyWord[];
  selectedLesson: string;
  cardOrder: number[];
  currentCardIndex: number;
  onCardSelect: (index: number) => void;
  kidMode: boolean;
}

// Helper to extract lesson number for sorting (e.g., "L7" -> 7, "Test1" -> 100)
const getLessonSortKey = (lesson: string): number => {
  if (lesson.startsWith("L")) {
    return parseInt(lesson.slice(1), 10) || 0;
  }
  if (lesson.startsWith("Test")) {
    return 100 + (parseInt(lesson.slice(4), 10) || 0);
  }
  return 999;
};

export const VocabularyOverview = ({
  filteredVocabulary,
  selectedLesson,
  cardOrder,
  currentCardIndex,
  onCardSelect,
  kidMode,
}: VocabularyOverviewProps) => {
  // Create sorted vocabulary with original indices preserved
  const sortedVocabulary = useMemo(() => {
    return filteredVocabulary
      .map((word, originalIndex) => ({ word, originalIndex }))
      .sort((a, b) => {
        // First sort by lesson
        const lessonDiff =
          getLessonSortKey(a.word.lesson) - getLessonSortKey(b.word.lesson);
        if (lessonDiff !== 0) return lessonDiff;
        // Then sort alphabetically by pinyin
        return a.word.pinyin.localeCompare(b.word.pinyin);
      });
  }, [filteredVocabulary]);

  if (kidMode) return null;

  return (
    <div
      className="bg-white rounded-xl shadow-lg p-4 sm:p-6"
      data-testid="vocab-overview-section"
    >
      <h3 className="text-xl sm:text-2xl font-bold text-red-800 mb-4 text-center">
        詞彙總覽 Vocabulary Overview
        <span className="text-sm sm:text-lg text-gray-600 ml-2">
          ({filteredVocabulary.length} words
          {selectedLesson !== "all" && ` • Lesson ${selectedLesson}`})
        </span>
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-red-200 text-left">
              <th className="py-2 px-1 sm:px-2 text-red-800 font-semibold text-center w-8">
                #
              </th>
              <th className="py-2 px-2 sm:px-3 text-red-800 font-semibold">
                Lesson
              </th>
              <th className="py-2 px-2 sm:px-3 text-red-800 font-semibold">
                漢字
              </th>
              <th className="py-2 px-2 sm:px-3 text-red-800 font-semibold">
                Pinyin
              </th>
              <th className="py-2 px-2 sm:px-3 text-red-800 font-semibold hidden sm:table-cell">
                English
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedVocabulary.map(({ word, originalIndex }, rowIndex) => {
              const isCurrentCard = cardOrder[currentCardIndex] === originalIndex;
              return (
                <tr
                  key={originalIndex}
                  className={`border-b border-gray-100 cursor-pointer transition-colors ${
                    isCurrentCard
                      ? "bg-red-100 font-medium"
                      : "hover:bg-blue-50"
                  }`}
                  onClick={() => onCardSelect(originalIndex)}
                >
                  <td className="py-1.5 px-1 sm:px-2 text-gray-400 text-center text-xs">
                    {rowIndex + 1}
                  </td>
                  <td className="py-1.5 px-2 sm:px-3">
                    <span className="inline-block bg-red-600 text-white text-xs px-1.5 py-0.5 rounded">
                      {word.lesson}
                    </span>
                  </td>
                  <td className="py-1.5 px-2 sm:px-3 text-lg sm:text-xl font-bold text-red-800">
                    {word.characters}
                  </td>
                  <td className="py-1.5 px-2 sm:px-3 text-red-600">
                    {word.pinyin}
                  </td>
                  <td className="py-1.5 px-2 sm:px-3 text-gray-700 hidden sm:table-cell">
                    {word.english}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
