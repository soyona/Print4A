declare module 'hanzi-writer/dist/index.esm.js' {
  type HanziWriterOptions = {
    width?: number;
    height?: number;
    padding?: number;
    renderer?: 'svg' | 'canvas';
    showCharacter?: boolean;
    showOutline?: boolean;
    strokeColor?: string;
    radicalColor?: string | null;
    outlineColor?: string;
    highlightColor?: string;
    drawingColor?: string;
    strokeFadeDuration?: number;
    drawingFadeDuration?: number;
  };

  type QuizOptions = {
    quizStartStrokeNum?: number;
    showHintAfterMisses?: number | false;
    highlightOnComplete?: boolean;
    markStrokeCorrectAfterMisses?: number | false;
  };

  type HanziWriterInstance = {
    quiz: (options?: QuizOptions) => unknown;
    cancelQuiz: () => void;
  };

  const HanziWriter: {
    create: (element: string | HTMLElement, character: string, options?: HanziWriterOptions) => HanziWriterInstance;
  };

  export default HanziWriter;
}
