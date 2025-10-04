export interface VocabularyWord {
  pinyin: string;
  characters: string;
  english: string;
  lesson: string;
  book: string;
  level: string;
}

export interface StudyStats {
  correct: number;
  total: number;
}
