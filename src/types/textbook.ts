export interface TextbookCharacter {
  id: string;
  char: string;
  pinyin: string;
  grade: '1' | '2' | '3' | '4' | '5' | '6';
  semester: 'UP' | 'DOWN';
  unit: string;
  lesson: string;
}

/**
 * Temporary compatibility contract for the pre-existing partial
 * second-grade pilot asset. Remove when that batch is regenerated.
 */
export interface LegacyTextbookCharacter {
  id: string;
  char: string;
  pinyin: string;
  textbook: 'PEP';
  grade: '1' | '2' | '3' | '4' | '5' | '6';
  semester: '1' | '2';
  unit: number;
  lessonName: string;
}
