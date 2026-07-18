# 动态上下文 (activeContext.md)

## 📌 当前任务（2026-07-18 二年级上下册完整教材字库已完成）
已依据 2022/2023 修订统编版人教教材 PDF 的识字表与写字表，完整重建 `src/data/textbooks/pep-y2-s1.ts` 并新增 `pep-y2-s2.ts`。两册均按课次合并识字表和写字表、同课同字去重、跨课记录保留，最终上册 619 条、下册 619 条，均覆盖第一至第八单元。二年级旧 `LegacyTextbookCharacter` 契约及适配器已删除，四册教材资产统一经 `TextbookCharacter` 适配进入 `characterPool`。ID 唯一性、单字、拼音、册次、8 单元覆盖断言通过，`npm run build` 与 `git diff --check` 通过；按人类指令未启动浏览器，页面验证交由人类执行。

## 📌 当前所处阶段
系统已全面通过出版级字帖排版、矢量笔顺引擎升级以及 Vercel 生产构建部署优化（包含 Vite 处理的 21 个模块及 Tailwind Vite 插件的接入）。目前**字帖字形规范、动态 A4 分页切片及空状态满页补齐算法已全部达到高标准稳定态**。

## 🎯 当前聚焦的核心契约与工作台状态
1. **源码契约一致性**：`WorkbookConfig` 内部字段与 `src/types/index.ts` 保持严格类型镜像。汉字矢量笔顺数据的获取与边界渲染强制内聚于 Hanzi Writer 引擎，不再依赖本地硬编码的 Mock 笔顺快照数组。
2. **数据资产解耦**：Store 当前统一装载 `pep-y1-s1.ts`、`pep-y1-s2.ts`、`pep-y2-s1.ts` 与 `pep-y2-s2.ts`；四册均使用 `TextbookCharacter` 契约，并在唯一适配边界将中文单元标签归一化到 `CharacterMeta` 数字单元筛选边界。
3. **打印纯净度规则**：网页端 `.a4-page` 配备 24px 物理页距、双层厚重阴影及动态页码指示器；打印媒体（`@media print`）明确实施强力清零规则（`margin: 0 !important; box-shadow: none !important; border: none !important;`），确保输出纸张纯净。

## ⏳ 待处理与人类验收项
- [ ] 线上正式环境交付后的像素级真机打印及多设备跨端表现最终验收。
