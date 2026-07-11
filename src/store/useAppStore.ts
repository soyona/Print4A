import { useSyncExternalStore } from 'react';
import type { AppState, CharacterMeta, OutputMode, WorkbookConfig } from '../types/index.js';

type Listener = () => void;
type StoreSelector<T> = (state: AppState) => T;

const mockCharacterPool: CharacterMeta[] = [
  {
    id: 'pep-1-up-1-ming',
    char: '明',
    pinyin: 'míng',
    strokes: [],
    components: ['日', '月'],
    version: 'PEP',
    grade: '1',
    semester: 'UP',
    unit: 1,
  },
  {
    id: 'pep-3-up-4-ying',
    char: '赢',
    pinyin: 'yíng',
    strokes: [],
    components: ['亡', '口', '月', '贝', '凡'],
    version: 'PEP',
    grade: '3',
    semester: 'UP',
    unit: 4,
  },
  {
    id: 'pep-1-down-2-lin',
    char: '林',
    pinyin: 'lín',
    strokes: [],
    components: ['木', '木'],
    version: 'PEP',
    grade: '1',
    semester: 'DOWN',
    unit: 2,
  },
];

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
    grade: '1',
    semester: 'UP',
    selectedUnit: null,
  },
  characterPool: mockCharacterPool,
  selectedCharIds: new Set<string>(),
  outputMode: 'PRACTICE',
  config: {
    showGrid: true,
    gridType: 'MI',
    gridLineWidth: 0.75,
    gridLineColor: '#fca5a5',
    showPinyin: true,
    showStrokeGuide: true,
    textColor: '#111827',
    traceColor: '#dc2626',
    traceCellsCount: 8,
    emptyCellsCount: 0,
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
  setOutputMode: (mode: OutputMode) => {
    setState((current) => ({
      ...current,
      outputMode: mode,
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

export { mockCharacterPool };
