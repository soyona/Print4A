# 技术栈与依赖约束 (techContext.md V2.0.0-Matrix)

## 🎯 1. 契约语言层 (The Contract Layer)
- 强制标准：TypeScript (或对应原生的强类型层)，严禁编写隐式 any。

## 🎨 2. 样式与布局层 (The UI/Visual Layer)
- 强制标准：低熵级渲染方案，样式与结构合一，彻底断绝样式文件失忆。
- 当前轮廓：Tailwind CSS 的自适应原子拓扑。

## 🧠 3. 状态拓扑层 (The State Topology Layer)
- 共享边界：React Context 纯函数状态机

## 🛑 4. 严禁引入的依赖黑名单 (Negative Constraints)
- 严禁引入任何外部复杂状态库（如 Redux），仅允许使用 React Context。\n- 严禁破坏单页应用（SPA）的标准轻量路由结构。

## ⚙️ 5. 编译命令与宿主路由控制
- 本地静态编译验证命令: `npm run dev / npm run build`[cite: 8]
- 本地开发网络边界: 允许的开发源 localhost[cite: 8]
