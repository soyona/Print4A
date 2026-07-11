# 动态上下文 (activeContext.md)
## 当前所处阶段（2026-07-11 左侧控制精简与网格逻辑解耦完成）
已完成“取消输出模式默认字帖，清洗左侧面板中英混杂文案，并解耦‘显示网格’逻辑使其仅控制内部虚线而非外边框”。

`src/components/SidebarLayout.tsx` 已删除输出模式区块与 `ModeSwitcher`，并将“显示拼音 Show Pinyin”“显示网格 Show Grid”“笔顺引导 Show Stroke Guide”统一清洗为“显示拼音”“显示网格”“笔顺引导”。`src/types/index.ts` 与 `src/store/useAppStore.ts` 已删除 `OutputMode`、`outputMode`、`setOutputMode`，右侧预览固定且唯一走字帖渲染路径，不再保留拼图选择分支。

`src/components/PreviewContainer.tsx` 已将 `.hanzi-cell` 永久挂载到所有真实与空白练字格；`showGrid` 仅决定 `mi-grid-bg` SVG 内部十字/米字虚线背景是否出现。连续外框始终由 `.practice-grid` 左边框、每格右/下边框及无拼音时的顶部边框组成，关闭“显示网格”不会再破坏田字格基础骨架。`npm run build` 通过，Vite 转换 21 个模块，生成 CSS 23.76 kB（gzip 5.22 kB）与 JS 252.23 kB（gzip 77.69 kB）；源码残留审计与 `git diff --check` 通过。

## 当前所处阶段（2026-07-11 出版级字帖规范修复完成）
正在执行出版级字帖规范修复：统一首字与笔顺字形对齐、消除田字格间距、合并四线三格与田字格共用实线。

`src/components/PreviewContainer.tsx` 与 `test-print.html` 已同步完成像素级结构重构：首格母字彻底移除系统文本渲染，统一通过 Hanzi Writer 以相同容器尺寸、`padding: 5` 和 SVG 字形数据渲染，并明确锁定 `showOutline: false`、`strokeColor: '#000000'`；后续笔顺格沿用同一引擎和比例执行渐进描红。

12 列田字格已移除全部 `1.2mm` 横向 gap，改为整行左边框配合每格右/下边框的单线邻接结构。四线三格前三线降噪为浅灰虚线，第四线改为与田字格同粗的纯黑实线，并直接承担字格顶边，实现拼音轨与田字格零缝隙共线缝合；关闭拼音时由字格容器补回顶边。内部十字/米字辅助线保持绝对居中，统一为浅灰 `0.8` 线宽及 `6 8` 虚线节奏。静态打印沙箱同步移除文本母字和旧列间距，内嵌脚本检查为 `embedded-js-ok 1`。`npm run build` 一次通过，Vite 转换 21 个模块，生成 CSS 23.76 kB（gzip 5.22 kB）与 JS 254.17 kB（gzip 78.15 kB）；`git diff --check` 通过，等待人类刷新线上地址验收。

## 当前所处阶段（2026-07-11 同源字形、成对轨道与满页空白模板修复完成）
已完成四项出版规范修复。`src/components/PreviewContainer.tsx` 的黑色母字不再使用系统楷体文本，而是通过 Hanzi Writer `showCharacter` 与渐进描红共享同一字符数据、尺寸和内边距，消除“哪、宽”等字的笔画长度、重心与部件比例差异；母字颜色读取 `config.textColor`，描红颜色读取 `config.traceColor`。

每个固定两行汉字块现拆为两组严格成对的“7mm 四线三格拼音轨 + 12 格田字格”，并分别响应 `showPinyin` / `showGrid`：关闭拼音后轨道不占高度，关闭网格后外框和内部辅助线同时隐藏。拼音使用 Arial / Helvetica 拉丁字形，不再被全局楷体覆盖，并以第三条线为基线定位，使普通小写字母占中格、升部进入上格、降部进入下格。分页物理高度同步按双拼音轨计算，每页固定 6 个双行汉字块；无论选中 0 至 6 个字，尾页均通过 `practiceRowsPerPage - data.length` 补齐纯空白模板块。侧栏纸张预算同步为每页 6 个双行块及尾页空白块数量。黑名单审计、旧实现残留审计、`git diff --check` 与 `npm run build` 一次通过；Vite 处理 21 个模块，生成 CSS 23.96 kB（gzip 5.28 kB）与 JS 253.94 kB（gzip 78.12 kB），等待人类刷新验收。

## 当前所处阶段（2026-07-11 固定两行完整笔顺与补空格重构完成）
已将每个汉字的练字区域重构为固定 12 列、合计至少 24 格的完整行：先顺序放置 1 个母字格与全部真实笔顺格，再用空白练习格补齐两整行；公式锁定为 `max(24, ceil((1 + 总笔画数) / 12) × 12)`，超过 23 画时自动扩展到下一个完整 12 格行，严禁截断。当前字库中“两”为 8 个已用格 + 16 个空白格，“哪”为 10 + 14，“宽”为 11 + 13，“睛”为 14 + 10。

`src/components/PreviewContainer.tsx` 已删除按笔画数缩小和居中策略，拼音、母字、笔顺与补空格统一使用固定尺寸、12 列左对齐网格；笔顺数据改为选字后统一预载，加载完成前禁用打印，失败时显示具体汉字，描红颜色真实读取 `config.traceColor`。纯空白纸模式同步按每组 24 格铺排。`src/components/SidebarLayout.tsx`、`src/types/index.ts`、`src/store/useAppStore.ts` 与 `memory-bank/dataModels.md` 已移除作废的 `traceCellsCount` / `emptyCellsCount` 字段并更新自动补齐说明。黑名单审计、公式断言、`git diff --check` 与 `npm run build` 通过；Vite 处理 21 个模块，生成 CSS 24.07 kB（gzip 5.31 kB）与 JS 253.56 kB（gzip 77.97 kB），等待人类刷新本地或线上页面验收。

## 当前所处阶段（2026-07-11 笔顺完整性与空白练习格修复完成）
已修复字帖中高笔画汉字仅显示前 8 画、每字空白练习田字格配置失效的问题。`src/components/PreviewContainer.tsx` 已移除固定 8 格渲染常量，12 格行预算现在真实读取 `traceCellsCount` / `emptyCellsCount`，按“1 个母字格 + 可配置描红格 + 至少 1 个空白练习格”进行强约束分配；最后一个描红格不再停留在固定笔画数，而是由 Hanzi Writer 直接展示完整汉字，辅助技术标签同步标记为“完整笔顺描红”。

`src/store/useAppStore.ts` 与 `src/components/SidebarLayout.tsx` 的幼小衔接默认值已统一为 8 个描红格、3 个空白练习格；高级设置限制同步收敛为描红格最多 10、空白格 1 至 11，避免突破 12 格物理预算。黑名单审计与 `git diff --check` 通过；`npm run build` 一次通过，Vite 处理 21 个模块，生成 CSS 23.86 kB（gzip 5.26 kB）与 JS 253.33 kB（gzip 77.64 kB），类型完全契合，等待人类刷新线上验收。

## 当前所处阶段（2026-07-11 完整逐笔行与独立练习行重构完成）
已按人类验收反馈完成真正的完整笔顺重构。`src/components/PreviewContainer.tsx` 通过 Hanzi Writer `loadCharacterData(character.char)` 获取真实 `strokes.length`，为每个汉字动态生成“母字格 + 第 1 画至最后一画”的完整渐进笔顺行；不再受固定 8 格或 12 格描红预算截断，因此“哪”生成 9 个逐笔格，“睛”生成 13 个逐笔格，末格展示完整字形。笔顺格会按真实数量在 A4 可用宽度内等比收缩并保持正方形。

每个汉字的完整笔顺行下方现固定追加一整行 12 个独立空白田字格练习区；分页物理高度同步按“双行字块”重新计算。`src/components/SidebarLayout.tsx` 已移除失效的固定描红格/空白格数量控件，改为说明自动完整笔顺与独立练习行规则；`src/types/hanzi-writer-esm.d.ts` 补齐字符数据加载强类型。黑名单审计与 `git diff --check` 通过；`npm run build` 一次通过，Vite 处理 21 个模块，生成 CSS 23.94 kB（gzip 5.28 kB）与 JS 253.22 kB（gzip 77.72 kB），等待人类刷新线上验收。

## 当前所处阶段（2026-07-11 字库静态解耦改造完成）
已完成字库静态解耦改造，补充人教版二年级上册第一、二单元高频字库数据资产。新增 `src/types/textbook.ts` 的 `TextbookCharacter` 强类型契约与 `src/data/textbooks/pep-y2-s1.ts` 独立教材资产，按单元和课名录入“两、哪、宽、顶、眼、睛、肚、皮、孩、跳、变、极、片、傍、园、孔、桥、群、队、旗、杨、壮、枫、松、柏、棉”共 26 个核心生字。

`src/store/useAppStore.ts` 已彻底移除“明、赢、林”硬编码 Mock，通过明确的强类型适配边界将教材资产转为 `CharacterMeta[]` 并作为 `characterPool` 初始静态数据源；默认筛选已切换为二年级上册（`grade: '2'`、`semester: 'UP'`），现有严格筛选逻辑可直接命中第一、二单元数据。黑名单审计与 `git diff --check` 通过；`npm run build` 一次通过，Vite 处理 21 个模块，生成 CSS 23.86 kB（gzip 5.26 kB）与 JS 253.07 kB（gzip 77.56 kB），类型契合且构建体积无异常，等待人类刷新线上验收。

## 当前所处阶段（2026-07-11 产品经理出版级视觉打磨完成）
已完成产品经理出版级视觉打磨：`src/components/PreviewContainer.tsx` 的拼音由 10px 提升至 12px 半粗体，四线三格改为更柔和的淡灰实线，并在拼音字形后加入极小白色保护底，确保放大的字母与 ā、á、ǎ、à 等声调不会被轨道线横切或遮挡。

Hanzi Writer 渐进笔顺的已写笔画、提示与绘制色统一锁定为经典墨蓝 `#1e3a8a`，剩余骨架淡化为灰蓝 `#f1f5f9`；米字格十字线与对角线的 SVG 节奏由 `6 6` 放宽为 `6 8`。PRACTICE 行距继续锁定在合规黄金区间下限 `0.25mm`，分页物理计算保持同步。已运行 `git diff --check` 与 `npm run build`，TypeScript、Vite、Tailwind 生产构建一次通过，生成 `dist/assets/index-Aes2nyFg.css` 与 `dist/assets/index-D6onOV9S.js`。

## 当前所处阶段（2026-07-11 产品经理交互动线升级完成）
已完成产品经理交互动线升级：左侧模板配置顶部新增三组高对比场景化一键预设。幼小衔接预设联动开启拼音、米字格与笔顺引导，设置 8 格浅红描红、0 格留白；低年级预设关闭拼音与笔顺引导，形成 1 格黑色母字加 11 格淡灰空白练习格；纯空白备用纸预设会清空全部选字，并复用现有空状态算法铺满整页。

生字选择区已在全选/清空操作旁加入纸张预算实时指示器，按每页 12 行动态反馈已选字数、预计 A4 页数及尾页纯空白补齐行数，并通过 `aria-live` 提供即时状态反馈。格子样式、拼音及笔顺描红精细表单默认折叠，由“高级自定义微调 ⚙️”控制平滑展开，降低新用户首次使用的信息密度。

本轮修改范围为 `src/components/SidebarLayout.tsx` 与 `src/store/useAppStore.ts`。已运行黑名单审计、`git diff --check` 与 `npm run build`，TypeScript、Vite、Tailwind 生产构建一次通过，生成完整 CSS/JS 静态产物；具备 Git 推送后触发 Vercel 自动部署并进行线上终极质检的条件。

## 当前所处阶段（2026-07-11 视觉与空间布局优化完成）
已完成产品经理视觉与空间布局优化：`SidebarLayout` 由 320px 拓宽至 384px，右侧 `main` 保持 `flex-1` 并将工作台调整为 `bg-slate-200/80`，显著拉开白色 A4 纸张与网页背景的明暗反差。

网页端 `.a4-page` 已加入 24px 物理页间距、半透明浅灰边框与双层厚重阴影；多页循环在相邻页面之间动态显示“- 第 X 页 / 共 Y 页 -”边界指示器。打印媒体明确隐藏指示器，并对每页执行 `margin: 0 !important`、`box-shadow: none !important`、`border: none !important`，确保 A4 输出纯净。已运行 `npm run build`，TypeScript 与 Vite 生产构建一次通过，生成完整 CSS/JS 静态产物；黑名单审计与 `git diff --check` 同步通过，等待 Git 推送触发 Vercel 自动部署。

## 当前所处阶段（2026-07-11 Vercel 生产样式链路修复完成）
已完成 Vercel 生产样式错乱修复。根因是 React 源码广泛使用 Tailwind utility class，但 Vite 生产入口未加载 CSS、构建链路也未接入 Tailwind，旧 `dist` 因此仅含 HTML 与 JS。现已新增 `src/styles.css` 并通过根级 `index.html` 加载，新增 `vite.config.ts` 接入官方 `@tailwindcss/vite` 插件，`package.json` / `package-lock.json` 同步加入 `tailwindcss` 与 `@tailwindcss/vite`。

运行 `npm run build` 成功，`dist` 现生成 `index.html`、`assets/index-90AMKwrn.js` 与 `assets/index-ButMuMPc.css`；CSS bundle 已确认包含 `.flex`、`.min-h-screen`、`.w-80`、`.bg-slate-100` 与 `@media print`。本地 Vite production preview 在 1280×720 下验证根布局为 flex、侧栏宽 320px 且 sticky、主区域 flex-grow 为 1、body margin 为 0，控制台 0 error/warn；点击“明”后页面显示 1 个汉字并生成 8 个 Hanzi Writer 目标。当前改动具备通过 Git 推送触发 Vercel 重建的条件。

## 当前所处阶段（2026-07-11 Vercel 404 部署配置修复）
已完成 Vercel 404 路由重定向与输出目录规范化修复。根级 `index.html` 正确挂载 `#root` 并加载 `/src/main.ts`；`package.json` 的 `build` 脚本执行 `tsc --noEmit && vite build`，Vite 默认将完整静态产物输出到根级 `dist`。`vercel.json` 已无条件覆写为指定的 `cleanUrls: true`、`trailingSlash: false` 与全路径 SPA fallback。运行 `npm run build` 成功，生成 `dist/index.html` 与 `dist/assets/index-CBKpSJHp.js`；配置 JSON 断言、产物断言与 `git diff --check` 均通过。当前部署文件已具备通过 Git 推送重新触发 Vercel Production Deployment 的条件。

## 当前所处阶段（2026-07-11 双渲染面视觉一致性修复）
已完成静态模板 `test-print.html` 与 React `src/components/PreviewContainer.tsx` 的一次性同步修正：两侧均移除 SVG 自带外框，米字格只保留 `#cbd5e1`、`0.8`、`6 6` 的内部辅助线；字格外框统一收敛为 `1px solid #64748b`、无圆角、`border-box`，彻底消除双重粗黑边框。

四线三格统一为 7mm 高、`#cbd5e1` 淡灰虚线，四条线严格位于顶部、1/3、2/3、底部，底线与田字格顶部零空隙贴合；拼音字号统一为 10px。拼音轨、真实字格与空白字格统一使用 `gap-x-[1.2mm]`，行距统一为 0.25mm，静态模板的格宽与每页行数公式同步计入 11 个列间距。静态模板同时补齐少字尾页，使其与 React 一样按 `practiceRowsPerPage - characters.length` 生成 `BlankPracticeRow`。

已运行 `npx tsc --noEmit`，结果为 0 报错；`test-print.html` 内嵌脚本语法检查为 `embedded-js-ok 1`；目标文件 `git diff --check` 通过；旧版 `<rect>` 外框、`border-2 border-black`、10mm 拼音轨、2.4mm 行距、1.4 粗辅助线均已确认清除。浏览器控制接口本轮未暴露，当前停止 Act，等待人类刷新 `test-print.html` 完成最终视觉确认。

全面覆写 CSS 字符串与组件 Grid 属性，强制注入 gap-x 并精简 SVG 内部辅助线，实现彻底的视觉质变

## 当前所处阶段（2026-07-11 底层视觉结构强制覆写）
本轮已按架构师给定结构完成 `src/components/PreviewContainer.tsx` 强制覆写：`.mi-grid-bg` 的 SVG 仅保留 `#cbd5e1`、`0.8` 宽度、`6 6` 节奏的十字与对角虚线；`.hanzi-cell` 统一使用 `1.5px solid #1e293b !important` 独立外框、`2px` 圆角与 `border-box`。拼音轨锁定为 7mm，四线位置依次为 1.0mm、2.7mm、4.4mm、6.1mm，拼音字号为 10px。

拼音网格、真实练习行与空白补齐行均统一注入 `gap-x-[1.2mm]`，分页物理常量同步为 1.2mm 列间距与 7mm 拼音轨；当前格宽为 14.4mm，每页动态容纳 12 行。`chunkItems` 在无字时仍生成一个 PRACTICE 空页，每页继续通过 `Math.max(0, practiceRowsPerPage - data.length)` 补齐 `BlankPracticeRow`，覆盖无字、少字和最后一页不足三种情况。已运行 `npx tsc --noEmit`，结果为 0 报错；目标差异空白检查通过。当前停止 Act，等待人类刷新界面进行像素级验收。

正在按照产品经理标准对字帖实施像素级整容：拉开字格间距消除重叠粗线，收紧拼音轨并全面淡化米字格内部虚线

## 当前所处阶段（2026-07-11 出版级字帖视觉整容）
本轮已完成 `src/components/PreviewContainer.tsx` 的像素级修正：每个 `.hanzi-cell` 使用独立 `1.5px solid #1e293b` 外框，12 列网格与拼音轨统一加入 `1.5mm` 水平间距，相邻格不再共享或叠加边框。米字格 SVG 已移除内部 `<rect>` 外框，仅保留 `#cbd5e1` 辅助线，并将十字线和对角线的虚线节奏调整为 `6 6`。

拼音轨由 8mm 收紧至 6.5mm，四条轨道线统一淡化为 `#e2e8f0`。A4 物理分页公式现将 11 个列间距计入格宽，单格约 14.125mm；上下练习行间距收紧为 0.25mm，`practiceRowsPerPage` 重新计算为 13。普通练习行、尾页补齐行及未选字时的 `BlankPracticeRow` 全部复用同一视觉契约。已运行 `npx tsc --noEmit`，结果为 0 报错；目标文件 `git diff --check` 通过。当前停止 Act，等待人类刷新进行出版级视觉质检。

正在像素级重构字帖与拼音轨比例，实现页末空白行自动补齐填充算法，并将左侧更名为模板配置进行体验升级

本轮允许修改 `src/components/PreviewContainer.tsx`、`src/components/SidebarLayout.tsx`、`src/types/index.ts`、`src/store/useAppStore.ts` 与 `memory-bank/dataModels.md`：统一米字格/田字格外框和内部辅助线比例，收紧四线三格拼音轨；在 PRACTICE 模式对每页不足 `practiceRowsPerPage` 的尾部动态补齐空白练习行；将侧栏整理为“字帖内容 / 格子样式 / 笔顺描红”三组模板配置，并补齐网格类型、线宽、线色及描红色方案的强类型配置契约。

## 当前所处阶段（2026-07-11 像素级排版升级）
本轮已完成：米字格/田字格保持 `stroke-width="2"` 黑色实线外框，内部十字线与米字格斜线默认使用 `0.75`、`#cbd5e1` 淡灰虚线；四线三格轨道由 10mm 收紧为 8mm，并以 0、1/3、2/3、100% 四条线严格三等分，拼音内容在轨道中格视觉居中。PRACTICE 页面切片继续以实时计算的 `practiceRowsPerPage` 为基准，每页实际生字行之后追加 `practiceRowsPerPage - data.length` 个 `BlankPracticeRow`，空状态、尾页不足与整页整数倍分别得到满页、差值补齐与零补齐结果。

左侧标题已正式更名为“模板配置”，表单重组为“字帖内容 / 格子样式 / 笔顺描红”三组；新增 Show Pinyin、Show Grid、米字格/田字格、辅助线粗细/颜色、Show Stroke Guide、灰度/红色描红控制，并保留描红格与空白练习格调节。`WorkbookConfig` 的源码与 memory 契约同步新增 `gridType`、`gridLineWidth`、`gridLineColor`，store 默认值为 `MI`、`0.75`、`#cbd5e1`。已运行 `npx tsc --noEmit`，结果为 0 报错；目标文件 `git diff --check` 通过。全仓仅保留本轮前已存在的 `memory-bank/techContext.md:8` 行尾空格，未修改该权威文件。当前停止 Act，等待人类刷新验收字帖视觉与满页效果。

正在同步修复静态沙箱 test-print.html 的空状态，使其在未选字时同样自动利用原生 JS 循环铺满空白米字格。

## 当前所处阶段
React 与静态打印沙箱的字帖空状态自适应铺满逻辑已同步完成并通过脚本、TypeScript 与本地浏览器交互校验；当前停下等待人类刷新 `test-print.html` 做最终真机质检。

## 当前细分任务
已完成静态沙箱 `test-print.html` 的空状态同步：当未选择生字时，原生 JavaScript 使用与 React 同形的 A4 物理常量计算 `practiceRowsPerPage = 9`，循环生成 9 行 × 12 格纯空白矩阵；每行包含无拼音字符的四线三格轨道、`border-2 border-black` 外框与可配置 `.mi-grid-bg` SVG 米字格，不创建 `.hanzi-writer-target`。有字状态继续沿用 Hanzi Writer 渐进笔顺链路；现有 `.a4-page` 字体覆盖与 `.mi-grid-bg` CSS 已核对为和 `previewPrintStyles` 同值，同时把普通练字格的外框类收敛为 React 同形。

已运行 `npx tsc --noEmit`，结果为 0 报错；内嵌脚本语法检查为 `embedded-js-ok 1`；目标差异空白检查通过。通过 `http://127.0.0.1:8765/test-print.html` 完成本地浏览器交互闭环：初始空状态为 1 页、9 行、108 个米字格、0 个拼音字符、0 个 Hanzi Writer 容器；选择“明”后为 1 行、12 格、8 个 Hanzi Writer 渐进容器；点击“清空”后恢复 9 行、108 个空白米字格且无 Writer 容器。控制台仅有静态沙箱既有的 Tailwind CDN 开发环境提示。当前停止 Act，等待人类在不选字时刷新 `test-print.html` 进行最终神迹质检。

本轮仅修改 `src/components/PreviewContainer.tsx` 及其组件内聚布局样式。现已依据 A4 高 297mm、上下页边距共 24mm、拼音轨高 10mm、12 列在 186mm 可用宽度下形成的 15.5mm 方格高度与 2.4mm 行距，动态计算每页最大空白行数为 9；空状态渲染 9 行 × 12 格纯空白矩阵。每行复用四线三格拼音轨、`border-2 border-black` 外框与 `.mi-grid-bg` SVG 米字格背景，格内不渲染任何文本、不生成 `.hanzi-writer-target`，也不挂载 Hanzi Writer 实例；有字状态继续沿用原 Hanzi Writer 渐进笔顺链路。已运行 `npx tsc --noEmit`，结果为 0 报错；目标文件差异空白检查通过。全仓 `git diff --check` 仅报告本轮开始前已存在的 `memory-bank/techContext.md:8` 行尾空格，本轮依照范围约束未触碰该文件。当前停止 Act，等待人类进入空状态真机质检。

完成 `WorkbookConfig` 记忆契约与源码契约对齐，确认 Hanzi Writer 渲染边界不再依赖本地伪笔顺数组。

本轮执行 V2.1.0-Kernel 契约对齐：已将 `memory-bank/dataModels.md` 的 `WorkbookConfig` 补齐为与 `src/types/index.ts` 同形，新增 `traceCellsCount: number` 与 `emptyCellsCount: number`，消除记忆契约与源码类型镜像分叉。已核对 `src/store/useAppStore.ts` 与 `test-print.html` 中 `strokes` 均为空兼容字段；React 预览与 standalone 沙箱的 Hanzi Writer 实例均按 `character.char` / `data-hanzi` 创建，并通过 `quizStartStrokeNum` 静态呈现前 k 笔，未发现 `character.strokes` 渲染读取、旧 `StrokeMask`、`clipPath` 或黑名单笔顺方案残留。已运行 `npx tsc --noEmit`，结果为 0 报错；`test-print.html` 内嵌脚本语法检查结果为 `embedded-js-ok 1`。当前源码轨不新增功能，等待人类真机刷新质检后再决定视觉修正或新切片。

本轮已完成 Hanzi-Writer 矢量汉字引擎重构：`test-print.html` 已通过 CDN 引入 `https://cdn.jsdelivr.net/npm/hanzi-writer@3.5/dist/hanzi-writer.min.js`，React 宿主已安装并接入 `hanzi-writer@3.5.0`；`src/components/PreviewContainer.tsx` 与 `test-print.html` 的字帖行固定为每字 12 个正方形单元格，第 1 格为纯黑无加粗楷体母字，第 2-9 格只生成干净的 `.hanzi-writer-target aspect-square mx-auto` 容器并初始化 Hanzi Writer 实例，通过 `quizStartStrokeNum` 静态呈现前 k 笔深灰/配置色笔画和剩余淡灰 `#e2e8f0` 矢量轮廓，第 10-12 格完全留白。旧的 `span` 文本描红、CSS 绝对定位堆叠字符、伪部件 `strokes` 快照链路已作废；`src/store/useAppStore.ts` 与 `test-print.html` 中 `strokes` 已清空为兼容字段，`src/types/index.ts` 与 `memory-bank/dataModels.md` 已注明真实笔顺矢量数据由 Hanzi Writer 按 `char` 加载。米字格背景已统一替换为 SVG data URI，包含黑色实线外框、内部十字虚线与两条对角虚线；拼音轨继续按同一 12 列 grid 居中对齐。React 侧通过 `useEffect` 在字符、描红色、显示开关变化时销毁旧实例并重新挂载，standalone 沙箱通过 `destroyHanziWriters()` / `initHanziWriters()` 在每次 render 后重建实例，保证左侧选字实时联动。已运行 `npx tsc --noEmit`，结果为 0 报错；`test-print.html` 内嵌脚本语法检查结果为 `embedded-js-ok 1`。当前停下等待人类刷新质检。

废除 CSS 拼装方案，全面升级为字形快照流引擎，彻底统一全局楷体渲染。

正在全面锁死字帖全局（生字与所有渐进笔顺阶段）的标准楷体（Kaiti）统一方案。

本轮已根据人类架构审查彻底废除旧的 CSS/SVG 拼装笔画方案，改为“局部字形快照流”引擎：`src/store/useAppStore.ts` 与 `test-print.html` 中「明」「林」「赢」的 `strokes` 已全部替换为可直接用楷体渲染的递增字形快照数组；`src/components/PreviewContainer.tsx` 与 `test-print.html` 的描红格渲染链路已删除 `StrokeMask`、`clipPath`、SVG path 累积绘制和多笔画重叠逻辑，每个描红格仅保留一个 `span.practice-char` 快照字符。描红快照统一使用 `text-slate-300` 淡灰色，母字、拼音轨、描红快照和拼图文字均继续通过 `.a4-page *`、`.practice-char`、`.practice-row` 强制应用 `"Kaiti", "STKaiti", "华文楷体", "楷体", serif !important;`；练字格已明确收敛为 `border-2 border-black` 黑框契约。`memory-bank/dataModels.md` 与 `src/types/index.ts` 已同步将 `strokes` 契约更新为递增字形快照列表。已运行 `npx tsc --noEmit`，结果为 0 报错；`test-print.html` 内嵌脚本语法检查结果为 `embedded-js-ok`。当前停下等待人类刷新 `test-print.html` 验收完美字帖。

本轮已完成字帖全局楷体统一锁死专项修正：`test-print.html` 与 `src/components/PreviewContainer.tsx` 均已在 `.a4-page` 物理画布容器及其全部后代上强制应用 `font-family: "Kaiti", "STKaiti", "华文楷体", "楷体", serif !important;`；`practice-char` 与字帖整行 `practice-row` 同步升级为 `!important` 楷体锁，黑色母字格、灰色渐进描红笔顺、兜底完整字与拼图拆解格内的部件/来源汉字均不再依赖系统 sans-serif 回退。`test-print.html` 的静态测试字库「明」「赢」「林」继续走同一渲染链路。已确认目标文件中不存在 `font-sans` 冲突类；`test-print.html` 内嵌脚本语法检查结果为 `embedded-js-ok`；重新运行 `npx tsc --noEmit`，结果为 0 报错。当前停下等待人类最终真机刷新验收。

本轮根据真机反馈修复“笔顺显示错误”：此前 `TraceContent`/`renderTraceContent` 将 `character.strokes.slice(...).join("")` 当作普通文本绘制，导致 `丨𠃍一...` 等笔画符号被浏览器横向排版，无法表达正确书写顺序。现已将 `src/store/useAppStore.ts` 与 `test-print.html` 中「明」「赢」「林」的 `strokes` 数据改为按正确顺序排列的 SVG path 序列；`src/components/PreviewContainer.tsx` 与 `test-print.html` 的描红渲染改为 `<svg>` 中按 `traceStep` 累积绘制 path，第 1 个描红格显示第 1 笔，第 2 个描红格显示前 2 笔，依次递增，最后兜底显示完整累计笔画。已确认旧的笔画文本拼接渲染路径不再存在；`test-print.html` 内嵌脚本语法检查结果为 `embedded-js-ok`；`npx tsc --noEmit` 结果为 0 报错。尝试通过 in-app browser 自动刷新 `file:///Users/kanglei/PrintA4/test-print.html` 做视觉确认时被 Browser URL policy 阻止，未绕过该限制；当前停下等待人类手动刷新 file 页面验收。

本轮已按附件进一步修正「明」字笔顺递增与田字格/字形比例：新增 `StrokeMask` 契约并为「明」配置 8 个逐笔 mask 阶段；React 预览与 `test-print.html` 均改为使用同一个标准楷体整字 SVG `<text>`，通过累计 `clipPath`/`clip-path` 裁切显示第 1 画、前 2 画、前 3 画，直到第 8 画完整成字，避免手画 path 偏离楷体笔形。练字行从固定 12 列改为按 `母字 + 有效描红笔画数 + 空白格` 动态列数；默认配置改为 `traceCellsCount: 8`、`emptyCellsCount: 0`，使「明」默认呈现附件式 1 个黑色母字格 + 8 个灰色递增描红格。田字格外框同步改为黑色粗边，内部辅助线改为灰色十字虚线，字形 SVG 盒子提升到 94% 尺寸、字号 86，以匹配附件中“字占田字格主要空间”的比例。`SidebarLayout` 与 `test-print.html` 控件上限同步放宽到 20，保证长笔画字后续可递增到完整字。已运行 `test-print.html` 内嵌脚本语法检查，结果为 `embedded-js-ok`；`npm run type-check` 与 `npx tsc --noEmit` 均为 0 报错。

已完成 A4 物理排版的横向单字流字帖引擎重构：`src/components/PreviewContainer.tsx` 的 `PRACTICE` 模式已从 16 宫格大方块改为“单字一行、每行 12 个 `aspect-square` 正方形米字格”的横向渐进流；每行格子上方新增横向贯穿的四线三格拼音轨，首格拼音为黑色，后续格拼音为淡灰描红态。

已完成笔顺渐进算法：每行第 1 格渲染标准楷体黑色母字；第 2 格起按照 `character.strokes` 渐进显示笔画描红内容，且当笔画数超过可用描红格时，最后一个描红格兜底展示完整字；后续剩余格仅保留红色米字格辅助线，内部留空供练习。`PUZZLE` 模式未改动核心算法，继续保持部件拆解的 1:1 正方形虚线裁剪框。

已扩展 `src/types/index.ts` 的 `WorkbookConfig` 契约，新增 `traceCellsCount` 与 `emptyCellsCount`；`src/store/useAppStore.ts` 默认配置设为 `traceCellsCount: 9`、`emptyCellsCount: 2`；`src/components/SidebarLayout.tsx` 新增 `VisualConfigPanel`，提供两个数字/范围调节控件并通过 `updateConfig` 实时驱动右侧局部订阅预览。

已同步重构根目录 `test-print.html` 独立真机打印验证沙箱：内嵌状态、控制面板、分页常量、四线三格拼音轨、12 格横向渐进排版算法与 React 预览入口保持一致。已运行 `npx tsc --noEmit`，结果为 0 报错；额外运行内嵌脚本语法检查，结果为 `embedded-js-ok`。

已完成田字格 1:1 绝对正方形几何锁定与全局练字标准楷体替换：`test-print.html` 与 `src/components/PreviewContainer.tsx` 均已为练字外层单元格移除不确定高度依赖并改用 `aspect-square`，内层米字格区域同步强制 `aspect-square mx-auto`，汉字正文与描红层统一使用 `"Kaiti", "STKaiti", "华文楷体", "楷体", serif` 字体族。

本轮已在项目根目录直接开辟独立单文件真机验证通道 `test-print.html`：该文件完整内聚 HTML/Tailwind/CSS Paged Media 混合结构，复现当前 `useAppStore` 核心状态机算法、`PracticeCanvas` 米字格渐变线与 `PuzzleCanvas` 部件拆解虚线裁剪框逻辑，并通过纯 JavaScript 支持字帖/拼图模式切换、一键触发 `window.print()`。人类现在可以直接双击 `test-print.html` 在浏览器中进行真实打印链路验证。

本轮已在宿主根入口下联合装配 `SidebarLayout` 与 `PreviewContainer`，形成左侧固定控制台 + 右侧 A4 WYSIWYG 画布的真实应用骨架，并完成年级筛选、生字勾选与输出模式切换对右侧预览的全局实时刷新链路检查。

已构建 `SidebarLayout` 侧边栏及其内部 `TextbookSelector`、`CharacterPicker` 子组件，并修复 `setFilter` 中因联动切换导致的历史已选 ID 与旧单元残留隐患。

已根据 `memory-bank/dataModels.md` 的 `AppState` 契约构建 Zustand-compatible 核心 Store 与 Mock 字库数据源。

本轮已构建 `PreviewContainer` 预览容器、`PrintActionBar` 打印动作条、A4 等比例 WYSIWYG 预览页面与双模式排版引擎：`PRACTICE` 模式渲染字帖网格、拼音、田字格、笔顺引导与颜色配置；`PUZZLE` 模式按 `components` 拆解汉字部件并生成虚线裁剪框。打印侧已通过 `.a4-page` 锁定 `210mm x 297mm` 与 `page-break-after: always`，并通过原生 `window.print()` 触发网页打印。

本轮新增 `src/App.tsx`，以 `className="flex min-h-screen bg-slate-100 text-slate-950"` 装配左侧 `SidebarLayout` 与右侧 `PreviewContainer`；`src/main.ts` 已通过 `react-dom/client` 将 `App` 挂载到 `#root`。左侧 `SidebarLayout` 已补齐 `ModeSwitcher`，可在 `PRACTICE` 与 `PUZZLE` 间切换；`PreviewContainer` 改为宿主 flex 布局下的 `main.flex-1` 右侧画布。

本轮将 `src/store/useAppStore.ts` 从离线 Zustand-compatible 状态机升级为 React 外部订阅 Hook：内部使用 `useSyncExternalStore(subscribe, getState, getState)` 绑定状态快照，因此左侧筛选、选字、全选/清空、模式切换与后续视觉配置动作都会触发订阅组件重渲染，保证右侧 A4 字帖网格与部件拼图网格实时刷新。

## 本轮允许触达的源码文件
- `src/types/index.ts`
- `src/types/react-jsx-runtime.d.ts`
- `src/store/useAppStore.ts`
- `src/components/SidebarLayout.tsx`
- `src/components/PreviewContainer.tsx`
- `src/App.tsx`
- `src/main.ts`
- `src/types/index.ts`
- `test-print.html`
- `package.json`
- `tsconfig.json`

## 遇到的技术债与权宜之计 (Blockers & Mitigations)
本轮 `test-print.html` 属于独立验证沙箱，不进入 Vite 宿主打包链路；已用 Node 抽取内嵌 `<script>` 做语法检查，结果为 `embedded-js-ok`，并运行 `npm run type-check`，结果为 0 报错。该沙箱使用 Tailwind CDN 承载上一轮要求的 Tailwind 原子结构，CSS Paged Media 与核心打印规则内置在文件头部，双击即可验证浏览器原生打印入口。

宿主真实集成准备已补齐 `react`、`react-dom`、`@types/react` 与 `@types/react-dom` 依赖，并删除此前仅用于离线 TSX 编译的 `src/types/react-jsx-runtime.d.ts` 临时 shim，避免遮蔽真实 React JSX 类型。首次 `npm install` 命中用户级 npm cache 权限问题，已改用 `npm_config_cache=/private/tmp/printa4-npm-cache` 完成安装。
本轮已将 `src/store/useAppStore.ts` 的类型导入路径显式修正为 `../types/index.js`，并为核心 Action 入参补齐 `Partial<AppState['filter']>`、`string`、`string[]` 与 `OutputMode` 类型约束；`npx tsc --noEmit` 已取得 0 报错绿灯。
本轮已新增 `src/components/SidebarLayout.tsx`，提供固定左侧 PC 控制栏、教材年级/学期/单元联动筛选、生字网格单选、全选与清空动作；`setFilter` 在年级或学期切换时自动重置旧单元并清空已选 ID。宿主真实 React 运行时已接入，旧的离线 TSX 静态编译 shim 已删除。
本轮已新增 `src/components/PreviewContainer.tsx`，通过局部 selector 获取 `outputMode`、`config`、`selectedCharIds` 与 `characterPool`，并过滤得到当前激活汉字实体。组件内聚 `@page size: A4`、`.a4-page { width: 210mm; height: 297mm; page-break-after: always; }` 与 `@media print` 规则，网页预览保持 A4 等比例纸张，打印时隐藏操作栏并只输出 A4 页面节点。已运行 `npx tsc --noEmit`，结果为 0 报错。
本轮最后一次运行 `npx tsc --noEmit`，结果为 0 报错；宿主根路由装配进入绿色通行证状态。
本轮针对人类反馈的视觉缺陷完成跨文件物理修正：练字格几何已锁定为外层正方形 + 内层米字格正方形，楷体字体族已注入静态真机验证沙箱与 React 预览容器；最终重新运行 `npx tsc --noEmit`，结果为 0 报错。
