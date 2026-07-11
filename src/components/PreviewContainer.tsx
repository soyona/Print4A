import { useEffect, useRef } from 'react';
import HanziWriter from 'hanzi-writer/dist/index.esm.js';
import { useAppStore } from '../store/useAppStore.js';
import type { CharacterMeta, OutputMode, WorkbookConfig } from '../types/index.js';

const a4PageHeightMm = 297;
const a4PageVerticalPaddingMm = 24;
const practicePinyinTrackHeightMm = 7;
const practiceRowGapMm = 0.25;
const practiceCellGapMm = 1.2;
const practiceCellsPerRow = 12;
const a4PageWidthMm = 210;
const a4PageHorizontalPaddingMm = 24;
const practiceCellSizeMm =
  (a4PageWidthMm -
    a4PageHorizontalPaddingMm -
    practiceCellGapMm * (practiceCellsPerRow - 1)) /
  practiceCellsPerRow;
const practiceRowHeightMm = practicePinyinTrackHeightMm + practiceCellSizeMm;
const practiceRowsPerPage = Math.floor(
  (a4PageHeightMm - a4PageVerticalPaddingMm + practiceRowGapMm) /
    (practiceRowHeightMm + practiceRowGapMm),
);
const traceCellsPerRow = 8;
const puzzlePiecesPerPage = 36;
const paleStrokeColor = '#e2e8f0';

const previewPrintStyles = `
  @page {
    size: A4;
    margin: 0;
  }

  .a4-page {
    width: 210mm;
    height: 297mm;
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

  .mi-grid-bg {
    /* 彻底移除原 SVG 中的外层实线矩形，仅保留内部极细的十字与对角斜线 */
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 0V100 M0 50H100 M0 0L100 100 M100 0L0 100' stroke='%23cbd5e1' stroke-width='0.8' stroke-dasharray='6 6' fill='none'/%3E%3C/svg%3E");
    background-position: center;
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

  .hanzi-cell {
    border: 1px solid #64748b !important;
    border-radius: 0;
    box-sizing: border-box;
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
    .screen-only {
      display: none !important;
    }

    .a4-page {
      width: 210mm !important;
      height: 297mm !important;
      margin: 0 !important;
      box-shadow: none !important;
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

type CharacterPiece = {
  id: string;
  sourceChar: string;
  value: string;
};

type A4PageLayoutProps = {
  mode: OutputMode;
  targetCharacters: CharacterMeta[];
  config: WorkbookConfig;
};

type PracticeCanvasProps = {
  data: CharacterMeta[];
  config: WorkbookConfig;
};

type PuzzleCanvasProps = {
  pieces: CharacterPiece[];
};

type PracticeCellRole = 'MASTER' | 'TRACE' | 'EMPTY';

type PracticeCell = {
  id: string;
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

const getPuzzlePieces = (characters: CharacterMeta[]): CharacterPiece[] =>
  characters.flatMap((character) =>
    character.components.map((component, index) => ({
      id: `${character.id}-piece-${index}`,
      sourceChar: character.char,
      value: component,
    })),
  );

const getPracticeCells = (character: CharacterMeta, config: WorkbookConfig): PracticeCell[] => {
  const traceSlots = config.showStrokeGuide ? traceCellsPerRow : 0;

  return Array.from({ length: practiceCellsPerRow }, (_, cellIndex) => {
    const role: PracticeCellRole = cellIndex === 0 ? 'MASTER' : cellIndex <= traceSlots ? 'TRACE' : 'EMPTY';

    return {
      id: `${character.id}-practice-cell-${cellIndex}`,
      character,
      role,
      traceStep: cellIndex,
    };
  });
};

const getGridBackgroundStyle = (config: WorkbookConfig): { backgroundImage?: string } => {
  if (!config.showGrid) {
    return {};
  }

  const color = encodeURIComponent(config.gridLineColor || '#cbd5e1');
  const diagonals = config.gridType === 'MI' ? ' M0 0L100 100 M100 0L0 100' : '';
  const svg = `%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 0V100 M0 50H100${diagonals}' stroke='${color}' stroke-width='${config.gridLineWidth}' stroke-dasharray='6 6' fill='none'/%3E%3C/svg%3E`;

  return { backgroundImage: `url("data:image/svg+xml,${svg}")` };
};

const PrintActionBar = () => {
  const handlePrint = (): void => {
    window.print();
  };

  return (
    <div className="print-action-bar sticky top-0 z-10 flex items-center justify-between border-b border-amber-200 bg-amber-50 px-6 py-4 shadow-sm">
      <div>
        <div className="text-sm font-semibold text-amber-950">A4 实时预览</div>
        <div className="text-xs font-medium text-amber-700">原生打印输出已锁定 210mm x 297mm</div>
      </div>

      <button
        className="h-10 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
        type="button"
        onClick={handlePrint}
      >
        一键打印
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
}) => (
  <div className="relative h-[7mm]">
    {config.showPinyin ? (
      <>
        <div className="absolute inset-x-0 top-0 border-t border-dashed border-[#cbd5e1]" />
        <div className="absolute inset-x-0 top-1/3 border-t border-dashed border-[#cbd5e1]" />
        <div className="absolute inset-x-0 top-2/3 border-t border-dashed border-[#cbd5e1]" />
        <div className="absolute inset-x-0 bottom-0 border-t border-dashed border-[#cbd5e1]" />
        <div
          className="relative grid h-full gap-x-[1.2mm]"
          style={{ gridTemplateColumns: `repeat(${cellCount}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: cellCount }, (_, cellIndex) => (
            <div
              key={`${rowId}-pinyin-${cellIndex}`}
              className={[
                'flex h-full items-center justify-center pb-[0.1mm] text-[10px] font-medium leading-none',
                cellIndex === 0 ? 'text-slate-950' : 'text-slate-300',
              ].join(' ')}
            >
              {character?.pinyin ?? null}
            </div>
          ))}
        </div>
      </>
    ) : null}
  </div>
);

const HanziWriterTrace = ({ cell, config }: { cell: PracticeCell; config: WorkbookConfig }) => {
  const targetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const target = targetRef.current;

    if (!target || !config.showStrokeGuide || cell.role !== 'TRACE') {
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
      writer = HanziWriter.create(target, cell.character.char, {
        width: measuredSize,
        height: measuredSize,
        padding: 5,
        renderer: 'svg',
        showCharacter: false,
        showOutline: true,
        strokeColor: config.traceColor || '#4b5563',
        radicalColor: null,
        outlineColor: paleStrokeColor,
        highlightColor: config.traceColor || '#4b5563',
        drawingColor: config.traceColor || '#4b5563',
        strokeFadeDuration: 0,
        drawingFadeDuration: 0,
      });
      void writer.quiz({
        quizStartStrokeNum: cell.traceStep,
        showHintAfterMisses: false,
        highlightOnComplete: false,
        markStrokeCorrectAfterMisses: false,
      });
    };

    const frameId = window.requestAnimationFrame(mountWriter);

    return () => {
      isDisposed = true;
      window.cancelAnimationFrame(frameId);
      writer?.cancelQuiz();
      target.innerHTML = '';
    };
  }, [cell.character.char, cell.role, cell.traceStep, config.showStrokeGuide, config.traceColor]);

  if (!config.showStrokeGuide || cell.role !== 'TRACE') {
    return null;
  }

  return (
    <div
      ref={targetRef}
      className="hanzi-writer-target aspect-square w-[88%] pointer-events-none mx-auto"
      aria-label={`${cell.character.char} 前 ${cell.traceStep} 笔描红`}
    />
  );
};

const PracticeCellView = ({ cell, config }: { cell: PracticeCell; config: WorkbookConfig }) => (
  <div
    className={[
      'hanzi-cell relative flex aspect-square min-w-0 items-center justify-center overflow-hidden bg-white',
      config.showGrid ? 'mi-grid-bg' : '',
    ].join(' ')}
    style={getGridBackgroundStyle(config)}
  >
    {cell.role === 'MASTER' ? (
      <span className="practice-char relative text-[3.35rem] font-normal leading-none" style={{ color: '#000000' }}>
        {cell.character.char}
      </span>
    ) : (
      <HanziWriterTrace cell={cell} config={config} />
    )}
  </div>
);

const BlankPracticeRow = ({ config, rowIndex }: { config: WorkbookConfig; rowIndex: number }) => {
  const rowId = `blank-practice-row-${rowIndex}`;

  return (
    <div className="practice-row w-full">
      <PinyinTrack cellCount={practiceCellsPerRow} config={config} rowId={rowId} />
      <div className="grid w-full gap-x-[1.2mm]" style={{ gridTemplateColumns: `repeat(${practiceCellsPerRow}, minmax(0, 1fr))` }}>
        {Array.from({ length: practiceCellsPerRow }, (_, cellIndex) => (
          <div
            key={`${rowId}-cell-${cellIndex}`}
            className={[
              'hanzi-cell relative aspect-square min-w-0 overflow-hidden bg-white',
              config.showGrid ? 'mi-grid-bg' : '',
            ].join(' ')}
            style={getGridBackgroundStyle(config)}
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  );
};

const PracticeCanvas = ({ config, data }: PracticeCanvasProps) => (
  <div className="flex h-full flex-col gap-[0.25mm]">
    {data.map((character) => {
      const practiceCells = getPracticeCells(character, config);

      return (
      <div key={character.id} className="practice-row w-full">
        <PinyinTrack
          cellCount={practiceCells.length}
          character={character}
          config={config}
          rowId={character.id}
        />
        <div className="grid w-full gap-x-[1.2mm]" style={{ gridTemplateColumns: `repeat(${practiceCells.length}, minmax(0, 1fr))` }}>
          {practiceCells.map((cell) => (
            <PracticeCellView key={cell.id} cell={cell} config={config} />
          ))}
        </div>
      </div>
    );
    })}
    {Array.from({ length: Math.max(0, practiceRowsPerPage - data.length) }, (_, rowIndex) => (
      <BlankPracticeRow
        key={`page-blank-practice-row-${data.length}-${rowIndex}`}
        config={config}
        rowIndex={data.length + rowIndex}
      />
    ))}
  </div>
);

const PuzzleCanvas = ({ pieces }: PuzzleCanvasProps) => (
  <div className="grid h-full grid-cols-6 auto-rows-fr gap-4">
    {pieces.map((piece) => (
      <div
        key={piece.id}
        className="flex min-h-0 flex-col items-center justify-center border-2 border-dashed border-slate-500 bg-white"
      >
        <span className="practice-char text-5xl font-semibold leading-none text-slate-950">{piece.value}</span>
        <span className="practice-char mt-3 text-xs font-medium text-slate-400">{piece.sourceChar}</span>
      </div>
    ))}
  </div>
);

const EmptyPreviewState = () => (
  <div className="screen-only flex h-full items-center justify-center border-2 border-dashed border-slate-200 bg-slate-50 text-sm font-medium text-slate-500">
    请先在左侧选择需要打印的汉字
  </div>
);

const A4PageLayout = ({ config, mode, targetCharacters }: A4PageLayoutProps) => {
  const puzzlePieces = getPuzzlePieces(targetCharacters);
  const pages =
    mode === 'PRACTICE'
      ? chunkItems(targetCharacters, practiceRowsPerPage)
      : chunkItems(puzzlePieces, puzzlePiecesPerPage);

  return (
    <div className="print-root mx-auto flex flex-col items-center gap-8 py-8 print:block print:p-0">
      {pages.map((pageItems, pageIndex) => (
        <section
          key={`${mode}-page-${pageIndex}`}
          className="a4-page origin-top overflow-hidden bg-white p-[12mm] shadow-2xl ring-1 ring-slate-200 print:ring-0"
        >
          {mode === 'PRACTICE' ? (
            <PracticeCanvas config={config} data={pageItems as CharacterMeta[]} />
          ) : pageItems.length === 0 ? (
            <EmptyPreviewState />
          ) : (
            <PuzzleCanvas pieces={pageItems as CharacterPiece[]} />
          )}
        </section>
      ))}
    </div>
  );
};

export const PreviewContainer = () => {
  const { characterPool, config, outputMode, selectedCharIds } = useAppStore((state) => ({
    characterPool: state.characterPool,
    config: state.config,
    outputMode: state.outputMode,
    selectedCharIds: state.selectedCharIds,
  }));
  const targetCharacters = getSelectedCharacters(characterPool, selectedCharIds);

  return (
    <main className="min-h-screen flex-1 bg-slate-100">
      <style>{previewPrintStyles}</style>
      <PrintActionBar />
      <div className="overflow-auto px-8 pb-10">
        <div className="screen-only mx-auto flex max-w-[210mm] items-center justify-between pt-6 text-xs font-medium text-slate-500">
          <span>{outputMode === 'PRACTICE' ? '字帖练习模式' : '拼图游戏模式'}</span>
          <span>{targetCharacters.length} 个汉字</span>
        </div>
        <A4PageLayout config={config} mode={outputMode} targetCharacters={targetCharacters} />
      </div>
    </main>
  );
};

export { A4PageLayout, PracticeCanvas, PrintActionBar, PuzzleCanvas };
