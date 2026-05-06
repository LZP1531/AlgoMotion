# AlgoMotion

AlgoMotion 是一个面向 LeetCode100 学习的前端动态图解站点。它用固定布局承载分类目录、顶部工具栏和主体学习区，让后续每道算法题都能补充动态图、题解 Markdown 与高亮代码。

## 技术栈

- React + Vite + TypeScript
- react-router-dom
- lucide-react
- framer-motion
- react-markdown + rehype-highlight

## 本地启动

```bash
npm install
npm run dev
```

构建检查：

```bash
npm run build
```

## 目录说明

- `src/layouts`：固定外壳布局，包括左侧目录、顶部工具栏和主体容器。
- `src/features/categories`：分类页面和题目卡片。
- `src/features/problems`：题目详情页、动态图区域和 Markdown 代码展示。
- `src/data`：分类数据、题目元信息、Markdown 题解和动画步骤。
- `src/styles`：全局样式、主题变量、玻璃拟态与代码高亮。

## 新增题目流程

1. 在 `src/data/problems.ts` 中新增题目元信息、Markdown 题解和动画步骤。
2. 为题目设置 `categoryId`，让它归属到对应大分类。
3. 设置 `animationKey`，复用或新增 `src/features/problems/animations` 下的动态图组件。
4. 启动项目检查分类卡片、详情页、动画步骤和代码高亮是否正确。
