# 动态上下文 (activeContext.md)

## 📌 当前任务（2026-07-18 一年级上下册教材生字静态资产已完成）
已按 2016/2017 统编版一年级教材附录与逐课语境生成 `src/data/textbooks/pep-y1-s1.ts`、`src/data/textbooks/pep-y1-s2.ts`：上册 304 条课内记录，下册识字表与写字表按同课同字去重后 527 条。`src/types/textbook.ts` 与 `memory-bank/dataModels.md` 已同步为 `UP` / `DOWN`、字符串单元及 `lesson` 契约；既有二年级试验资产暂由显式 legacy 契约隔离。本批 ID、单字、声调格式与唯一性校验通过，`npm run build` 一次通过，等待人类下达二年级批次指令。

## 📌 当前所处阶段
系统已全面通过出版级字帖排版、矢量笔顺引擎升级以及 Vercel 生产构建部署优化（包含 Vite 处理的 21 个模块及 Tailwind Vite 插件的接入）。目前**字帖字形规范、动态 A4 分页切片及空状态满页补齐算法已全部达到高标准稳定态**。

## 🎯 当前聚焦的核心契约与工作台状态
1. **源码契约一致性**：`WorkbookConfig` 内部字段与 `src/types/index.ts` 保持严格类型镜像。汉字矢量笔顺数据的获取与边界渲染强制内聚于 Hanzi Writer 引擎，不再依赖本地硬编码的 Mock 笔顺快照数组。
2. **数据资产解耦**：系统已剔除离线 Mock 字库，正式接入 `src/data/textbooks/pep-y2-s1.ts` 独立教材资产库，默认装载人教版二年级上册第一、二单元的 26 个核心高频生字，并具备稳健的教材联动筛选防护。
3. **打印纯净度规则**：网页端 `.a4-page` 配备 24px 物理页距、双层厚重阴影及动态页码指示器；打印媒体（`@media print`）明确实施强力清零规则（`margin: 0 !important; box-shadow: none !important; border: none !important;`），确保输出纸张纯净。

## ⏳ 待处理与人类验收项
- [ ] 线上正式环境交付后的像素级真机打印及多设备跨端表现最终验收。
