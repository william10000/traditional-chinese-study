import { useState, useEffect, useMemo, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Printer,
  Shuffle,
  Check,
  X,
  Volume2,
} from "lucide-react";
import { StudyStats } from "../types";
import { VOCABULARY } from "../data/vocabulary";

const ALL_OPTION = "all";

const collator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: "base",
});

const getUniqueSortedValues = (values: string[]) =>
  Array.from(new Set(values)).sort((a, b) => collator.compare(a, b));

const formatLessonLabel = (lesson: string) => {
  const normalized = lesson.trim();

  const lessonMatch = normalized.match(/^L(\d+)$/i);
  if (lessonMatch) {
    return `Lesson ${normalized.toUpperCase()} 第${lessonMatch[1]}課`;
  }

  const testMatch = normalized.match(/^Test(\d+)$/i);
  if (testMatch) {
    return `Test ${testMatch[1]} 測驗${testMatch[1]}`;
  }

  return normalized;
};

const lessonRank = (lesson: string) => {
  const l = lesson.trim();
  const m = l.match(/^L(\d+)$/i);
  if (m) return parseInt(m[1], 10);
  const t = l.match(/^Test(\d+)$/i);
  if (t) return 100 + parseInt(t[1], 10);
  return Number.MAX_SAFE_INTEGER;
};

type SentenceCard = { characters: string; pinyin: string; english: string };

const buildSentenceCards = (
  available: typeof VOCABULARY,
  desiredCount = 24
): SentenceCard[] => {
  if (!available.length) return [];

  const byChars = new Map(available.map((w) => [w.characters, w] as const));

  const pick = <T,>(arr: T[]) =>
    arr.length ? arr[Math.floor(Math.random() * arr.length)] : undefined;

  const fromChars = (chars: string[]) =>
    chars.map((c) => byChars.get(c)).filter(Boolean) as typeof available;

  const subjects = fromChars([
    "我",
    "你",
    "他",
    "她",
    "我們",
    "你們",
    "他們",
    "媽媽",
    "爸爸",
    "老師",
    "同學",
    "小朋友",
    "王",
    "李大文",
    "林東明",
    "陳心美",
    "張莉",
    "方友朋",
  ]);
  const advs = fromChars(["很", "也", "都"]);
  const verbsTransitive = fromChars(["喜歡", "吃", "喝", "看", "買", "要"]);
  const verbObjects = fromChars([
    "跑步",
    "跳舞",
    "聽音樂",
    "看書",
    "看電視",
    "打球",
    "游泳",
  ]);
  const objects = fromChars([
    "蘋果",
    "麵包",
    "牛奶",
    "書",
    "中文",
    "巧克力",
    "披薩",
    "蛋糕",
    "香蕉",
    "水果",
    "照片",
    "手機",
    "校車",
    "學校",
    "公園",
    "超級市場",
    "果汁",
    "湯",
    "糖果",
    "魚",
    "玉米",
    "米",
    "麵",
  ]);
  const adjectives = fromChars(["冷", "熱", "漂亮", "高興", "舒服", "新"]);
  const timeWords = fromChars(["今天", "明天", "昨天", "現在", "週末"]);
  const places = fromChars([
    "學校",
    "公園",
    "家",
    "外面",
    "裡面",
    "前面",
    "後面",
    "中間",
    "房間",
    "超級市場",
  ]);
  const zai = byChars.get("在");
  const ma = byChars.get("嗎");

  const joinChars = (parts: typeof available) =>
    parts.map((w) => w.characters).join("");
  const joinPinyin = (parts: typeof available) =>
    parts.map((w) => w.pinyin).join(" ");
  const joinEnglish = (parts: typeof available) =>
    parts.map((w) => w.english).join(" ");

  const cards: SentenceCard[] = [];
  const max = Math.max(6, desiredCount);
  let guard = 0;
  while (cards.length < max && guard++ < max * 10) {
    const templates: (() => SentenceCard | undefined)[] = [];

    // Template A: S (+adv?) + Vt + O (+ 嗎)?
    templates.push(() => {
      const s = pick(subjects);
      const v = pick(verbsTransitive);
      const o = pick(objects);
      if (!s || !v || !o) return undefined;
      const maybeAdv = Math.random() < 0.4 ? pick(advs) : undefined;
      const parts = [s, ...(maybeAdv ? [maybeAdv] : []), v, o];
      const endQuestion = ma && Math.random() < 0.25;
      const characters =
        joinChars(parts) + (endQuestion ? ma.characters + "？" : "。");
      const pinyin =
        joinPinyin(parts) + (endQuestion ? ` ${ma.pinyin} ?` : " .");
      const english = joinEnglish(parts) + (endQuestion ? " ?" : " .");
      return { characters, pinyin, english };
    });

    // Template B: S 很 + ADJ
    templates.push(() => {
      const s = pick(subjects);
      const h = advs.find((a) => a.characters === "很");
      const adj = pick(adjectives);
      if (!s || !h || !adj) return undefined;
      const parts = [s, h, adj];
      return {
        characters: joinChars(parts) + "。",
        pinyin: joinPinyin(parts) + " .",
        english: joinEnglish(parts) + " .",
      };
    });

    // Template C: (TIME?) S 在 PLACE + VO
    templates.push(() => {
      const t = Math.random() < 0.5 ? pick(timeWords) : undefined;
      const s = pick(subjects);
      const place = pick(places);
      const vo = pick(verbObjects);
      if (!s || !place || !vo || !zai) return undefined;
      const parts = [...(t ? [t] : []), s, zai, place, vo];
      return {
        characters: joinChars(parts) + "。",
        pinyin: joinPinyin(parts) + " .",
        english: joinEnglish(parts) + " .",
      };
    });

    const make = pick(templates)?.();
    if (make) {
      if (!cards.some((c) => c.characters === make.characters)) {
        cards.push(make);
      }
    }
  }
  return cards;
};

const ChineseLearningApp = () => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [kidMode, setKidMode] = useState<boolean>(false);
  const [selectedLevel, setSelectedLevel] = useState<string>(ALL_OPTION);
  const [selectedBook, setSelectedBook] = useState<string>(ALL_OPTION);
  const [selectedLesson, setSelectedLesson] = useState<string>(ALL_OPTION);
  const [studyMode, setStudyMode] = useState<"sequential" | "random">(
    "sequential"
  );
  const [cardType, setCardType] = useState<"word" | "sentence">("word");
  const [cardOrder, setCardOrder] = useState<number[]>([]);
  const [studyStats, setStudyStats] = useState<StudyStats>({
    correct: 0,
    total: 0,
  });

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
  ]);

  const generateWorksheet = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Traditional Chinese Writing Practice</title>
        <style>
          @page {
            size: A4;
            margin: 15mm;
          }
          @media print {
            body {
              margin: 0;
              -webkit-print-color-adjust: exact;
              color-adjust: exact;
            }
            .no-print { display: none !important; }
            .page-break { page-break-before: always; }
          }
          * {
            box-sizing: border-box;
          }
          body {
            font-family: 'Arial', 'Microsoft JhengHei', '微軟正黑體', sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
            line-height: 1.4;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #c41e3a;
            padding-bottom: 20px;
          }
          .header h1 {
            color: #c41e3a;
            font-size: 28px;
            margin: 0 0 10px 0;
            font-weight: bold;
          }
          .header p {
            color: #666;
            margin: 8px 0;
            font-size: 14px;
          }
          .practice-grid {
            display: inline-grid;
            grid-template-columns: repeat(10, 50px);
            grid-template-rows: 50px;
            gap: 2px;
            margin: 12px auto;
            border: 2px solid #333;
            background: #333;
            justify-content: center;
          }
          .grid-cell {
            width: 50px;
            height: 50px;
            background: white;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            border: 1px solid #ddd;
          }
          .grid-cell::before {
            content: '';
            position: absolute;
            width: 1px;
            height: 100%;
            left: 50%;
            background: #ddd;
            z-index: 1;
          }
          .grid-cell::after {
            content: '';
            position: absolute;
            height: 1px;
            width: 100%;
            top: 50%;
            background: #ddd;
            z-index: 1;
          }
          .example {
            font-size: 36px;
            font-weight: bold;
            z-index: 2;
            color: #c41e3a;
            position: relative;
          }
          .word-section {
            margin: 30px 0;
            page-break-inside: avoid;
            border: 2px solid #eee;
            padding: 20px;
            background: #fafafa;
            border-radius: 8px;
          }
          .word-info {
            margin-bottom: 20px;
            text-align: center;
            background: white;
            padding: 15px;
            border-radius: 6px;
            border: 1px solid #ddd;
          }
          .characters {
            font-size: 32px;
            font-weight: bold;
            color: #c41e3a;
            margin-bottom: 8px;
          }
          .details {
            font-size: 16px;
            margin: 5px 0;
          }
          .pinyin {
            color: #666;
            font-weight: 500;
            margin-right: 15px;
          }
          .english {
            color: #333;
            font-style: italic;
          }
          .lesson-tag {
            background: #c41e3a;
            color: white;
            padding: 4px 12px;
            border-radius: 15px;
            font-size: 12px;
            margin-left: 15px;
            font-weight: bold;
          }
          .grid-container {
            text-align: center;
            margin: 15px 0;
          }
          .char-label {
            font-size: 18px;
            color: #666;
            margin-bottom: 8px;
            font-weight: 500;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>傳統中文書法練習<br>Traditional Chinese Writing Practice</h1>
          <p><strong>課程 Lesson:</strong> ${
            selectedLesson === "all"
              ? "All Lessons 所有課程"
              : `Lesson ${selectedLesson} 第${selectedLesson.slice(1)}課`
          }</p>
          <p><strong>練習說明 Instructions:</strong> Trace the red example character in the first box, then practice writing it in the remaining boxes</p>
          <p><strong>日期 Date:</strong> _________________ <strong>姓名 Name:</strong> _________________</p>
        </div>

        ${filteredVocabulary
          .map(
            (word, wordIndex) => `
          ${
            wordIndex > 0 && wordIndex % 3 === 0
              ? '<div class="page-break"></div>'
              : ""
          }
          <div class="word-section">
            <div class="word-info">
              <div class="characters">${word.characters}</div>
              <div class="details">
                <span class="pinyin">${word.pinyin}</span>
                <span class="english">${word.english}</span>
                <span class="lesson-tag">${word.lesson}</span>
              </div>
            </div>

            ${word.characters
              .split("")
              .map(
                (char, charIndex) => `
              <div class="grid-container">
                <div class="char-label">Character ${
                  charIndex + 1
                }: ${char}</div>
                <div class="practice-grid">
                  <div class="grid-cell">
                    <span class="example">${char}</span>
                  </div>
                  ${Array.from(
                    { length: 9 },
                    () => '<div class="grid-cell"></div>'
                  ).join("")}
                </div>
              </div>
            `
              )
              .join("")}
          </div>
        `
          )
          .join("")}

        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
          <p>Generated by Traditional Chinese Learning App • 傳統中文學習應用程式</p>
          <p>Practice Tips: Write slowly and carefully • Follow the stroke order • Use proper posture</p>
        </div>
      </body>
      </html>
    `;

    // Create a new window/tab with the worksheet
    const newWindow = window.open("", "_blank");
    if (newWindow) {
      newWindow.document.open();
      newWindow.document.write(printContent);
      newWindow.document.close();

      // Focus the new window and trigger print dialog after content loads
      newWindow.focus();
      setTimeout(() => {
        if (newWindow && !newWindow.closed) {
          newWindow.print();
        }
      }, 1000);
    } else {
      alert("Please allow pop-ups to generate the worksheet. Then try again.");
    }
  };

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
              <div
                className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-800 px-3 py-2 rounded-lg"
                data-testid="filter-summary"
              >
                <span className="font-semibold">Current Filter:</span>
                <span>{filterSummary}</span>
              </div>
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 px-3 py-2 rounded-lg justify-between">
                <span className="font-semibold">Matching Words:</span>
                <span data-testid="filter-count" className="text-lg font-bold">
                  {filteredVocabulary.length}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <button
                onClick={generateWorksheet}
                className="w-full md:w-auto bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <Printer size={18} />
                Print Worksheet
              </button>
            </div>
          </div>
        )}

        {/* Study Stats */}
        {!kidMode && studyStats.total > 0 && (
          <div className="bg-white rounded-lg p-4 mb-8 shadow-lg text-center max-w-4xl mx-auto">
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

        {/* Flashcard */}
        {currentItem && (
          <section
            className="bg-white rounded-2xl shadow-2xl px-4 py-6 sm:px-8 sm:py-8 max-w-4xl mx-auto mb-8"
            data-testid="flashcard-section"
          >
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1 space-y-6">
                {/* Progress */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <span className="text-sm text-gray-600 text-center sm:text-left">
                    Card {currentCardIndex + 1} of {activeCards.length} •{" "}
                    {studyMode === "random" ? "Random 隨機" : "Sequential 順序"}
                  </span>
                  <div className="w-full sm:w-64">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-2 bg-gradient-to-r from-red-600 to-orange-500 rounded-full transition-all duration-500"
                        style={{
                          width: `${
                            ((currentCardIndex + 1) / activeCards.length) * 100
                          }%`,
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
                        onClick={() => markAnswer(false)}
                        className="bg-red-500 text-white px-5 py-3 rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center gap-2 shadow-lg w-full"
                      >
                        <X size={20} />
                        Incorrect
                      </button>
                      <button
                        onClick={() => markAnswer(true)}
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
                      onClick={playAudio}
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
                        onClick={prevCard}
                        className="flex flex-col items-center justify-center bg-white text-red-600 border border-red-200 rounded-xl py-3 px-2 hover:bg-red-100 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                        disabled={activeCards.length <= 1}
                        aria-label="Previous card"
                      >
                        <ChevronLeft size={20} />
                        <span className="mt-1 text-xs font-medium">Prev</span>
                      </button>
                      <button
                        onClick={nextCard}
                        className={`flex flex-col items-center justify-center bg-white text-red-600 border border-red-200 rounded-xl py-3 px-2 hover:bg-red-100 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed ${
                          showAnswer ? "opacity-30 cursor-not-allowed" : ""
                        }`}
                        disabled={activeCards.length <= 1 || showAnswer}
                        aria-label="Next card"
                      >
                        <ChevronRight size={20} />
                        <span className="mt-1 text-xs font-medium">
                          {showAnswer ? "Rate!" : "Skip"}
                        </span>
                      </button>
                      <button
                        onClick={shuffleCards}
                        className="flex flex-col items-center justify-center bg-white text-purple-600 border border-purple-200 rounded-xl py-3 px-2 hover:bg-purple-50 transition-colors shadow-sm"
                        aria-label="Shuffle cards"
                      >
                        <Shuffle size={18} />
                        <span className="mt-1 text-xs font-medium">
                          Shuffle
                        </span>
                      </button>
                      <button
                        onClick={resetCards}
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
                    {cardType === "word" &&
                      filteredVocabulary[cardOrder[currentCardIndex]] && (
                        <div className="text-sm text-gray-700 space-y-2">
                          <div className="flex justify-between">
                            <span className="font-medium">Lesson</span>
                            <span className="text-red-600">
                              {formatLessonLabel(
                                (
                                  filteredVocabulary[
                                    cardOrder[currentCardIndex]
                                  ] as any
                                )?.lesson
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Book</span>
                            <span>
                              {
                                (
                                  filteredVocabulary[
                                    cardOrder[currentCardIndex]
                                  ] as any
                                )?.book
                              }
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Level</span>
                            <span>
                              {
                                (
                                  filteredVocabulary[
                                    cardOrder[currentCardIndex]
                                  ] as any
                                )?.level
                              }
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Characters</span>
                            <span>
                              {
                                (
                                  filteredVocabulary[
                                    cardOrder[currentCardIndex]
                                  ] as any
                                )?.characters.length
                              }
                            </span>
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Vocabulary Overview Grid */}
        {!kidMode && (
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
                  onClick={() => {
                    const newIndex = cardOrder.findIndex((i) => i === index);
                    if (newIndex === -1) {
                      return;
                    }
                    setCurrentCardIndex(newIndex);
                    setShowAnswer(false);
                  }}
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
        )}

        {!hasCards && (
          <div className="mt-8 bg-yellow-100 text-yellow-800 text-center p-4 rounded-lg">
            尚未找到符合條件的卡片，請選擇其他課程。
          </div>
        )}

        {/* Instructions */}
        {!kidMode && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-red-800 mb-4 text-center">
              使用說明 How to Use This App
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-red-700 mb-2">
                  🎴 Flashcard Study:
                </h4>
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
        )}
      </div>
    </div>
  );
};

export default ChineseLearningApp;
