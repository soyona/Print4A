# 架构与设计模式 (systemPatterns.md)
## 1. 核心设计模式与目录哲学[cite: 8]
- 遵循三轨制职责划分，UI 纯组件与容器组件分离。[cite: 8]

## 2. UI 组件嵌套树与 Props 关系契约表

```

AppRoot
├── SidebarLayout (控制面板侧边栏)
│    ├── TextbookSelector (教材多级联动筛选器)
│    ├── CharacterPicker (生字网格自选面板)
│    └── VisualConfigPanel (字帖排版与视觉配置项)
└── PreviewContainer (右侧 A4 实时打印预览区)
├── PrintActionBar (打印触发动作条)
└── A4PageLayout (等比例 A4 纸张页面容器，通过 CSS Paged Media 控制原生打印行为)
└── PracticeCanvas (唯一启用的字帖渲染画布)

```

## 🔬 核心组件原子约束契约

### 1. `TextbookSelector`
* **输入 (Props)**: 无（直连 Zustand 局部订阅）。
* **输出 (Events)**:
  * `onFilterChange(filter: TextbookFilter)`: 教材封面或课文变更，触发状态更新并重置选字集。
* **副作用 (Side-Effects)**:
  * 当 `grade` 或 `semester` 变更时，状态机从该册 `characterPool` 中提取首个不重复课文标题并更新 `lesson`。
  * 教材封面抽屉默认展开，封面矩阵锁定 180px 最大高度并可滚动，选择后可折叠释放侧栏空间。

### 2. `CharacterPicker`
* **输入 (Props)**:
  * `characters: CharacterMeta[]`: 当前联动筛选出的待选汉字候选队列。
* **输出 (Events)**:
  * `onSelectionChange(selectedIds: string[])`: 派发勾选、全选或全清事件，同步至 Zustand。
* **副作用 (Side-Effects)**: 无。单纯响应式渲染字符网格。

### 3. `VisualConfigPanel`
* **输入 (Props)**: 无（直连 Zustand 局部订阅 `config` 状态）。
* **输出 (Events)**:
  * `onConfigItemChange(config: Partial<WorkbookConfig>)`: 细粒度修改背景格、拼音、笔顺或色值。
* **副作用 (Side-Effects)**:
  * 调色盘或开关变动时，必须通过 Zustand 触发右侧预览组件的局部重绘，确保实时“所见即所得”。

### 4. `A4PageLayout`
* **输入 (Props)**:
  * `targetCharacters: CharacterMeta[]`: 用户选中的汉字结构化实体数组。
  * `config: WorkbookConfig`: 冻结的排版样式宪法。
* **输出 (Events)**: 无。
* **副作用 (Side-Effects)**:
  * 依赖 Tailwind 的打印媒介查询 (`print:margin-0` 等) 和 CSS `page-break-after: always` 进行物理分页计算。
  * 当 `targetCharacters` 的数量突破 A4 页面最大网格容纳临界值时，在前端内存中动态切割子数组，分立渲染多个虚拟 A4 Page 节点。
