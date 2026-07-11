import { useSyncExternalStore } from 'react';
import { pepY2S1Characters } from '../data/textbooks/pep-y2-s1.js';
import type { AppState, CharacterMeta, WorkbookConfig } from '../types/index.js';
import type { TextbookCharacter } from '../types/textbook.js';

type Listener = () => void;
type StoreSelector<T> = (state: AppState) => T;

const toCharacterMeta = (character: TextbookCharacter): CharacterMeta => ({
  id: character.id,
  char: character.char,
  pinyin: character.pinyin,
  strokes: [],
  components: [],
  version: character.textbook,
  grade: character.grade,
  semester: character.semester === '1' ? 'UP' : 'DOWN',
  unit: character.unit,
});

const characterPool: CharacterMeta[] = pepY2S1Characters.map(toCharacterMeta);

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
    version: 'PEP',
    grade: '2',
    semester: 'UP',
    selectedUnit: null,
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
      const shouldResetUnit = (gradeChanged || semesterChanged) && updater.selectedUnit === undefined;
      const nextFilter: AppState['filter'] = {
        ...current.filter,
        ...updater,
        selectedUnit: shouldResetUnit ? null : updater.selectedUnit ?? current.filter.selectedUnit,
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
