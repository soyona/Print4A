import { useState } from 'react';
import { useAppStore } from '../store/useAppStore.js';
import type { AppState, CharacterMeta, GradeLevel, SemesterType } from '../types/index.js';

const TEXTBOOK_COVERS: Array<{
  grade: GradeLevel;
  semester: SemesterType;
  title: string;
  coverUrl: string;
}> = [
  { grade: '1', semester: 'UP', title: '一年级上册', coverUrl: '/assets/covers/pep-y1-s1.png' },
  { grade: '1', semester: 'DOWN', title: '一年级下册', coverUrl: '/assets/covers/pep-y1-s2.png' },
  { grade: '2', semester: 'UP', title: '二年级上册', coverUrl: '/assets/covers/pep-y2-s1.png' },
  { grade: '2', semester: 'DOWN', title: '二年级下册', coverUrl: '/assets/covers/pep-y2-s2.png' },
  { grade: '3', semester: 'UP', title: '三年级上册', coverUrl: '/assets/covers/pep-y3-s1.png' },
  { grade: '3', semester: 'DOWN', title: '三年级下册', coverUrl: '/assets/covers/pep-y3-s2.png' },
  { grade: '4', semester: 'UP', title: '四年级上册', coverUrl: '/assets/covers/pep-y4-s1.png' },
  { grade: '4', semester: 'DOWN', title: '四年级下册', coverUrl: '/assets/covers/pep-y4-s2.png' },
  { grade: '5', semester: 'UP', title: '五年级上册', coverUrl: '/assets/covers/pep-y5-s1.png' },
  { grade: '5', semester: 'DOWN', title: '五年级下册', coverUrl: '/assets/covers/pep-y5-s2.png' },
  { grade: '6', semester: 'UP', title: '六年级上册', coverUrl: '/assets/covers/pep-y6-s1.png' },
  { grade: '6', semester: 'DOWN', title: '六年级下册', coverUrl: '/assets/covers/pep-y6-s2.png' },
];

const selectClassName =
  'h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200';

const actionButtonClassName =
  'h-9 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50';

const rangeInputClassName = 'w-full accent-slate-950';

const getFilteredCharacters = (
  characterPool: CharacterMeta[],
  filter: AppState['filter'],
): CharacterMeta[] =>
  characterPool.filter((character) => {
    const matchesBaseFilter =
      character.grade === filter.grade &&
      character.semester === filter.semester &&
      character.lesson === filter.lesson;

    return matchesBaseFilter;
  });

const getLessonOptions = (
  characterPool: CharacterMeta[],
  filter: AppState['filter'],
): string[] => {
  const lessons = characterPool
    .filter(
      (character) =>
        character.grade === filter.grade &&
        character.semester === filter.semester,
    )
    .map((character) => character.lesson);

  return Array.from(new Set(lessons));
};

type SelectChangeEvent = {
  target: {
    value: string;
  };
};

const TextbookSelector = () => {
  const [isTextbookOpen, setIsTextbookOpen] = useState(true);
  const { characterPool, filter, setFilter } = useAppStore((state) => ({
    characterPool: state.characterPool,
    filter: state.filter,
    setFilter: state.setFilter,
  }));
  const lessonOptions = getLessonOptions(characterPool, filter);
  const activeTextbook = TEXTBOOK_COVERS.find(
    (textbook) => textbook.grade === filter.grade && textbook.semester === filter.semester,
  );

  const handleLessonChange = (event: SelectChangeEvent): void => {
    setFilter({ lesson: event.target.value });
  };

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <button
        className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left transition hover:bg-slate-50"
        type="button"
        aria-expanded={isTextbookOpen}
        aria-controls="textbook-cover-drawer"
        onClick={() => setIsTextbookOpen((isOpen) => !isOpen)}
      >
        <span className="min-w-0">
          <span className="block text-xs font-medium text-slate-500">已选教材</span>
          <span className="block truncate text-sm font-semibold text-slate-950">
            {activeTextbook?.title ?? '未选择'} 📖
          </span>
        </span>
        <span className="shrink-0 text-xs font-semibold text-blue-600">
          {isTextbookOpen ? '收起' : '切换'}
        </span>
      </button>

      <div
        id="textbook-cover-drawer"
        className={[
          'grid transition-[grid-template-rows,opacity] duration-300 ease-out',
          isTextbookOpen ? 'grid-rows-[1fr] opacity-100' : 'pointer-events-none grid-rows-[0fr] opacity-0',
        ].join(' ')}
      >
        <div className="overflow-hidden">
          <div className="space-y-3 border-t border-slate-100 p-3">
            <div className="grid grid-cols-3 gap-2 max-h-[180px] overflow-y-auto pr-1">
              {TEXTBOOK_COVERS.map((textbook) => {
                const isActive = textbook.grade === filter.grade && textbook.semester === filter.semester;
                const shortSemester = textbook.semester === 'UP' ? '上' : '下';

                return (
                  <button
                    key={`${textbook.grade}-${textbook.semester}`}
                    className={[
                      'rounded-md border bg-white px-1 py-1.5',
                      isActive
                        ? 'ring-2 ring-blue-500 shadow-md scale-[1.05] border-transparent transition-all'
                        : 'border-slate-200 opacity-60 transition-all hover:opacity-100',
                    ].join(' ')}
                    type="button"
                    aria-label={`选择${textbook.title}`}
                    aria-pressed={isActive}
                    onClick={() => setFilter({ grade: textbook.grade, semester: textbook.semester })}
                  >
                    <img
                      className="aspect-[3/4] h-16 mx-auto rounded border object-cover border-slate-200"
                      src={textbook.coverUrl}
                      alt={`${textbook.title}教材封面`}
                    />
                    <span className="mt-1 block text-[10px] font-semibold leading-none text-slate-600">
                      {textbook.grade}{shortSemester}
                    </span>
                  </button>
                );
              })}
            </div>

            <label className="block space-y-2">
              <span className="text-xs font-medium text-slate-500">课文</span>
              <select
                className={selectClassName}
                value={filter.lesson}
                disabled={lessonOptions.length === 0}
                onChange={handleLessonChange}
              >
                {lessonOptions.length === 0 ? <option value="">该册字库尚未录入</option> : null}
                {lessonOptions.map((lesson) => (
                  <option key={lesson} value={lesson}>
                    《{lesson}》
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>
    </section>
  );
};

const CharacterPicker = () => {
  const { characterPool, clearAllCharacters, filter, selectAllCharacters, selectedCharIds, toggleCharacter } =
    useAppStore((state) => ({
      characterPool: state.characterPool,
      clearAllCharacters: state.clearAllCharacters,
      filter: state.filter,
      selectAllCharacters: state.selectAllCharacters,
      selectedCharIds: state.selectedCharIds,
      toggleCharacter: state.toggleCharacter,
    }));
  const visibleCharacters = getFilteredCharacters(characterPool, filter);
  const visibleCharacterIds = visibleCharacters.map((character) => character.id);
  const selectedCount = selectedCharIds.size;
  const characterBlocksPerPage = 6;
  const estimatedPages = Math.max(1, Math.ceil(selectedCount / characterBlocksPerPage));
  const blankBlocksOnLastPage = estimatedPages * characterBlocksPerPage - selectedCount;

  const handleSelectAll = (): void => {
    selectAllCharacters(visibleCharacterIds);
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-slate-950">课文生字</h2>
        <span className="text-xs font-medium text-slate-500">{visibleCharacters.length} 字</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button className={actionButtonClassName} type="button" onClick={handleSelectAll}>
          全选
        </button>
        <button className={actionButtonClassName} type="button" onClick={clearAllCharacters}>
          清空
        </button>
      </div>

      <div
        className="rounded-lg border border-blue-100 bg-blue-50 p-2.5 text-xs leading-5 text-blue-800"
        role="status"
        aria-live="polite"
      >
        已选 {selectedCount} 个生字。预计占用 {estimatedPages} 页 A4 纸（每页满载 6 个双行汉字块，尾页自动补齐{' '}
        {blankBlocksOnLastPage} 个纯空白模板块）。
      </div>

      <div className="grid grid-cols-4 gap-2">
        {visibleCharacters.map((character) => {
          const isSelected = selectedCharIds.has(character.id);

          return (
            <button
              key={character.id}
              className={[
                'aspect-square rounded-md border text-2xl font-semibold transition',
                isSelected
                  ? 'border-slate-950 bg-slate-950 text-white'
                  : 'border-slate-200 bg-white text-slate-900 hover:border-slate-400 hover:bg-slate-50',
              ].join(' ')}
              type="button"
              aria-pressed={isSelected}
              onClick={() => toggleCharacter(character.id)}
            >
              {character.char}
            </button>
          );
        })}
      </div>

      {visibleCharacters.length === 0 ? (
        <div className="rounded-md border border-dashed border-slate-200 bg-slate-50 px-3 py-6 text-center text-sm text-slate-500">
          当前教材课文暂无生字
        </div>
      ) : null}
    </section>
  );
};

const ToggleControl = ({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) => (
  <label className="flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white px-3 py-2.5">
    <span className="text-sm font-medium text-slate-700">{label}</span>
    <input
      className="peer sr-only"
      type="checkbox"
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
    />
    <span className="relative h-5 w-9 shrink-0 rounded-full bg-slate-200 transition peer-checked:bg-slate-950 after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow-sm after:transition-transform peer-checked:after:translate-x-4" />
  </label>
);

const SegmentedControl = <T extends string>({
  onChange,
  options,
  value,
}: {
  onChange: (value: T) => void;
  options: Array<{ label: string; value: T }>;
  value: T;
}) => (
  <div className="grid grid-cols-2 gap-1 rounded-lg bg-slate-200 p-1">
    {options.map((option) => (
      <button
        key={option.value}
        className={[
          'h-9 rounded-md text-sm font-semibold transition',
          value === option.value ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-800',
        ].join(' ')}
        type="button"
        aria-pressed={value === option.value}
        onClick={() => onChange(option.value)}
      >
        {option.label}
      </button>
    ))}
  </div>
);

const VisualConfigPanel = () => {
  const { config, updateConfig } = useAppStore((state) => ({
    config: state.config,
    updateConfig: state.updateConfig,
  }));

  return (
    <div className="space-y-4">
      <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-100/80 p-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-950">格子样式</h2>
          <p className="mt-1 text-xs text-slate-500">控制四线三格与练字辅助线的结构和视觉强度</p>
        </div>

        <ToggleControl
          label="显示四线三格"
          checked={config.showPinyin}
          onChange={(showPinyin) => updateConfig({ showPinyin })}
        />

        <ToggleControl
          label="显示网格"
          checked={config.showGrid}
          onChange={(showGrid) => updateConfig({ showGrid })}
        />

        <SegmentedControl
          value={config.gridType}
          options={[
            { label: '米字格', value: 'MI' },
            { label: '田字格', value: 'TIAN' },
          ]}
          onChange={(gridType) => updateConfig({ gridType })}
        />

        <label className="block space-y-2">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-slate-700">辅助线粗细</span>
            <span className="text-xs font-semibold tabular-nums text-slate-500">{config.gridLineWidth.toFixed(2)}</span>
          </div>
          <input
            className={rangeInputClassName}
            type="range"
            min="0.5"
            max="1.5"
            step="0.05"
            value={config.gridLineWidth}
            onChange={(event) => updateConfig({ gridLineWidth: Number(event.target.value) })}
          />
        </label>

        <label className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white px-3 py-2.5">
          <span className="text-sm font-medium text-slate-700">辅助线颜色</span>
          <span className="flex items-center gap-2 text-xs font-medium text-slate-500">
            {config.gridLineColor.toUpperCase()}
            <input
              className="h-7 w-9 cursor-pointer rounded border-0 bg-transparent p-0"
              type="color"
              value={config.gridLineColor}
              onChange={(event) => updateConfig({ gridLineColor: event.target.value })}
            />
          </span>
        </label>
      </section>

      <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-100/80 p-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-950">笔顺描红</h2>
          <p className="mt-1 text-xs text-slate-500">设置渐进笔顺引导与描红色彩</p>
        </div>

        <ToggleControl
          label="笔顺引导"
          checked={config.showStrokeGuide}
          onChange={(showStrokeGuide) => updateConfig({ showStrokeGuide })}
        />

        <SegmentedControl
          value={config.traceColor === '#dc2626' ? 'RED' : 'GRAY'}
          options={[
            { label: '灰度', value: 'GRAY' },
            { label: '红色', value: 'RED' },
          ]}
          onChange={(colorMode) => updateConfig({ traceColor: colorMode === 'RED' ? '#dc2626' : '#4b5563' })}
        />

        <p className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs leading-5 text-blue-800">
          系统会按真实总笔画依次排布母字与全部笔顺，再用空白练习格补齐固定两行、共 24 格。
        </p>
      </section>
    </div>
  );
};

export const SidebarLayout = () => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  return (
    <aside className="sticky top-0 flex h-screen w-96 shrink-0 flex-col overflow-y-auto border-r border-slate-200 bg-white px-5 py-6">
      <div className="mb-5">
        <h1 className="text-lg font-semibold tracking-tight text-slate-950">模板配置</h1>
        <p className="mt-1 text-xs text-slate-500">定制可直接打印的 A4 生字练习模板</p>
      </div>

      <div className="space-y-4">
      <section className="space-y-5 rounded-xl border border-slate-200 bg-slate-100/80 p-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-950">字帖内容</h2>
          <p className="mt-1 text-xs text-slate-500">筛选教材生字并管理练习内容</p>
        </div>
        <TextbookSelector />
        <CharacterPicker />
      </section>

        <button
          className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
          type="button"
          aria-expanded={isAdvancedOpen}
          aria-controls="advanced-config-panel"
          onClick={() => setIsAdvancedOpen((isOpen) => !isOpen)}
        >
          <span>高级自定义微调 ⚙️</span>
          <span className={['text-slate-400 transition-transform duration-300', isAdvancedOpen ? 'rotate-180' : ''].join(' ')} aria-hidden="true">
            ▾
          </span>
        </button>

        <div
          id="advanced-config-panel"
          className={[
            'grid transition-[grid-template-rows,opacity] duration-300 ease-out',
            isAdvancedOpen ? 'grid-rows-[1fr] opacity-100' : 'pointer-events-none grid-rows-[0fr] opacity-0',
          ].join(' ')}
        >
          <div className="overflow-hidden">
            <div className="space-y-4 pb-1">
              <VisualConfigPanel />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export { CharacterPicker, TextbookSelector, VisualConfigPanel };
