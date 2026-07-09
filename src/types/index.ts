/**
 * Textbook version enum. PEP means People's Education Press.
 */
export type TextbookVersion = 'PEP';

/**
 * Grade and semester enums.
 */
export type GradeLevel = '1' | '2' | '3' | '4' | '5' | '6';
export type SemesterType = 'UP' | 'DOWN';

/**
 * Raw textbook character metadata contract.
 */
export interface CharacterMeta {
  id: string;
  char: string;
  pinyin: string;
  strokes: string[];
  components: string[];
  version: TextbookVersion;
  grade: GradeLevel;
  semester: SemesterType;
  unit: number;
}

/**
 * Workbook visual layout configuration contract.
 */
export interface WorkbookConfig {
  showGrid: boolean;
  showPinyin: boolean;
  showStrokeGuide: boolean;
  textColor: string;
  traceColor: string;
}

/**
 * Core output mode.
 */
export type OutputMode = 'PRACTICE' | 'PUZZLE';

/**
 * Linked textbook filter state.
 */
export interface TextbookFilter {
  version: TextbookVersion;
  grade: GradeLevel;
  semester: SemesterType;
  selectedUnit: number | null;
}

/**
 * Global/core state tree contract.
 */
export interface AppState {
  filter: TextbookFilter;
  characterPool: CharacterMeta[];
  selectedCharIds: Set<string>;
  outputMode: OutputMode;
  config: WorkbookConfig;
  setFilter: (updater: Partial<AppState['filter']>) => void;
  toggleCharacter: (id: string) => void;
  selectAllCharacters: (ids: string[]) => void;
  clearAllCharacters: () => void;
  setOutputMode: (mode: OutputMode) => void;
  updateConfig: (updater: Partial<WorkbookConfig>) => void;
}
