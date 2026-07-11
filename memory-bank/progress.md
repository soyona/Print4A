# 任务进度看板 (progress.md)
## 🚀 开发进度清单
[x] 产品经理交互动线升级完成：三组场景化 Presets、一键配置联动与纯空白纸清选字、12 行/页纸张预算实时反馈、高级自定义默认折叠及平滑展开全部落地

[x] 视觉与空间布局优化完成：384px 配置侧栏、沉浸式灰色工作台、A4 双层纸张阴影/浅灰边框/24px 页间距、动态页码边界指示器与打印纯净度清零规则全部落地

[x] Vercel 生产样式链路修复完成：接入 Tailwind Vite 插件与 CSS 入口，构建生成 CSS bundle，并通过生产预览布局、控制台及选字交互验证

[x] 已完成 Vercel 404 路由重定向与输出目录规范化修复

[x] 项目 V2.0.0-Matrix 目录架构与特化规则配置初始化成功

[x] 云端第一阶段图纸压榨（projectBrief/dataModels/systemPatterns）完成并本地覆盖

[x] 按照 dataModels.md 实现 src/types 强类型镜像[cite: 8]

[x] 按照 dataModels.md 实现 Zustand-compatible AppState Store 与 Mock 字库数据源

[x] 实现 PreviewContainer 右侧 A4 WYSIWYG 预览容器与原生打印排版切片

[x] 激活本地 Agent 开启宿主路由下的核心迭代

[x] 宿主根路由装配：`SidebarLayout` 与 `PreviewContainer` 并排融合

[x] 全局控制器实时刷新链路：年级筛选、生字勾选、模式切换驱动右侧 A4 画布更新

[x] 根目录独立 `test-print.html` 真机打印验证沙箱创建完成，可双击运行并一键触发 `window.print()`

[x] 田字格/米字格 1:1 绝对正方形几何锁定与全局练字标准楷体替换完成

[x] 横向单字流字帖引擎重构完成：单字一行、每行 12 格、四线三格拼音轨、笔顺渐进描红与空白练习格联动

[x] `traceCellsCount` / `emptyCellsCount` 配置契约、store 默认值、侧栏控制项、React A4 预览与 `test-print.html` 沙箱同步完成

[x] 字帖全局标准楷体（Kaiti）统一锁死完成：`.a4-page`、字帖行、黑色母字、灰色渐进笔顺描红、兜底完整字与拆解格部件字形全部同步覆盖

[x] 笔顺描红错误修复完成：移除笔画符号文本拼接，改为按正确 stroke path 顺序递增累积绘制 SVG

[x] 按附件完成「明」楷体笔顺递增快照与田字格/字形比例修正：1 个黑色母字格 + 8 个灰色递增描红格，动态列数、黑色粗外框、灰色十字虚线、94% 字形占比

[x] 局部字形快照流引擎升级完成：废除 CSS/SVG 拼装笔画方案，「明」「林」「赢」改为楷体可渲染递增快照数组，描红格单 `span` 渲染、淡灰色描红、全局楷体与 `border-2 border-black` 黑框契约同步落地

[x] Hanzi-Writer 矢量笔顺渐进引擎升级完成：废除文本快照与伪部件 `strokes`，12 格行式字帖、SVG 米字格、前 k 笔深灰矢量描红与剩余淡灰骨架、React/standalone 实例销毁重建链路同步落地

[x] V2.1.0-Kernel 契约对齐完成：`memory-bank/dataModels.md` 的 `WorkbookConfig` 已补齐 `traceCellsCount` / `emptyCellsCount`，并确认 Hanzi Writer 渲染边界不再依赖本地 `strokes` 伪笔顺数组

[x] React 与 `test-print.html` 字帖练习模式空状态自适应铺满同步完成：无生字时按 A4 物理可用空间动态生成 9 行 × 12 格纯空白拼音轨与 SVG 米字格矩阵，不挂载 Hanzi Writer、不渲染文本

[x] 字帖像素级视觉与满页排版升级完成：2px 黑色外框、0.75 淡灰辅助线、8mm 三等分拼音轨、PRACTICE 每页尾部空白行自动补齐，以及“模板配置”三模块侧栏与网格/描红控制落地

[x] 出版级字帖像素整容完成：独立 1.5px 深灰字格、1.5mm 列间距、6.5mm 淡色拼音轨、无 SVG 内框的稀疏米字格辅助线及 13 行 A4 满页算法落地

[x] 底层视觉结构强制覆写完成：0.8 极细米字格辅助线、独立 1.5px 深灰圆角外框、7mm 四线拼音轨、1.2mm 横向呼吸间距及 12 行尾页自动补齐算法落地

[x] 静态模板与 React 预览视觉一致性修复完成：1px 灰色独立字格、无 SVG 双重外框、7mm 三等分拼音轨底线贴合、1.2mm 格间距、0.25mm 行距与少字尾页补齐全面同步

[x] Vercel 404 部署配置修复完成：补齐 Vite 生产构建入口、根级 `index.html`、`dist` 输出目录与 SPA fallback，本地生产构建及 HTTP 200 产物验证通过

## 最近完成
- 2026-07-11: 已完成产品经理交互动线升级：模板配置顶部新增“幼小衔接·基础描红”“低年级·自主练字”“纯空白格·备用纸”三组高对比 Presets，分别联动拼音、米字格、笔顺引导、描红/留白数量与浅红/淡灰线色，纯空白场景同步清空选字并触发现有整页空状态算法。生字选择区新增按每页 12 行计算的实时纸张预算面板，动态显示已选字数、预计 A4 页数和尾页补齐行数；拼音、格子样式与笔顺描红微调默认折叠，由“高级自定义微调 ⚙️”平滑展开。黑名单审计、`git diff --check` 与 `npm run build` 一次通过，等待 Git 推送触发 Vercel 自动部署。
- 2026-07-11: 已完成产品经理视觉与空间布局优化：`SidebarLayout` 从 `w-80` 拓宽为 `w-96`，右侧 `main` 保持 `flex-1` 并使用 `bg-slate-200/80` 工作台背景；网页端 `.a4-page` 增加 24px 页间距、半透明浅灰边框及双层厚重阴影，相邻页面之间动态显示“- 第 X 页 / 共 Y 页 -”指示器。打印媒体隐藏指示器，并以 `!important` 清零页面 margin、shadow 与 border。`npm run build` 一次通过，黑名单审计及 `git diff --check` 通过，等待 Git 推送触发 Vercel 自动部署。
- 2026-07-11: 已修复 Vercel Deployment Details 404 的缺失构建入口：新增根级 `index.html`，在 `package.json` 增加 Vite `dev` / `build` / `preview` 脚本及锁定依赖，并在 `vercel.json` 显式配置 `npm run build`、`dist`、Vite 框架和 SPA fallback。`npm run build` 成功生成 `dist/index.html` 与哈希化 JS；本地生产预览根路径和 JS 资源均返回 HTTP 200，配置断言及 `git diff --check` 通过，可重新触发生产部署。
- 2026-07-11: 已一次性同步修正 `test-print.html` 与 `PreviewContainer.tsx`：删除静态 SVG 的 2px 黑色 `<rect>`，两侧字格统一为 `1px #64748b` 独立外框，内部辅助线统一为 `#cbd5e1`、0.8、`6 6`；四线三格统一为 7mm 且四条线位于顶部/1/3/2/3/底部，消除田字格上方空隙。拼音及字格 Grid 统一加入 1.2mm 横向间距，行距统一为 0.25mm；静态格宽/分页公式同步计入列间距，并为少字尾页补齐空白行。`npx tsc --noEmit` 0 报错，内嵌脚本 `embedded-js-ok 1`，目标差异空白检查通过；等待人类刷新静态模板视觉验收。
- 2026-07-11: 已按架构师指定代码结构强制覆写 `PreviewContainer`：米字格 SVG 移除自带外框，仅保留 `0.8` 宽度的淡灰十字与对角虚线；`.hanzi-cell` 锁定独立 `1.5px #1e293b` 外框、2px 圆角和 border-box。拼音轨改为 7mm，四线精确定位在 1.0/2.7/4.4/6.1mm，文字改为 10px；拼音、真实字格和空白补齐网格统一为 `gap-x-[1.2mm]`。分页常量同步后每页为 12 行，无字、少字及最后一页均通过 `BlankPracticeRow` 补满。`npx tsc --noEmit` 0 报错，目标差异空白检查通过；等待人类刷新验收。
- 2026-07-11: 已依据产品经理视觉评审完成 `PreviewContainer` 出版级像素整容：`.hanzi-cell` 改为独立 `1.5px #1e293b` 外框，字格网格与拼音轨统一使用 `1.5mm` 列间距，彻底消除相邻边框叠加；米字格 SVG 删除自带外框，仅保留 `#cbd5e1` 内部辅助线并采用 `6 6` 稀疏虚线。拼音轨收紧至 6.5mm、四线统一为 `#e2e8f0`，行距降至 0.25mm；分页公式计入列间距后得到 14.125mm 方格与每页 13 行。真实练习行、尾页补齐行和未选字空白行使用同一规范。`npx tsc --noEmit` 0 报错，目标差异空白检查通过；等待人类刷新验收。
- 2026-07-11: 已完成字帖像素级视觉与核心排版升级：`PreviewContainer` 的米字格/田字格 SVG 使用 `stroke-width="2"` 黑色外框，内部十字/斜线默认调整为 `0.75`、`#cbd5e1`；拼音轨由 10mm 收紧至 8mm，以四条线严格三等分并保持拼音视觉居中。PRACTICE 分页对每一页实际生字行动态追加 `practiceRowsPerPage - data.length` 个 `BlankPracticeRow`，确保空状态与最后一页均铺满、整页时补 0 行。左栏更名为“模板配置”，重组为字帖内容、格子样式、笔顺描红三组，新增 Show Pinyin、Show Grid、米/田字格、辅助线粗细/颜色、Show Stroke Guide 与灰/红描红控制；`WorkbookConfig`、store 默认值和 memory 契约已同步。`npx tsc --noEmit` 0 报错，目标文件差异空白检查通过；等待人类刷新进行像素级视觉验收。
- 2026-07-11: 已同步修复静态沙箱 `test-print.html` 空状态：原生 JavaScript 采用与 React 同形的 A4 物理常量动态计算 `practiceRowsPerPage = 9`，未选字时循环生成 9 行 × 12 格纯空白矩阵，每行保留无拼音字符的四线三格轨道、黑色外框与 `.mi-grid-bg` SVG 米字格，不创建 Hanzi Writer 容器；有字时继续走原渐进笔顺链路。`.a4-page` 字体覆盖与 `.mi-grid-bg` CSS 已核对同步。`npx tsc --noEmit` 0 报错，内嵌脚本为 `embedded-js-ok 1`；本地浏览器验证空状态 9 行/108 格/0 Writer，选择“明”为 1 行/12 格/8 Writer，清空后恢复 9 行/108 格/0 Writer。等待人类不选字刷新 `test-print.html` 做最终真机质检。
- 2026-07-11: 已完成字帖练习模式空状态自适应铺满：`src/components/PreviewContainer.tsx` 根据 A4 297mm 高度、24mm 垂直页边距、10mm 拼音轨、15.5mm 方格与 2.4mm 行距动态计算每页 9 行，并在未选择生字时渲染 9 行 × 12 格纯空白矩阵；空行复用有字状态的四线三格轨道、`border-2 border-black` 与 `.mi-grid-bg` SVG 米字格，内部不渲染文本、不创建 Hanzi Writer 目标或实例。有字状态继续走原渐进笔顺链路。已运行 `npx tsc --noEmit`，0 报错；当前停下等待人类空状态真机质检。
- 2026-07-10: 已完成 V2.1.0-Kernel 契约对齐与人工质检闭环准备：`memory-bank/dataModels.md` 的 `WorkbookConfig` 已补齐 `traceCellsCount: number` 与 `emptyCellsCount: number`，与 `src/types/index.ts` 保持同形；已核对 `src/store/useAppStore.ts` 与 `test-print.html` 中 `strokes` 均为空兼容字段，React 预览与 standalone 沙箱均通过 Hanzi Writer 按 `char` / `data-hanzi` 加载矢量笔顺，未发现 `character.strokes` 渲染读取、旧 `StrokeMask`、`clipPath` 或黑名单笔顺方案残留。已运行 `npx tsc --noEmit`，0 报错；`test-print.html` 内嵌脚本语法检查为 `embedded-js-ok 1`。当前停下等待人类双击刷新真机质检。
- 2026-07-10: 已完成工业级 Hanzi-Writer 矢量笔顺渐进引擎重构：`test-print.html` 引入 Hanzi Writer CDN，React 宿主安装 `hanzi-writer@3.5.0`；`PreviewContainer` 与 standalone 沙箱均改为每字 12 个正方形格，第 1 格纯黑无加粗楷体母字，第 2-9 格生成 `.hanzi-writer-target aspect-square mx-auto` 并通过 `quizStartStrokeNum` 渲染前 k 笔深灰/配置色与剩余淡灰轮廓，第 10-12 格留白。米字格已改为 SVG data URI，拼音轨沿 12 列居中对齐；旧 `span` 描红、CSS 绝对定位堆叠字符、伪部件 `strokes` 快照链路已作废，`strokes` 数据清空为兼容字段。已运行 `npx tsc --noEmit`，0 报错；`test-print.html` 内嵌脚本语法检查为 `embedded-js-ok 1`，等待人类刷新质检。
- 2026-07-10: 已根据人类架构审查完成局部字形快照流升级：`src/store/useAppStore.ts` 与 `test-print.html` 中「明」「林」「赢」的 `strokes` 已分别改为 `['丨', '冂', '日', '日', '明', '明', '明', '明']`、`['一', '十', '木', '木', '林', '林', '林', '林']`、`['亡', '口', '月', '贝', '凡', '赢', '赢', '赢']`；`src/components/PreviewContainer.tsx` 与 `test-print.html` 已删除 `StrokeMask`、`clipPath`、SVG path 累积绘制和多笔画重叠逻辑，描红格只渲染一个淡灰 `span.practice-char` 快照字符。`memory-bank/dataModels.md` 与 `src/types/index.ts` 已同步更新 `strokes` 数据契约为递增字形快照列表。已运行 `npx tsc --noEmit`，0 报错；`test-print.html` 内嵌脚本语法检查为 `embedded-js-ok`，等待人类刷新 `test-print.html` 验收。
- 2026-07-10: 已按附件完成「明」字笔顺递增与比例修正：新增 `StrokeMask` 契约，在 `src/store/useAppStore.ts` 与 `test-print.html` 为「明」配置 8 个逐笔 mask；`src/components/PreviewContainer.tsx` 与 `test-print.html` 改用同一个标准楷体 SVG `<text>` 叠加累计 `clipPath`，逐格显示第 1 画、前 2 画、前 3 画直到 8 画完整字。默认配置改为 8 个描红格、0 个空白格，练字行按实际格数动态列布局；田字格改为黑色粗外框、灰色十字虚线，字形占比提升到 94%/字号 86。已运行 `embedded-js-ok`、`npm run type-check`、`npx tsc --noEmit`，均通过。
- 2026-07-10: 已根据真机反馈修复笔顺显示错误：`src/store/useAppStore.ts` 与 `test-print.html` 的「明」「赢」「林」笔顺数据改为 SVG path 序列；`src/components/PreviewContainer.tsx` 与 `test-print.html` 的描红渲染从 `strokes.slice(...).join("")` 文本拼接改为按 `traceStep` 累积绘制 `<path>`，确保每个描红格按正确笔画顺序递增。已运行 `test-print.html` 内嵌脚本语法检查，结果为 `embedded-js-ok`；`npx tsc --noEmit` 为 0 报错。in-app browser 自动刷新 `file://` 页面被 Browser URL policy 阻止，未绕过，等待人类手动刷新验收。
- 2026-07-10: 已完成最后一项全局字体统一专项修正：`test-print.html` 与 `src/components/PreviewContainer.tsx` 均在 `.a4-page` 及其全部后代上强制应用 `"Kaiti", "STKaiti", "华文楷体", "楷体", serif !important`；`practice-char`、`practice-row` 与拼图拆解格字形同步补锁，确认无 `font-sans` 冲突；`test-print.html` 内嵌脚本语法检查为 `embedded-js-ok`，`npx tsc --noEmit` 为 0 报错。当前停下等待人类最终真机刷新验收。
- 2026-07-09: 已彻底重构字帖练习模式 A4 物理排版：`PreviewContainer` 从 16 宫格大方块改为横向单字渐进流，每个选中字独占一行，每行 12 个 `aspect-square` 正方形米字格；上方新增贯穿整行的四线三格拼音轨，首格拼音黑色、后续拼音淡灰色。
- 2026-07-09: 已实现渐进描红配置联动：`WorkbookConfig` 新增 `traceCellsCount` 与 `emptyCellsCount`，store 默认值为 9 个描红格、2 个空白格；`SidebarLayout` 新增数字/范围调节控件，实时刷新右侧 A4 预览。拼图模式保持原 1:1 部件虚线裁剪框算法不变。
- 2026-07-09: 已同步改造 `test-print.html` 独立打印验证沙箱，使其控制项、分页常量、四线三格拼音轨与 12 格横向渐进算法和 React 入口一致；运行 `npx tsc --noEmit`，结果为 0 报错；内嵌脚本语法检查结果为 `embedded-js-ok`。
- 2026-07-09: 已同步修正 `test-print.html` 与 `src/components/PreviewContainer.tsx` 的练字视觉缺陷：外层练字单元格改为 `aspect-square`，内层米字格改为 `aspect-square mx-auto`，并为汉字正文与描红层注入 `"Kaiti", "STKaiti", "华文楷体", "楷体", serif` 楷体字体族；重新运行 `npx tsc --noEmit`，结果为 0 报错。
- 2026-07-09: 已在项目根目录创建 `test-print.html` 独立单文件验证沙箱，内聚 HTML/Tailwind/CSS Paged Media 结构，并用纯 JavaScript 复现 `useAppStore` 核心状态机、`PracticeCanvas` 米字格渐变线与 `PuzzleCanvas` 部件拆解虚线裁剪框逻辑；人类可以直接双击该文件切换字帖/拼图模式并唤起原生打印验证。
- 2026-07-09: 已校验 `test-print.html` 内嵌脚本语法，结果为 `embedded-js-ok`；同时运行 `npm run type-check`，结果为 0 报错。
- 2026-07-09: 已完成宿主根路由装配，新增 `src/App.tsx` 将 `SidebarLayout` 与 `PreviewContainer` 以 `flex min-h-screen bg-slate-100` 并排融合；`src/main.ts` 通过 `react-dom/client` 挂载到 `#root`。
- 2026-07-09: 已将 `src/store/useAppStore.ts` 接入 React `useSyncExternalStore`，保证左侧教材筛选、生字选择、全选/清空与 `ModeSwitcher` 模式切换能触发订阅组件重渲染，右侧 A4 字帖网格与部件拆解拼图网格实时刷新。
- 2026-07-09: 已补齐真实 React 集成依赖 `react`、`react-dom`、`@types/react`、`@types/react-dom`，删除离线 TSX shim `src/types/react-jsx-runtime.d.ts`，并完成最后一次 `npx tsc --noEmit` 0 报错绿色通行证。
- 2026-07-09: 已实现 `src/components/PreviewContainer.tsx`，包含 `PrintActionBar` 一键触发 `window.print()`、`.a4-page` 物理 A4 尺寸锁定、打印分页规则、`PRACTICE` 字帖网格渲染与 `PUZZLE` 部件虚线裁剪框渲染；通过局部 selector 从 Store 读取输出模式、视觉配置和当前已选汉字数据，并通过 `npx tsc --noEmit` 0 报错校验。
- 2026-07-09: 已实现 `src/components/SidebarLayout.tsx` UI 控制层首切片，包含 `TextbookSelector` 年级/学期/单元联动筛选与 `CharacterPicker` 生字网格、单选、全选、清空；同步修复 `setFilter` 联动切换时的旧单元与已选 ID 残留隐患，并通过 `npx tsc --noEmit` 0 报错校验。
- 2026-07-09: 已修复 `src/store/useAppStore.ts` 中 Zustand-compatible Action 的隐式 any 漏洞，显式补齐类型导入路径与 Action 入参类型，并通过 `npx tsc --noEmit` 0 报错校验。
- 2026-07-09: 已按 `memory-bank/dataModels.md` 构建 `src/store/useAppStore.ts` 状态管理层，注入 “明”“赢”“林” Mock 字库数据，并通过严格 TypeScript 校验。
- 2026-07-09: 已按 `memory-bank/dataModels.md` 原样初始化 `src/types/index.ts` 类型定义，并通过单文件严格 TypeScript 校验。
