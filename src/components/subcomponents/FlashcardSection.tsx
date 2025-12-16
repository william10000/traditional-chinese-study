import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Shuffle,
  Check,
  X,
  Volume2,
} from "lucide-react";
import { formatLessonLabel } from "../../utils/textUtils";
import { VocabularyWord } from "../../types";

interface FlashcardSectionProps {
  currentItem?: { characters: string; pinyin: string; english: string };
  currentCardIndex: number;
  totalCards: number;
  studyMode: "sequential" | "random";
  showAnswer: boolean;
  setShowAnswer: (show: boolean) => void;
  kidMode: boolean;
  onNext: () => void;
  onPrev: () => void;
  onShuffle: () => void;
  onReset: () => void;
  onMarkAnswer: (correct: boolean) => void;
  onPlayAudio: () => void;
  cardType: "word" | "sentence";
  cardDetails?: VocabularyWord;
}

export const FlashcardSection = ({
  currentItem,
  currentCardIndex,
  totalCards,
  studyMode,
  showAnswer,
  setShowAnswer,
  kidMode,
  onNext,
  onPrev,
  onShuffle,
  onReset,
  onMarkAnswer,
  onPlayAudio,
  cardType,
  cardDetails,
}: FlashcardSectionProps) => {
  if (!currentItem) return null;

  return (
    <section
      className="bg-white rounded-2xl shadow-2xl px-4 py-6 sm:px-8 sm:py-8 max-w-4xl mx-auto mb-8"
      data-testid="flashcard-section"
    >
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-6">
          {/* Progress */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <span className="text-sm text-gray-600 text-center sm:text-left">
              Card {currentCardIndex + 1} of {totalCards} •{" "}
              {studyMode === "random" ? "Random 隨機" : "Sequential 順序"}
            </span>
            <div className="w-full sm:w-64">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-2 bg-gradient-to-r from-red-600 to-orange-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${((currentCardIndex + 1) / totalCards) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Answer Buttons (when answer is shown, within flashcard container) */}
          {showAnswer && (
            <div
              className="bg-white rounded-xl shadow-lg p-6"
              data-testid="answer-buttons-container"
            >
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => onMarkAnswer(false)}
                  className="bg-red-500 text-white px-5 py-3 rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center gap-2 shadow-lg w-full"
                >
                  <X size={20} />
                  Incorrect
                </button>
                <button
                  onClick={() => onMarkAnswer(true)}
                  className="bg-green-500 text-white px-5 py-3 rounded-xl hover:bg-green-600 transition-colors flex items-center justify-center gap-2 shadow-lg w-full"
                >
                  <Check size={20} />
                  Got It!
                </button>
              </div>
            </div>
          )}

          {/* Card Content */}
          <div
            className="relative text-center cursor-pointer min-h-[260px] sm:min-h-[340px] flex flex-col justify-center border-2 border-dashed border-red-100 rounded-2xl bg-gradient-to-b from-white to-red-50 hover:border-red-300 transition-colors shadow-inner"
            data-testid="flashcard-card"
            role="button"
            tabIndex={0}
            aria-label="Flashcard"
            onClick={() => setShowAnswer(!showAnswer)}
          >
            {!showAnswer ? (
              <div className="space-y-6 sm:space-y-8">
                <div
                  className="text-7xl sm:text-8xl font-bold text-red-800 tracking-wide"
                  data-testid="flashcard-character"
                >
                  {currentItem.characters}
                </div>
                <p className="text-gray-500 text-base sm:text-lg flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 animate-pulse">
                  <span>
                    Click to reveal pinyin & meaning • 點擊顯示拼音和含義
                  </span>
                </p>
              </div>
            ) : (
              <div className="space-y-5 sm:space-y-6">
                <div
                  className="text-7xl sm:text-8xl font-bold text-red-800 tracking-wide"
                  data-testid="flashcard-character"
                >
                  {currentItem.characters}
                </div>
                <div className="text-2xl sm:text-3xl text-red-600 font-medium tracking-wider">
                  {currentItem.pinyin}
                </div>
                <div className="text-3xl sm:text-4xl text-gray-800 font-semibold px-4 py-2 bg-yellow-100 rounded-lg inline-block">
                  {currentItem.english}
                </div>
                <p className="text-gray-500 text-base sm:text-lg">
                  Click to hide answer • 點擊隱藏答案
                </p>
              </div>
            )}
          </div>

          {/* Kid Mode Primary Controls */}
          {kidMode && (
            <div className="mt-6" data-testid="kid-mode-primary-controls">
              <button
                onClick={onPlayAudio}
                className="bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg w-full"
                aria-label="Play audio"
                data-testid="play-audio-button"
              >
                <Volume2 size={20} />
                Play Audio
              </button>
            </div>
          )}
        </div>

        {!kidMode && (
          <div className="flex flex-col justify-between lg:w-64 space-y-4">
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4 space-y-3 shadow-inner">
              <h4 className="text-sm font-semibold text-red-700 text-center">
                Quick Actions
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={onPrev}
                  className="flex flex-col items-center justify-center bg-white text-red-600 border border-red-200 rounded-xl py-3 px-2 hover:bg-red-100 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                  disabled={totalCards <= 1}
                  aria-label="Previous card"
                >
                  <ChevronLeft size={20} />
                  <span className="mt-1 text-xs font-medium">Prev</span>
                </button>
                <button
                  onClick={onNext}
                  className={`flex flex-col items-center justify-center bg-white text-red-600 border border-red-200 rounded-xl py-3 px-2 hover:bg-red-100 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed ${
                    showAnswer ? "opacity-30 cursor-not-allowed" : ""
                  }`}
                  disabled={totalCards <= 1 || showAnswer}
                  aria-label="Next card"
                >
                  <ChevronRight size={20} />
                  <span className="mt-1 text-xs font-medium">
                    {showAnswer ? "Rate!" : "Skip"}
                  </span>
                </button>
                <button
                  onClick={onShuffle}
                  className="flex flex-col items-center justify-center bg-white text-purple-600 border border-purple-200 rounded-xl py-3 px-2 hover:bg-purple-50 transition-colors shadow-sm"
                  aria-label="Shuffle cards"
                >
                  <Shuffle size={18} />
                  <span className="mt-1 text-xs font-medium">Shuffle</span>
                </button>
                <button
                  onClick={onReset}
                  className="flex flex-col items-center justify-center bg-white text-gray-700 border border-gray-200 rounded-xl py-3 px-2 hover:bg-gray-100 transition-colors shadow-sm"
                  aria-label="Reset progress"
                  data-testid="quick-actions-reset"
                >
                  <RotateCcw size={18} />
                  <span className="mt-1 text-xs font-medium">Reset</span>
                </button>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 space-y-3 shadow-inner">
              <h4 className="text-sm font-semibold text-orange-700 text-center">
                Card Details
              </h4>
              {cardType === "word" && cardDetails && (
                <div className="text-sm text-gray-700 space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Lesson</span>
                    <span className="text-red-600">
                      {formatLessonLabel(cardDetails.lesson)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Book</span>
                    <span>{cardDetails.book}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Level</span>
                    <span>{cardDetails.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Characters</span>
                    <span>{cardDetails.characters.length}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
