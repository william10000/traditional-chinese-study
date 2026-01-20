import { Printer } from "lucide-react";
import { formatLessonLabel } from "../../utils/textUtils";
import { VocabularyWord } from "../../types";

interface FilterPanelProps {
  selectedLevel: string;
  setSelectedLevel: (value: string) => void;
  selectedBook: string;
  setSelectedBook: (value: string) => void;
  selectedLesson: string;
  setSelectedLesson: (value: string) => void;
  levelOptions: string[];
  bookOptions: string[];
  lessonOptions: string[];
  studyMode: "sequential" | "random";
  setStudyMode: (mode: "sequential" | "random") => void;
  cardType: "word" | "sentence";
  setCardType: (type: "word" | "sentence") => void;
  filterSummary: string;
  filteredVocabulary: VocabularyWord[];
  onGenerateWorksheet: () => void;
  ALL_OPTION: string;
}

export const FilterPanel = ({
  selectedLevel,
  setSelectedLevel,
  selectedBook,
  setSelectedBook,
  selectedLesson,
  setSelectedLesson,
  levelOptions,
  bookOptions,
  lessonOptions,
  studyMode,
  setStudyMode,
  cardType,
  setCardType,
  filterSummary,
  filteredVocabulary,
  onGenerateWorksheet,
  ALL_OPTION,
}: FilterPanelProps) => {
  return (
    <div
      className="bg-white rounded-xl shadow-lg p-6 mb-8"
      data-testid="filter-panel"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        {/* Level Filter */}
        <div className="space-y-2">
          <label
            htmlFor="level-filter"
            className="block text-sm font-medium text-gray-700"
          >
            Select Level:
          </label>
          <select
            id="level-filter"
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="w-full px-3 py-2 border border-red-300 rounded-lg bg-white text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value={ALL_OPTION}>All Levels 所有程度</option>
            {levelOptions.map((level) => (
              <option key={level} value={level}>
                Level {level}
              </option>
            ))}
          </select>
        </div>

        {/* Book Filter */}
        <div className="space-y-2">
          <label
            htmlFor="book-filter"
            className="block text-sm font-medium text-gray-700"
          >
            Select Book:
          </label>
          <select
            id="book-filter"
            value={selectedBook}
            onChange={(e) => setSelectedBook(e.target.value)}
            disabled={selectedLevel === ALL_OPTION}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
              selectedLevel === ALL_OPTION
                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                : "bg-white text-red-800 border-red-300"
            }`}
          >
            <option value={ALL_OPTION}>All Books 所有冊別</option>
            {bookOptions.map((book) => (
              <option key={book} value={book}>
                Book {book}
              </option>
            ))}
          </select>
        </div>

        {/* Lesson Filter */}
        <div className="space-y-2">
          <label
            htmlFor="lesson-filter"
            className="block text-sm font-medium text-gray-700"
          >
            Select Lesson:
          </label>
          <select
            id="lesson-filter"
            value={selectedLesson}
            onChange={(e) => setSelectedLesson(e.target.value)}
            disabled={
              selectedLevel === ALL_OPTION || selectedBook === ALL_OPTION
            }
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
              selectedLevel === ALL_OPTION || selectedBook === ALL_OPTION
                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                : "bg-white text-red-800 border-red-300"
            }`}
          >
            <option value={ALL_OPTION}>All Lessons 所有課程</option>
            {lessonOptions.map((lesson) => (
              <option key={lesson} value={lesson}>
                {formatLessonLabel(lesson)}
              </option>
            ))}
          </select>
        </div>

        {/* Study Mode */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Study Mode:
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setStudyMode("sequential")}
              className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                studyMode === "sequential"
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Sequential
            </button>
            <button
              onClick={() => setStudyMode("random")}
              className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                studyMode === "random"
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Random
            </button>
          </div>
        </div>
      </div>

      {/* Card Type */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div className="space-y-2 md:col-start-4">
          <label className="block text-sm font-medium text-gray-700">
            Card Type:
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setCardType("word")}
              className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                cardType === "word"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Vocabulary
            </button>
            <button
              onClick={() => setCardType("sentence")}
              className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                cardType === "sentence"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Sentences
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 px-3 py-2 rounded-lg justify-between">
          <span className="font-semibold">Matching Words:</span>
          <span data-testid="filter-count" className="text-lg font-bold">
            {filteredVocabulary.length}
          </span>
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={onGenerateWorksheet}
          className="w-full md:w-auto bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 shadow-md"
        >
          <Printer size={18} />
          Print Worksheet
        </button>
      </div>
    </div>
  );
};
