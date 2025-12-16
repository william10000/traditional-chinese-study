const collator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: "base",
});

export const getUniqueSortedValues = (values: string[]) =>
  Array.from(new Set(values)).sort((a, b) => collator.compare(a, b));

export const formatLessonLabel = (lesson: string) => {
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

export const lessonRank = (lesson: string) => {
  const l = lesson.trim();
  const m = l.match(/^L(\d+)$/i);
  if (m) return parseInt(m[1], 10);
  const t = l.match(/^Test(\d+)$/i);
  if (t) return 100 + parseInt(t[1], 10);
  return Number.MAX_SAFE_INTEGER;
};
