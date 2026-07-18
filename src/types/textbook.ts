export interface TextbookCharacter {
  id: string;
  char: string;
  pinyin: string;
  grade: '1' | '2' | '3' | '4' | '5' | '6';
  semester: 'UP' | 'DOWN';
  unit: string;
  lesson: string;
}
