import type { ProblemDefinition } from "../../../types/content";

const statementMarkdown = `给定一个二叉树的根节点 \`root\`，返回它的中序遍历。
`;

const solutionMarkdown = `## 思路

中序遍历的顺序是：左子树、根节点、右子树。递归写法把这个顺序直接表达出来。

\`\`\`ts
function inorderTraversal(root: TreeNode | null): number[] {
  const result: number[] = [];

  function dfs(node: TreeNode | null) {
    if (!node) return;
    dfs(node.left);
    result.push(node.val);
    dfs(node.right);
  }

  dfs(root);
  return result;
}
\`\`\`
`;

export const inorderTraversalProblem: ProblemDefinition = {
  id: "94",
  slug: "binary-tree-inorder-traversal",
  categoryId: "binary-tree",
  titleZh: "二叉树中序遍历",
  titleEn: "Binary Tree Inorder Traversal",
  difficulty: "easy",
  tags: ["DFS", "Tree"],
  leetcodeUrl: "https://leetcode.cn/problems/binary-tree-inorder-traversal/",
  animationKey: "inorder-tree",
  statementMarkdown,
  solutionMarkdown,
  animationSteps: [
    {
      titleZh: "进入根节点",
      titleEn: "Enter root",
      noteZh: "从根节点 1 开始，先尝试访问左子树。",
      noteEn: "Start from root 1 and try the left subtree first.",
      highlight: [0],
    },
    {
      titleZh: "左侧为空",
      titleEn: "Left is empty",
      noteZh: "1 没有左子树，因此把 1 加入结果。",
      noteEn: "1 has no left child, so add 1 to the result.",
      highlight: [0],
      pointer: 0,
    },
    {
      titleZh: "访问右子树",
      titleEn: "Visit right subtree",
      noteZh: "进入右节点 2，再优先访问它的左节点 3。",
      noteEn: "Move to right node 2, then visit its left node 3 first.",
      highlight: [1, 2],
      pointer: 2,
    },
    {
      titleZh: "得到顺序",
      titleEn: "Build order",
      noteZh: "最终结果为 [1, 3, 2]。",
      noteEn: "The final order is [1, 3, 2].",
      highlight: [0, 2, 1],
    },
  ],
};
