import { useState, useEffect, useCallback } from "react";
import { StudyStats } from "../types";

export const useStudySession = (activeCards: { characters: string; pinyin: string; english: string }[]) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [studyMode, setStudyMode] = useState<"sequential" | "random">("sequential");
  const [cardOrder, setCardOrder] = useState<number[]>([]);
  const [studyStats, setStudyStats] = useState<StudyStats>({
    correct: 0,
    total: 0,
  });

  // Initialize card order when active cards change
  useEffect(() => {
    const indices = activeCards.map((_, index) => index);
    if (studyMode === "random") {
      setCardOrder(indices.sort(() => Math.random() - 0.5));
    } else {
      setCardOrder(indices);
    }
    setCurrentCardIndex(0);
    setShowAnswer(false);
  }, [activeCards, studyMode]);

  const hasCards = activeCards.length > 0 && cardOrder.length > 0;
  const currentWordIndex = hasCards ? cardOrder[currentCardIndex] : 0;
  const currentItem = hasCards ? activeCards[currentWordIndex] : undefined;

  const nextCard = useCallback(() => {
    if (!hasCards) {
      return;
    }
    const nextIndex = (currentCardIndex + 1) % cardOrder.length;
    setCurrentCardIndex(nextIndex);
    setShowAnswer(false);
  }, [hasCards, currentCardIndex, cardOrder.length]);

  const prevCard = useCallback(() => {
    if (!hasCards) {
      return;
    }
    const prevIndex =
      (currentCardIndex - 1 + cardOrder.length) % cardOrder.length;
    setCurrentCardIndex(prevIndex);
    setShowAnswer(false);
  }, [hasCards, currentCardIndex, cardOrder.length]);

  const resetCards = () => {
    const confirmed = window.confirm("Reset your progress? 確認重設進度？");
    if (!confirmed) {
      return;
    }
    setCurrentCardIndex(0);
    setShowAnswer(false);
    setStudyStats({ correct: 0, total: 0 });
  };

  const shuffleCards = () => {
    if (!hasCards) {
      return;
    }
    const shuffled = [...cardOrder].sort(() => Math.random() - 0.5);
    setCardOrder(shuffled);
    setCurrentCardIndex(0);
    setShowAnswer(false);
  };

  const markAnswer = useCallback(
    (isCorrect: boolean) => {
      if (!hasCards) {
        return;
      }
      setStudyStats((prev) => ({
        correct: prev.correct + (isCorrect ? 1 : 0),
        total: prev.total + 1,
      }));

      setTimeout(() => {
        setCurrentCardIndex((curr) => (curr + 1) % cardOrder.length);
        setShowAnswer(false);
      }, 500);
    },
    [hasCards, cardOrder.length]
  );

  const playAudio = () => {
    if (!currentItem) return;
    try {
      const utterance = new SpeechSynthesisUtterance(currentItem.characters);
      utterance.lang = "zh-TW";
      utterance.rate = 0.75; // 15% slower for elementary learners
      // Prefer zh-TW voice if available
      const voices = window.speechSynthesis?.getVoices?.() || [];
      const zhVoice = voices.find((v) =>
        v.lang?.toLowerCase?.().startsWith("zh")
      );
      if (zhVoice) {
        utterance.voice = zhVoice;
      }
      window.speechSynthesis?.speak(utterance);
    } catch {
      // no-op if speech synthesis not available
    }
  };

  return {
    currentCardIndex,
    setCurrentCardIndex, // Exported for vocabulary grid click
    showAnswer,
    setShowAnswer,
    studyMode,
    setStudyMode,
    cardOrder,
    studyStats,
    setStudyStats, // Exported for reset if needed externally
    hasCards,
    currentItem,
    nextCard,
    prevCard,
    resetCards,
    shuffleCards,
    markAnswer,
    playAudio,
  };
};
