import { useState, useEffect } from "react";
import { generateWorksheet as generateWorksheetUtil } from "../utils/worksheetGenerator";
import { useVocabularyFilter } from "../hooks/useVocabularyFilter";
import { useStudySession } from "../hooks/useStudySession";
import { FilterPanel } from "./subcomponents/FilterPanel";
import { FlashcardSection } from "./subcomponents/FlashcardSection";
import { VocabularyOverview } from "./subcomponents/VocabularyOverview";
import { Instructions } from "./subcomponents/Instructions";

const ChineseLearningApp = () => {
  const [kidMode, setKidMode] = useState<boolean>(false);

  const {
    selectedLevel,
    setSelectedLevel,
    selectedBook,
    setSelectedBook,
    selectedLesson,
    setSelectedLesson,
    cardType,
    setCardType,
    levelOptions,
    bookOptions,
    lessonOptions,
    filteredVocabulary,
    activeCards,
    filterSummary,
    ALL_OPTION,
  } = useVocabularyFilter();

  const {
    currentCardIndex,
    setCurrentCardIndex,
    showAnswer,
    setShowAnswer,
    studyMode,
    setStudyMode,
    cardOrder,
    studyStats,
    hasCards,
    currentItem,
    nextCard,
    prevCard,
    resetCards,
    shuffleCards,
    markAnswer,
    playAudio,
  } = useStudySession(activeCards);

  // Persist Kid Mode; default ON for first-time visitors
  useEffect(() => {
    try {
      const saved = localStorage.getItem("kidMode");
      if (saved === null) {
        setKidMode(true);
      } else {
        setKidMode(saved === "true");
      }
    } catch {
      setKidMode(true);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("kidMode", String(kidMode));
    } catch {
      // ignore
    }
  }, [kidMode]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input (though we don't have inputs currently, good practice)
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key) {
        case " ": // Spacebar
        case "Enter":
          e.preventDefault();
          if (!showAnswer) {
            setShowAnswer(true);
          } else {
            // If answer is shown, Enter could trigger "Got It" for fast flow
            markAnswer(true);
          }
          break;
        case "ArrowLeft":
          prevCard();
          break;
        case "ArrowRight":
          if (!showAnswer) {
            nextCard(); // Skip if answer not shown
          }
          break;
        case "1":
          if (showAnswer) markAnswer(false);
          break;
        case "2":
          if (showAnswer) markAnswer(true);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    hasCards,
    showAnswer,
    currentCardIndex,
    cardOrder,
    markAnswer,
    nextCard,
    prevCard,
    setShowAnswer,
  ]);

  const generateWorksheet = () => {
    generateWorksheetUtil(selectedLesson, filteredVocabulary);
  };

  const handleCardSelect = (index: number) => {
    const newIndex = cardOrder.findIndex((i) => i === index);
    if (newIndex === -1) {
      return;
    }
    setCurrentCardIndex(newIndex);
    setShowAnswer(false);
  };

  const currentCardDetails =
    cardType === "word" && hasCards
      ? filteredVocabulary[cardOrder[currentCardIndex]]
      : undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-orange-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-red-800 mb-3 tracking-wide">
            傳統中文學習 Traditional Chinese Learning
          </h1>
          <p className="text-red-600 text-lg">
            索引：生詞／短語 - Index: Vocabulary Words / Phrases
          </p>

          {/* Kid Mode toggle */}
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              data-testid="kid-mode-toggle"
              aria-pressed={kidMode}
              onClick={() => setKidMode((prev) => !prev)}
              className={`px-5 py-2 rounded-full text-sm font-semibold shadow transition-colors ${
                kidMode
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              Kid Mode {kidMode ? "ON" : "OFF"}
            </button>
          </div>
        </div>

        {/* Controls Panel */}
        {!kidMode && (
          <FilterPanel
            selectedLevel={selectedLevel}
            setSelectedLevel={setSelectedLevel}
            selectedBook={selectedBook}
            setSelectedBook={setSelectedBook}
            selectedLesson={selectedLesson}
            setSelectedLesson={setSelectedLesson}
            levelOptions={levelOptions}
            bookOptions={bookOptions}
            lessonOptions={lessonOptions}
            studyMode={studyMode}
            setStudyMode={setStudyMode}
            cardType={cardType}
            setCardType={setCardType}
            filterSummary={filterSummary}
            filteredVocabulary={filteredVocabulary}
            onGenerateWorksheet={generateWorksheet}
            ALL_OPTION={ALL_OPTION}
          />
        )}

        {/* Kid Mode Study Stats */}
        {kidMode && studyStats.total > 0 && (
          <div
            className="bg-white rounded-lg p-4 mb-8 shadow-lg text-center max-w-4xl mx-auto"
            data-testid="kid-mode-study-stats"
          >
            <div className="text-lg font-semibold text-gray-700">
              Study Progress: {studyStats.correct}/{studyStats.total} correct
              <span className="text-green-600 ml-2">
                (
                {studyStats.total > 0
                  ? Math.round((studyStats.correct / studyStats.total) * 100)
                  : 0}
                %)
              </span>
            </div>
          </div>
        )}
      
        {kidMode && hasCards && (
          <FlashcardSection
            currentItem={currentItem}
            currentCardIndex={currentCardIndex}
            totalCards={activeCards.length}
            studyMode={studyMode}
            showAnswer={showAnswer}
            setShowAnswer={setShowAnswer}
            kidMode={kidMode}
            onNext={nextCard}
            onPrev={prevCard}
            onShuffle={shuffleCards}
            onReset={resetCards}
            onMarkAnswer={markAnswer}
            onPlayAudio={playAudio}
            cardType={cardType}
            cardDetails={currentCardDetails}
          />
        )}

        {!kidMode && (
          <VocabularyOverview
            filteredVocabulary={filteredVocabulary}
            selectedLesson={selectedLesson}
            cardOrder={cardOrder}
            currentCardIndex={currentCardIndex}
            onCardSelect={handleCardSelect}
            kidMode={kidMode}
          />
        )}

        {!hasCards && (
          <div className="mt-8 bg-yellow-100 text-yellow-800 text-center p-4 rounded-lg">
            尚未找到符合條件的卡片，請選擇其他課程。
          </div>
        )}

        {/* Instructions */}
        {!kidMode && <Instructions />}
      </div>
    </div>
  );
};

export default ChineseLearningApp;
