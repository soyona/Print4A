# 动态上下文 (activeContext.md)

## 📌 当前任务（2026-07-18 教材封面网格与课文级联重构已完成）
侧栏已由年级/学期/单元文本筛选升级为 12 册教材封面抽屉、课文标题级联与课文专属生字选择。`TextbookFilter` 已收敛为 `grade + semester + lesson`，`CharacterMeta` 保留教材课文标题；默认状态为一年级上册首课《天地人》，切换封面会从该册 `characterPool` 的不重复课文序列中自动选择第一课并清空旧选字。封面矩阵严格锁定 180px 高度并滚动，教材卡可折叠，激活/弱化态、课文 Select、全选/清空与无字库空态均已落地；固定映射缺失的 `pep-y5-s1.png` 已由原 JPG 补齐为真实 PNG。

## 📌 当前所处阶段
系统已全面通过出版级字帖排版、矢量笔顺引擎升级以及 Vercel 生产构建部署优化（包含 Vite 处理的 21 个模块及 Tailwind Vite 插件的接入）。目前**字帖字形规范、动态 A4 分页切片及空状态满页补齐算法已全部达到高标准稳定态**。

## 🎯 当前聚焦的核心契约与工作台状态
1. **源码契约一致性**：`WorkbookConfig` 内部字段与 `src/types/index.ts` 保持严格类型镜像。汉字矢量笔顺数据的获取与边界渲染强制内聚于 Hanzi Writer 引擎，不再依赖本地硬编码的 Mock 笔顺快照数组。
2. **数据资产解耦**：Store 当前统一装载 `pep-y1-s1.ts`、`pep-y1-s2.ts`、`pep-y2-s1.ts` 与 `pep-y2-s2.ts`；四册均使用 `TextbookCharacter` 契约，并在唯一适配边界将中文单元标签归一化到 `CharacterMeta` 数字单元筛选边界。
3. **打印纯净度规则**：网页端 `.a4-page` 配备 24px 物理页距、双层厚重阴影及动态页码指示器；打印媒体（`@media print`）明确实施强力清零规则（`margin: 0 !important; box-shadow: none !important; border: none !important;`），确保输出纸张纯净。

## ⏳ 待处理与人类验收项
- [ ] 线上正式环境交付后的像素级真机打印及多设备跨端表现最终验收。
- [ ] 三至六年级教材字库尚未装载到 `characterPool`；对应封面当前按契约显示“该册字库尚未录入”，待数据资产补齐后会自动下发课文列表。
