import { useSyncExternalStore } from 'react';
import { pepY1S1Characters } from '../data/textbooks/pep-y1-s1.js';
import { pepY1S2Characters } from '../data/textbooks/pep-y1-s2.js';
import { pepY2S1Characters } from '../data/textbooks/pep-y2-s1.js';
import { pepY2S2Characters } from '../data/textbooks/pep-y2-s2.js';
import type { AppState, CharacterMeta, WorkbookConfig } from '../types/index.js';
import type { TextbookCharacter } from '../types/textbook.js';

type Listener = () => void;
type StoreSelector<T> = (state: AppState) => T;

const unitNumberByLabel: Record<TextbookCharacter['unit'], number> = {
  第一单元: 1,
  第二单元: 2,
  第三单元: 3,
  第四单元: 4,
  第五单元: 5,
  第六单元: 6,
  第七单元: 7,
  第八单元: 8,
};

const toCurrentCharacterMeta = (character: TextbookCharacter): CharacterMeta => ({
  id: character.id,
  char: character.char,
  pinyin: character.pinyin,
  strokes: [],
  components: [],
  version: 'PEP',
  grade: character.grade,
  semester: character.semester,
  unit: unitNumberByLabel[character.unit],
  lesson: character.lesson,
});

const characterPool: CharacterMeta[] = [
  ...pepY1S1Characters.map(toCurrentCharacterMeta),
  ...pepY1S2Characters.map(toCurrentCharacterMeta),
  ...pepY2S1Characters.map(toCurrentCharacterMeta),
  ...pepY2S2Characters.map(toCurrentCharacterMeta),
];

const getFirstLesson = (
  pool: CharacterMeta[],
  grade: AppState['filter']['grade'],
  semester: AppState['filter']['semester'],
): string => {
  const lessons = pool
    .filter((character) => character.grade === grade && character.semester === semester)
    .map((character) => character.lesson);

  return Array.from(new Set(lessons))[0] ?? '';
};

let state: AppState;
const listeners = new Set<Listener>();

const emitChange = (): void => {
  listeners.forEach((listener) => listener());
};

const setState = (updater: (current: AppState) => AppState): void => {
  state = updater(state);
  emitChange();
};

const createInitialState = (): AppState => ({
  filter: {
    grade: '1',
    semester: 'UP',
    lesson: getFirstLesson(characterPool, '1', 'UP'),
  },
  characterPool,
  selectedCharIds: new Set<string>(),
  config: {
    showGrid: true,
    gridType: 'MI',
    gridLineWidth: 0.75,
    gridLineColor: '#fca5a5',
    showPinyin: true,
    showStrokeGuide: true,
    textColor: '#111827',
    traceColor: '#dc2626',
  },
  setFilter: (updater: Partial<AppState['filter']>) => {
    setState((current) => {
      const gradeChanged = updater.grade !== undefined && updater.grade !== current.filter.grade;
      const semesterChanged = updater.semester !== undefined && updater.semester !== current.filter.semester;
      const nextGrade = updater.grade ?? current.filter.grade;
      const nextSemester = updater.semester ?? current.filter.semester;
      const nextLesson =
        gradeChanged || semesterChanged
          ? getFirstLesson(current.characterPool, nextGrade, nextSemester)
          : updater.lesson ?? current.filter.lesson;
      const nextFilter: AppState['filter'] = {
        grade: nextGrade,
        semester: nextSemester,
        lesson: nextLesson,
      };

      return {
        ...current,
        filter: nextFilter,
        selectedCharIds: new Set<string>(),
      };
    });
  },
  toggleCharacter: (id: string) => {
    setState((current) => {
      const selectedCharIds = new Set(current.selectedCharIds);

      if (selectedCharIds.has(id)) {
        selectedCharIds.delete(id);
      } else {
        selectedCharIds.add(id);
      }

      return {
        ...current,
        selectedCharIds,
      };
    });
  },
  selectAllCharacters: (ids: string[]) => {
    setState((current) => ({
      ...current,
      selectedCharIds: new Set(ids),
    }));
  },
  clearAllCharacters: () => {
    setState((current) => ({
      ...current,
      selectedCharIds: new Set<string>(),
    }));
  },
  updateConfig: (updater: Partial<WorkbookConfig>) => {
    setState((current) => ({
      ...current,
      config: {
        ...current.config,
        ...updater,
      },
    }));
  },
});

state = createInitialState();

const getState = (): AppState => state;

const subscribe = (listener: Listener): (() => void) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};

type AppStoreHook = {
  <T = AppState>(selector?: StoreSelector<T>): T;
  getState: () => AppState;
  setState: (updater: (current: AppState) => AppState) => void;
  subscribe: (listener: Listener) => () => void;
};

export const useAppStore: AppStoreHook = <T = AppState>(selector?: StoreSelector<T>): T => {
  const snapshot = useSyncExternalStore(subscribe, getState, getState);

  if (selector) {
    return selector(snapshot);
  }

  return snapshot as T;
};

useAppStore.getState = getState;

useAppStore.setState = (updater: (current: AppState) => AppState): void => {
  setState(updater);
};

useAppStore.subscribe = subscribe;

export { characterPool };
