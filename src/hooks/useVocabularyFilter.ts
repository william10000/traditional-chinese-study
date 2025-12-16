import { useState, useMemo, useEffect } from "react";
import { VOCABULARY } from "../data/vocabulary";
import {
  getUniqueSortedValues,
  formatLessonLabel,
  lessonRank,
} from "../utils/textUtils";
import { buildSentenceCards } from "../utils/sentenceGenerator";

const ALL_OPTION = "all";

export const useVocabularyFilter = () => {
  const [selectedLevel, setSelectedLevel] = useState<string>(ALL_OPTION);
  const [selectedBook, setSelectedBook] = useState<string>(ALL_OPTION);
  const [selectedLesson, setSelectedLesson] = useState<string>(ALL_OPTION);
  const [cardType, setCardType] = useState<"word" | "sentence">("word");

  const levelOptions = useMemo(
    () => getUniqueSortedValues(VOCABULARY.map((word) => word.level)),
    []
  );

  const bookOptions = useMemo(() => {
    if (selectedLevel === ALL_OPTION) {
      return [] as string[];
    }

    return getUniqueSortedValues(
      VOCABULARY.filter((word) => word.level === selectedLevel).map(
        (word) => word.book
      )
    );
  }, [selectedLevel]);

  const lessonOptions = useMemo(() => {
    if (selectedLevel === ALL_OPTION || selectedBook === ALL_OPTION) {
      return [] as string[];
    }

    const lessonsByLevelAndBook = getUniqueSortedValues(
      VOCABULARY.filter(
        (word) => word.level === selectedLevel && word.book === selectedBook
      ).map((word) => word.lesson)
    );

    if (lessonsByLevelAndBook.length > 0) {
      return lessonsByLevelAndBook;
    }

    return getUniqueSortedValues(
      VOCABULARY.filter((word) => word.level === selectedLevel).map(
        (word) => word.lesson
      )
    );
  }, [selectedLevel, selectedBook]);

  const filteredVocabulary = useMemo(() => {
    return VOCABULARY.filter((word) => {
      if (selectedLevel !== ALL_OPTION && word.level !== selectedLevel) {
        return false;
      }
      if (selectedBook !== ALL_OPTION && word.book !== selectedBook) {
        return false;
      }
      if (selectedLesson !== ALL_OPTION && word.lesson !== selectedLesson) {
        return false;
      }
      return true;
    });
  }, [selectedLevel, selectedBook, selectedLesson]);

  const availableUpToLesson = useMemo(() => {
    const base = VOCABULARY.filter((word) => {
      if (selectedLevel !== ALL_OPTION && word.level !== selectedLevel)
        return false;
      if (selectedBook !== ALL_OPTION && word.book !== selectedBook)
        return false;
      return true;
    });
    if (selectedLesson === ALL_OPTION) return base;
    const cutoff = lessonRank(selectedLesson);
    return base.filter((w) => lessonRank(w.lesson) <= cutoff);
  }, [selectedLevel, selectedBook, selectedLesson]);

  const sentenceCards = useMemo(() => {
    const desired = Math.min(
      48,
      Math.max(12, Math.floor(availableUpToLesson.length * 0.6))
    );
    return buildSentenceCards(availableUpToLesson, desired);
  }, [availableUpToLesson]);

  const activeCards = useMemo(() => {
    return cardType === "word"
      ? filteredVocabulary.map((w) => ({
          characters: w.characters,
          pinyin: w.pinyin,
          english: w.english,
        }))
      : sentenceCards;
  }, [cardType, filteredVocabulary, sentenceCards]);

  useEffect(() => {
    setSelectedBook(ALL_OPTION);
    setSelectedLesson(ALL_OPTION);
  }, [selectedLevel]);

  useEffect(() => {
    setSelectedLesson(ALL_OPTION);
  }, [selectedBook]);

  const filterSummary = useMemo(() => {
    if (selectedLevel === ALL_OPTION) {
      return "All Levels 所有程度";
    }

    const parts = [`Level ${selectedLevel} 程度`];

    if (selectedBook !== ALL_OPTION) {
      parts.push(`Book ${selectedBook} 冊`);
    } else if (bookOptions.length > 0) {
      parts.push("All Books 所有冊別");
    }

    if (selectedLesson !== ALL_OPTION) {
      parts.push(formatLessonLabel(selectedLesson));
    } else if (lessonOptions.length > 0) {
      parts.push("All Lessons 所有課程");
    }

    return parts.join(" • ");
  }, [
    selectedLevel,
    selectedBook,
    selectedLesson,
    bookOptions.length,
    lessonOptions.length,
  ]);

  return {
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
  };
};
