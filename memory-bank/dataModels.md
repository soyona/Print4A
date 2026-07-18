# 数据契约模型 (dataModels.md)
# memory-bank/dataModels.md

```typescript
/**
 * @description 教材版本枚举，预留未来扩展
 */
export type TextbookVersion = 'PEP'; // PEP = 人教版

/**
 * @description 年级与学期枚举
 */
export type GradeLevel = '1' | '2' | '3' | '4' | '5' | '6';
export type SemesterType = 'UP' | 'DOWN'; // UP = 上册, DOWN = 下册

/**
 * @description 与运行时状态解耦的教材静态字库资产契约
 */
export interface TextbookCharacter {
  id: string;
  char: string;
  pinyin: string;
  grade: '1' | '2' | '3' | '4' | '5' | '6';
  semester: 'UP' | 'DOWN';
  unit: string;
  lesson: string;
}

/**
 * @description 原始教材字库元数据契约
 */
export interface CharacterMeta {
  id: string;            // 汉字唯一ID
  char: string;          // 汉字单字 (例如: "明")
  pinyin: string;        // 标准拼音带声调 (例如: "míng")
  strokes: string[];     // 兼容保留字段；笔顺矢量数据由 Hanzi Writer 引擎按 char 加载
  components: string[];  // 自动拆解后的核心部件/偏旁列表 (例如: ["日", "月"])
  version: TextbookVersion;
  grade: GradeLevel;
  semester: SemesterType;
  unit: number;          // 单元序列号 (1, 2, 3...)
}

/**
 * @description 字帖视觉排版配置状态宪法
 */
export interface WorkbookConfig {
  showGrid: boolean;         // 是否开启田字格底纹
  gridType: 'MI' | 'TIAN';   // 米字格 / 田字格
  gridLineWidth: number;     // 内部辅助线粗细
  gridLineColor: string;     // 内部辅助线颜色 HEX 值
  showPinyin: boolean;       // 是否显示拼音标注
  showStrokeGuide: boolean;  // 是否开启笔顺分解图引导
  textColor: string;         // 汉字文本颜色 HEX 值
  traceColor: string;        // 描红文本颜色 HEX 值
}

/**
 * @description Zustand 局部订阅全局/核心状态树定义
 */
export interface AppState {
  // 联动筛选状态
  filter: {
    version: TextbookVersion;
    grade: GradeLevel;
    semester: SemesterType;
    selectedUnit: number | null; // null 表示全册
  };
  // 字库数据源缓存
  characterPool: CharacterMeta[];
  // 用户勾选的汉字ID集合
  selectedCharIds: Set<string>;
  // 排版配置
  config: WorkbookConfig;
  
  // 核心 Mutations 动作约束
  setFilter: (updater: Partial<AppState['filter']>) => void;
  toggleCharacter: (id: string) => void;
  selectAllCharacters: (ids: string[]) => void;
  clearAllCharacters: () => void;
  updateConfig: (updater: Partial<WorkbookConfig>) => void;
}
