export interface TextbookCharacter {
  id: string;
  char: string;
  pinyin: string;
  textbook: 'PEP';
  grade: '1' | '2' | '3' | '4' | '5' | '6';
  semester: '1' | '2';
  unit: number;
  lessonName: string;
}
