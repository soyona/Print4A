import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import HanziWriter from 'hanzi-writer/dist/index.esm.js';
import { useAppStore } from '../store/useAppStore.js';
import type { CharacterMeta, WorkbookConfig } from '../types/index.js';

const a4PageHeightMm = 297;
const a4PageVerticalPaddingMm = 24;
const practicePinyinTrackHeightMm = 7;
const practiceRowGapMm = 0.25;
const practiceCellsPerRow = 12;
const a4PageWidthMm = 210;
const a4PageHorizontalPaddingMm = 24;
const practiceCellSizeMm =
  (a4PageWidthMm - a4PageHorizontalPaddingMm) / practiceCellsPerRow;
const getPracticeRowsPerPage = (showPinyin: boolean): number => {
  const pinyinTrackHeightMm = showPinyin ? practicePinyinTrackHeightMm : 0;
  const practiceRowHeightMm = (pinyinTrackHeightMm + practiceCellSizeMm) * 2 + practiceRowGapMm;

  return Math.floor(
    (a4PageHeightMm - a4PageVerticalPaddingMm + practiceRowGapMm) /
      (practiceRowHeightMm + practiceRowGapMm),
  );
};
const paleStrokeColor = '#f1f5f9';

const previewPrintStyles = `
  @page {
    size: A4;
    margin: 0;
  }

  .a4-page {
    width: 210mm;
    height: 297mm;
    margin-bottom: 24px;
    border: 1px solid rgb(203 213 225 / 0.5);
    box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -7px rgba(0, 0, 0, 0.1);
    page-break-after: always;
    break-after: page;
    font-family: "Kaiti", "STKaiti", "华文楷体", "楷体", serif !important;
  }

  .a4-page * {
    font-family: "Kaiti", "STKaiti", "华文楷体", "楷体", serif !important;
  }

  .a4-page:last-child {
    page-break-after: auto;
    break-after: auto;
  }

  .practice-char {
    font-family: "Kaiti", "STKaiti", "华文楷体", "楷体", serif !important;
  }

  .practice-row {
    font-family: "Kaiti", "STKaiti", "华文楷体", "楷体", serif !important;
  }

  .pinyin-text {
    position: absolute;
    inset-inline: 0;
    bottom: calc(33.333% - 1px);
    font-family: "Century Gothic", "Comic Sans MS", "KaiTi", "PingFang SC", sans-serif !important;
    font-size: 12px;
    font-weight: 600;
    line-height: 12px;
    text-align: center;
  }

  .mi-grid-guide {
    position: absolute;
    inset: 0;
    display: block;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  .hanzi-cell {
    border-right: 1px solid #000000;
    border-bottom: 1px solid #000000;
    border-radius: 0;
    box-sizing: border-box;
  }

  .practice-grid {
    border-left: 1px solid #000000;
    border-top: 1px solid #000000;
  }

  .hanzi-writer-target,
  .hanzi-writer-target svg {
    display: block;
    height: 100%;
    width: 100%;
  }

  @media print {
    html,
    body {
      width: 210mm;
      min-height: 297mm;
      margin: 0;
      background: #ffffff !important;
    }

    body * {
      visibility: hidden;
    }

    .print-root,
    .print-root * {
      visibility: visible;
    }

    .print-root {
      position: absolute;
      inset: 0 auto auto 0;
      width: 210mm;
      margin: 0;
      padding: 0;
      background: #ffffff !important;
    }

    .print-action-bar,
    .screen-only,
    .page-boundary-indicator {
      display: none !important;
    }

    .a4-page {
      width: 210mm !important;
      height: 297mm !important;
      margin: 0 !important;
      box-shadow: none !important;
      border: none !important;
      transform: none !important;
      page-break-after: always;
      break-after: page;
    }

    .a4-page:last-child {
      page-break-after: auto;
      break-after: auto;
    }
  }
`;

type A4PageLayoutProps = {
  targetCharacters: CharacterMeta[];
  config: WorkbookConfig;
  strokeCounts: Record<string, number>;
};

type PracticeCanvasProps = {
  data: CharacterMeta[];
  config: WorkbookConfig;
  strokeCounts: Record<string, number>;
};

type PracticeCellRole = 'MASTER' | 'TRACE' | 'EMPTY';

type PracticeCell = {
  id: string;
  isFinalTrace: boolean;
  character: CharacterMeta;
  role: PracticeCellRole;
  traceStep: number;
};

const chunkItems = <T,>(items: T[], pageSize: number): T[][] => {
  if (items.length === 0) {
    return [[]];
  }

  const pages: T[][] = [];

  for (let startIndex = 0; startIndex < items.length; startIndex += pageSize) {
    pages.push(items.slice(startIndex, startIndex + pageSize));
  }

  return pages;
};

const getSelectedCharacters = (
  characterPool: CharacterMeta[],
  selectedCharIds: Set<string>,
): CharacterMeta[] => characterPool.filter((character) => selectedCharIds.has(character.id));

const getPracticeCells = (character: CharacterMeta, strokeCount: number, showStrokeGuide: boolean): PracticeCell[] => {
  const traceSlots = showStrokeGuide ? strokeCount : 0;
  const requiredCells = traceSlots + 1;
  const totalCells = Math.max(24, Math.ceil(requiredCells / practiceCellsPerRow) * practiceCellsPerRow);

  return Array.from({ length: totalCells }, (_, cellIndex) => {
    const role: PracticeCellRole = cellIndex === 0 ? 'MASTER' : cellIndex <= traceSlots ? 'TRACE' : 'EMPTY';

    return {
      id: `${character.id}-practice-cell-${cellIndex}`,
      isFinalTrace: role === 'TRACE' && cellIndex === traceSlots,
      character,
      role,
      traceStep: cellIndex,
    };
  });
};

const GridGuide = ({ config }: { config: WorkbookConfig }) => {
  if (!config.showGrid) {
    return null;
  }

  const diagonals = config.gridType === 'MI' ? ' M0 0L100 100 M100 0L0 100' : '';

  return (
    <svg
      className="mi-grid-guide"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d={`M50 0V100 M0 50H100${diagonals}`}
        stroke={config.gridLineColor || '#cbd5e1'}
        strokeWidth={config.gridLineWidth}
        strokeDasharray="6 8"
        fill="none"
      />
    </svg>
  );
};

const PrintActionBar = ({ isPrintReady, statusText }: { isPrintReady: boolean; statusText: string }) => {
  const handlePrint = (): void => {
    window.print();
  };

  return (
    <div className="print-action-bar sticky top-0 z-10 flex items-center justify-between border-b border-amber-200 bg-amber-50 px-6 py-4 shadow-sm">
      <div>
        <div className="text-sm font-semibold text-amber-950">A4 实时预览</div>
        <div className="text-xs font-medium text-amber-700">{statusText}</div>
      </div>

      <button
        className="h-10 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        type="button"
        disabled={!isPrintReady}
        onClick={handlePrint}
        aria-disabled={!isPrintReady}
      >
        {isPrintReady ? '一键打印' : '笔顺加载中…'}
      </button>
    </div>
  );
};

const PinyinTrack = ({
  cellCount,
  character,
  config,
  rowId,
}: {
  cellCount: number;
  character?: CharacterMeta;
  config: WorkbookConfig;
  rowId: string;
}) => {
  if (!config.showPinyin) {
    return null;
  }

  return (
    <div className="relative h-[7mm]">
      <>
        <div className="absolute inset-x-0 top-0 border-t border-dashed border-slate-300" />
        <div className="absolute inset-x-0 top-1/3 border-t border-dashed border-slate-300" />
        <div className="absolute inset-x-0 top-2/3 border-t border-dashed border-slate-300" />
        <div
          className="relative grid h-full"
          style={{ gridTemplateColumns: `repeat(${cellCount}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: cellCount }, (_, cellIndex) => (
            <div
              key={`${rowId}-pinyin-${cellIndex}`}
              className="relative h-full"
            >
              {cellIndex === 0 && character?.pinyin ? (
                <span
                  className="pinyin-text z-[1] text-slate-950"
                >
                  {character.pinyin}
                </span>
              ) : null}
            </div>
          ))}
        </div>
      </>
    </div>
  );
};

const HanziWriterTrace = ({ cell, config }: { cell: PracticeCell; config: WorkbookConfig }) => {
  const targetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const target = targetRef.current;

    if (!target || cell.role === 'EMPTY' || (cell.role === 'TRACE' && !config.showStrokeGuide)) {
      return undefined;
    }

    let isDisposed = false;
    let writer: ReturnType<typeof HanziWriter.create> | null = null;

    const mountWriter = (): void => {
      if (isDisposed) {
        return;
      }

      target.innerHTML = '';
      const measuredSize = Math.max(56, Math.round(target.getBoundingClientRect().width || target.clientWidth || 72));
      const isMaster = cell.role === 'MASTER';
      const showCompleteCharacter = isMaster || cell.isFinalTrace;
      const strokeColor = isMaster ? '#000000' : config.traceColor;

      writer = HanziWriter.create(target, cell.character.char, {
        width: measuredSize,
        height: measuredSize,
        padding: 5,
        renderer: 'svg',
        showCharacter: showCompleteCharacter,
        showOutline: isMaster ? false : !showCompleteCharacter,
        strokeColor,
        radicalColor: null,
        outlineColor: paleStrokeColor,
        highlightColor: config.traceColor,
        drawingColor: config.traceColor,
        strokeFadeDuration: 0,
        drawingFadeDuration: 0,
      });
      if (cell.role === 'TRACE' && !cell.isFinalTrace) {
        void writer.quiz({
          quizStartStrokeNum: cell.traceStep,
          showHintAfterMisses: false,
          highlightOnComplete: false,
          markStrokeCorrectAfterMisses: false,
        });
      }
    };

    const frameId = window.requestAnimationFrame(mountWriter);

    return () => {
      isDisposed = true;
      window.cancelAnimationFrame(frameId);
      writer?.cancelQuiz();
      target.innerHTML = '';
    };
  }, [cell.character.char, cell.isFinalTrace, cell.role, cell.traceStep, config.showStrokeGuide, config.traceColor]);

  if (cell.role === 'EMPTY' || (cell.role === 'TRACE' && !config.showStrokeGuide)) {
    return null;
  }

  return (
    <div
      ref={targetRef}
      className="hanzi-writer-target pointer-events-none h-full w-full"
      aria-label={
        cell.role === 'MASTER'
          ? `${cell.character.char} 标准母字`
          : cell.isFinalTrace
            ? `${cell.character.char} 完整笔顺描红`
            : `${cell.character.char} 前 ${cell.traceStep} 笔描红`
      }
    />
  );
};

const PracticeCellView = ({ cell, config }: { cell: PracticeCell; config: WorkbookConfig }) => (
  <div
    className="hanzi-cell relative flex aspect-square min-w-0 items-center justify-center overflow-hidden bg-white"
  >
    <GridGuide config={config} />
    <HanziWriterTrace cell={cell} config={config} />
  </div>
);

const BlankPracticeRow = ({
  config,
  rowIndex,
}: {
  config: WorkbookConfig;
  rowIndex: number;
}) => {
  const rowId = `blank-practice-row-${rowIndex}`;

  return (
    <div className="practice-row w-full">
      {Array.from({ length: 2 }, (_, gridRowIndex) => (
        <div key={`${rowId}-pair-${gridRowIndex}`} className={gridRowIndex === 0 ? '' : 'mt-[0.25mm]'}>
          <PinyinTrack cellCount={practiceCellsPerRow} config={config} rowId={`${rowId}-${gridRowIndex}`} />
          <div
            className="practice-grid grid w-full"
            style={{ gridTemplateColumns: `repeat(${practiceCellsPerRow}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: practiceCellsPerRow }, (_, cellIndex) => (
              <div
                key={`${rowId}-${gridRowIndex}-cell-${cellIndex}`}
                className="hanzi-cell relative aspect-square min-w-0 overflow-hidden bg-white"
                aria-hidden="true"
              >
                <GridGuide config={config} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const CharacterPracticeBlock = ({
  character,
  config,
  strokeCount,
}: {
  character: CharacterMeta;
  config: WorkbookConfig;
  strokeCount: number;
}) => {
  const practiceCells = getPracticeCells(character, strokeCount, config.showStrokeGuide);

  return (
    <div className="practice-row w-full">
      {chunkItems(practiceCells, practiceCellsPerRow).map((rowCells, gridRowIndex) => (
        <div key={`${character.id}-pair-${gridRowIndex}`} className={gridRowIndex === 0 ? '' : 'mt-[0.25mm]'}>
          <PinyinTrack
            cellCount={practiceCellsPerRow}
            character={gridRowIndex === 0 ? character : undefined}
            config={config}
            rowId={`${character.id}-${gridRowIndex}`}
          />
          <div
            className="practice-grid grid w-full"
            style={{ gridTemplateColumns: `repeat(${practiceCellsPerRow}, minmax(0, 1fr))` }}
          >
            {rowCells.map((cell) => (
              <PracticeCellView key={cell.id} cell={cell} config={config} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const PracticeCanvas = ({ config, data, strokeCounts }: PracticeCanvasProps) => {
  const practiceRowsPerPage = getPracticeRowsPerPage(config.showPinyin);

  return (
    <div className="flex h-full flex-col gap-[0.25mm]">
      {data.map((character) => (
          <CharacterPracticeBlock
            key={character.id}
            character={character}
            config={config}
            strokeCount={strokeCounts[character.id] ?? 0}
          />
      ))}
      {Array.from({ length: Math.max(0, practiceRowsPerPage - data.length) }, (_, rowIndex) => (
        <BlankPracticeRow
          key={`page-blank-practice-row-${data.length}-${rowIndex}`}
          config={config}
          rowIndex={data.length + rowIndex}
        />
      ))}
    </div>
  );
};

const A4PageLayout = ({ config, strokeCounts, targetCharacters }: A4PageLayoutProps) => {
  const practiceRowsPerPage = getPracticeRowsPerPage(config.showPinyin);
  const pages = chunkItems(targetCharacters, practiceRowsPerPage);

  return (
    <div className="print-root mx-auto flex flex-col items-center py-8 print:block print:p-0">
      {pages.map((pageItems, pageIndex) => (
        <Fragment key={`practice-page-${pageIndex}`}>
          <section className="a4-page origin-top overflow-hidden bg-white p-[12mm]">
            <PracticeCanvas config={config} data={pageItems} strokeCounts={strokeCounts} />
          </section>
          {pageIndex < pages.length - 1 ? (
            <div className="page-boundary-indicator print:hidden text-xs font-medium text-slate-400/80 text-center my-2 select-none">
              - 第 {pageIndex + 1} 页 / 共 {pages.length} 页 -
            </div>
          ) : null}
        </Fragment>
      ))}
    </div>
  );
};

export const PreviewContainer = () => {
  const { characterPool, config, selectedCharIds } = useAppStore((state) => ({
    characterPool: state.characterPool,
    config: state.config,
    selectedCharIds: state.selectedCharIds,
  }));
  const targetCharacters = useMemo(
    () => getSelectedCharacters(characterPool, selectedCharIds),
    [characterPool, selectedCharIds],
  );
  const [strokeLoadState, setStrokeLoadState] = useState<{
    counts: Record<string, number>;
    errors: string[];
    isLoading: boolean;
  }>({ counts: {}, errors: [], isLoading: false });

  useEffect(() => {
    let isDisposed = false;

    if (targetCharacters.length === 0 || !config.showStrokeGuide) {
      setStrokeLoadState({ counts: {}, errors: [], isLoading: false });
      return () => {
        isDisposed = true;
      };
    }

    setStrokeLoadState({ counts: {}, errors: [], isLoading: true });

    void Promise.all(
      targetCharacters.map(async (character) => {
        try {
          const data = await HanziWriter.loadCharacterData(character.char);
          return data ? { id: character.id, strokeCount: data.strokes.length } : { id: character.id, error: character.char };
        } catch {
          return { id: character.id, error: character.char };
        }
      }),
    ).then((results) => {
      if (isDisposed) {
        return;
      }

      const counts: Record<string, number> = {};
      const errors: string[] = [];

      results.forEach((result) => {
        if (typeof result.strokeCount === 'number') {
          counts[result.id] = result.strokeCount;
        } else if (result.error) {
          errors.push(result.error);
        }
      });

      setStrokeLoadState({ counts, errors, isLoading: false });
    });

    return () => {
      isDisposed = true;
    };
  }, [config.showStrokeGuide, targetCharacters]);

  const isPrintReady = !strokeLoadState.isLoading && strokeLoadState.errors.length === 0;
  const printStatusText = strokeLoadState.isLoading
    ? '正在加载所选汉字的完整笔顺，请稍候'
    : strokeLoadState.errors.length > 0
      ? `以下汉字笔顺加载失败：${strokeLoadState.errors.join('、')}`
      : '原生打印输出已锁定 210mm x 297mm';

  return (
    <main className="min-h-screen flex-1 bg-slate-200/80">
      <style>{previewPrintStyles}</style>
      <PrintActionBar isPrintReady={isPrintReady} statusText={printStatusText} />
      <div className="overflow-auto px-8 pb-10">
        <div className="screen-only mx-auto flex max-w-[210mm] items-center justify-between pt-6 text-xs font-medium text-slate-500">
          <span>字帖练习模式</span>
          <span>{targetCharacters.length} 个汉字</span>
        </div>
        <A4PageLayout
          config={config}
          strokeCounts={strokeLoadState.counts}
          targetCharacters={targetCharacters}
        />
      </div>
    </main>
  );
};

export { A4PageLayout, PracticeCanvas, PrintActionBar };
