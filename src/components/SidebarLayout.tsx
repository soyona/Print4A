import { useState } from 'react';
import { useAppStore } from '../store/useAppStore.js';
import type { AppState, CharacterMeta, GradeLevel, SemesterType } from '../types/index.js';

const gradeOptions: GradeLevel[] = ['1', '2', '3', '4', '5', '6'];
const semesterOptions: Array<{ label: string; value: SemesterType }> = [
  { label: '上册', value: 'UP' },
  { label: '下册', value: 'DOWN' },
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
      character.version === filter.version &&
      character.grade === filter.grade &&
      character.semester === filter.semester;

    if (!matchesBaseFilter) {
      return false;
    }

    return filter.selectedUnit === null || character.unit === filter.selectedUnit;
  });

const getUnitOptions = (
  characterPool: CharacterMeta[],
  filter: AppState['filter'],
): number[] => {
  const units = characterPool
    .filter(
      (character) =>
        character.version === filter.version &&
        character.grade === filter.grade &&
        character.semester === filter.semester,
    )
    .map((character) => character.unit);

  return Array.from(new Set(units)).sort((first, second) => first - second);
};

type SelectChangeEvent = {
  target: {
    value: string;
  };
};

const TextbookSelector = () => {
  const { characterPool, filter, setFilter } = useAppStore((state) => ({
    characterPool: state.characterPool,
    filter: state.filter,
    setFilter: state.setFilter,
  }));
  const unitOptions = getUnitOptions(characterPool, filter);

  const handleGradeChange = (event: SelectChangeEvent): void => {
    setFilter({ grade: event.target.value as GradeLevel });
  };

  const handleSemesterChange = (event: SelectChangeEvent): void => {
    setFilter({ semester: event.target.value as SemesterType });
  };

  const handleUnitChange = (event: SelectChangeEvent): void => {
    const selectedUnit = event.target.value === 'ALL' ? null : Number(event.target.value);

    setFilter({ selectedUnit });
  };

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-sm font-semibold text-slate-950">教材筛选</h2>
      </div>

      <label className="block space-y-2">
        <span className="text-xs font-medium text-slate-500">年级</span>
        <select className={selectClassName} value={filter.grade} onChange={handleGradeChange}>
          {gradeOptions.map((grade) => (
            <option key={grade} value={grade}>
              {grade}年级
            </option>
          ))}
        </select>
      </label>

      <label className="block space-y-2">
        <span className="text-xs font-medium text-slate-500">学期</span>
        <select className={selectClassName} value={filter.semester} onChange={handleSemesterChange}>
          {semesterOptions.map((semester) => (
            <option key={semester.value} value={semester.value}>
              {semester.label}
            </option>
          ))}
        </select>
      </label>

      <label className="block space-y-2">
        <span className="text-xs font-medium text-slate-500">单元</span>
        <select
          className={selectClassName}
          value={filter.selectedUnit === null ? 'ALL' : String(filter.selectedUnit)}
          onChange={handleUnitChange}
        >
          <option value="ALL">全册</option>
          {unitOptions.map((unit) => (
            <option key={unit} value={unit}>
              第{unit}单元
            </option>
          ))}
        </select>
      </label>
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
        <h2 className="text-sm font-semibold text-slate-950">生字选择</h2>
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
          当前筛选暂无生字
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
