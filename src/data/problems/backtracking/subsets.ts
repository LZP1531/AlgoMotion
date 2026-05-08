import type { ProblemDefinition } from "../../../types/content";

const statementMarkdown = `给你一个整数数组 \`nums\`，数组中的元素互不相同。返回该数组所有可能的子集，也就是幂集。

解集不能包含重复的子集。你可以按任意顺序返回解集。

## 示例 1

输入：\`nums = [1,2,3]\`

输出：\`[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]\`

## 示例 2

输入：\`nums = [0]\`

输出：\`[[],[0]]\`

## 提示

- \`1 <= nums.length <= 10\`
- \`-10 <= nums[i] <= 10\`
- \`nums\` 中的所有元素互不相同
`;

const coreIdeaMarkdown = `## 核心思路

子集问题的关键是：每到达回溯树中的一个节点，当前 \`path\` 本身就是一个合法子集，所以先把 \`path\` 加入结果集。

然后从 \`start\` 开始继续枚举后面的数字。这样下一层递归只会向右选择，不会回头选择前面的元素，因此天然避免重复。

可以把它理解成：每个元素都有“选”或“不选”两种可能，回溯树会把这些可能逐步展开。对于 \`[1,2,3]\`，最终会得到 \`2^3 = 8\` 个子集。`;

const solutionMarkdown = `## 核心思路

子集问题的关键是：每到达回溯树中的一个节点，当前 \`path\` 本身就是一个合法子集，所以先把 \`path\` 加入结果集。

然后从 \`start\` 开始继续枚举后面的数字。这样下一层递归只会向右选择，不会回头选择前面的元素，因此天然避免重复。

## 递归顺序

\`\`\`text
backtrack([], start=0)
  选择 1 -> path=[1]
  backtrack([1], start=1)
    选择 2 -> path=[1,2]
    backtrack([1,2], start=2)
      选择 3 -> path=[1,2,3]
      backtrack([1,2,3], start=3)
      撤销 3 -> path=[1,2]
    撤销 2 -> path=[1]

    选择 3 -> path=[1,3]
    backtrack([1,3], start=3)
    撤销 3 -> path=[1]
  撤销 1 -> path=[]

  选择 2 -> path=[2]
  backtrack([2], start=2)
    选择 3 -> path=[2,3]
    backtrack([2,3], start=3)
    撤销 3 -> path=[2]
  撤销 2 -> path=[]

  选择 3 -> path=[3]
  backtrack([3], start=3)
  撤销 3 -> path=[]
\`\`\`

## Java 答案

\`\`\`java
import java.util.ArrayList;
import java.util.List;

class Solution {
    public List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        List<Integer> path = new ArrayList<>();

        backtrack(nums, 0, path, res);

        return res;
    }

    private void backtrack(int[] nums, int start, List<Integer> path, List<List<Integer>> res) {
        // 每到一个节点，当前 path 都是一个子集
        res.add(new ArrayList<>(path));

        // 从 start 开始，防止往回选，避免重复
        for (int i = start; i < nums.length; i++) {
            // 做选择
            path.add(nums[i]);

            // 递归：下一次只能从 i + 1 开始选
            backtrack(nums, i + 1, path, res);

            // 撤销选择
            path.remove(path.size() - 1);
        }
    }
}
\`\`\`
`;

export const subsetsProblem: ProblemDefinition = {
  id: "78",
  slug: "subsets",
  categoryId: "backtracking",
  titleZh: "子集",
  titleEn: "Subsets",
  difficulty: "medium",
  tags: ["Backtracking", "DFS"],
  leetcodeUrl: "https://leetcode.cn/problems/subsets/",
  animationKey: "subsets",
  statementMarkdown,
  coreIdeaMarkdown,
  solutionMarkdown,
  animationSteps: [
    {
      titleZh: "记录空集",
      titleEn: "Record empty set",
      noteZh: "进入 backtrack([], start=0)。每到一个节点，先把当前 path 放入结果，所以第一个子集是 []。",
      noteEn: "Enter backtrack([], start=0). Every node records the current path, so the first subset is [].",
      highlight: [],
      path: [],
      results: [[]],
      activeNode: "root",
      visitedNodes: ["root"],
      action: "record",
    },
    {
      titleZh: "选择 1",
      titleEn: "Choose 1",
      noteZh: "for 循环从 start=0 开始，选择 nums[0]=1，path 从 [] 变成 [1]，递归进入 start=1。",
      noteEn: "The loop starts at 0. Choose nums[0]=1, path becomes [1], then recurse with start=1.",
      highlight: [0],
      path: [1],
      results: [[]],
      activeNode: "1",
      activeEdge: "root-1",
      visitedNodes: ["root", "1"],
      action: "choose",
      choice: 1,
    },
    {
      titleZh: "记录 [1]",
      titleEn: "Record [1]",
      noteZh: "进入 backtrack([1], start=1)，当前 path=[1] 也是一个合法子集，加入结果。",
      noteEn: "Enter backtrack([1], start=1). The current path [1] is also a subset, so record it.",
      highlight: [0],
      path: [1],
      results: [[], [1]],
      activeNode: "1",
      visitedNodes: ["root", "1"],
      action: "record",
    },
    {
      titleZh: "选择 2",
      titleEn: "Choose 2",
      noteZh: "从 start=1 继续向右选择 2，path 变成 [1,2]，不会再回头选 1。",
      noteEn: "From start=1, choose 2 to the right. path becomes [1,2], and it never goes back to 1.",
      highlight: [0, 1],
      path: [1, 2],
      results: [[], [1]],
      activeNode: "1-2",
      activeEdge: "1-1-2",
      visitedNodes: ["root", "1", "1-2"],
      action: "choose",
      choice: 2,
    },
    {
      titleZh: "记录 [1,2]",
      titleEn: "Record [1,2]",
      noteZh: "进入 backtrack([1,2], start=2)，把 [1,2] 加入结果集。",
      noteEn: "Enter backtrack([1,2], start=2), then add [1,2] to the result list.",
      highlight: [0, 1],
      path: [1, 2],
      results: [[], [1], [1, 2]],
      activeNode: "1-2",
      visitedNodes: ["root", "1", "1-2"],
      action: "record",
    },
    {
      titleZh: "选择 3",
      titleEn: "Choose 3",
      noteZh: "继续选择 3，path 变成 [1,2,3]，递归进入 start=3。",
      noteEn: "Choose 3 next. path becomes [1,2,3], then recurse with start=3.",
      highlight: [0, 1, 2],
      path: [1, 2, 3],
      results: [[], [1], [1, 2]],
      activeNode: "1-2-3",
      activeEdge: "1-2-1-2-3",
      visitedNodes: ["root", "1", "1-2", "1-2-3"],
      action: "choose",
      choice: 3,
    },
    {
      titleZh: "记录 [1,2,3]",
      titleEn: "Record [1,2,3]",
      noteZh: "start=3 已经到数组末尾，但进入节点时仍要记录当前 path。",
      noteEn: "start=3 reaches the end, but the current path is still recorded when entering the node.",
      highlight: [0, 1, 2],
      path: [1, 2, 3],
      results: [[], [1], [1, 2], [1, 2, 3]],
      activeNode: "1-2-3",
      visitedNodes: ["root", "1", "1-2", "1-2-3"],
      action: "record",
    },
    {
      titleZh: "撤销 3",
      titleEn: "Undo 3",
      noteZh: "从 [1,2,3] 返回上一层，撤销刚才选择的 3，path 回到 [1,2]。",
      noteEn: "Return to the previous layer and undo 3. path goes back to [1,2].",
      highlight: [0, 1],
      path: [1, 2],
      results: [[], [1], [1, 2], [1, 2, 3]],
      activeNode: "1-2",
      visitedNodes: ["root", "1", "1-2", "1-2-3"],
      action: "undo",
      removed: 3,
    },
    {
      titleZh: "撤销 2",
      titleEn: "Undo 2",
      noteZh: "节点 [1,2] 的选择都结束了，撤销 2，回到 path=[1]，准备尝试同层的 3。",
      noteEn: "All choices under [1,2] are done. Undo 2 and return to path=[1], ready to try 3 at the same level.",
      highlight: [0],
      path: [1],
      results: [[], [1], [1, 2], [1, 2, 3]],
      activeNode: "1",
      visitedNodes: ["root", "1", "1-2", "1-2-3"],
      action: "undo",
      removed: 2,
    },
    {
      titleZh: "选择 3",
      titleEn: "Choose 3",
      noteZh: "在 path=[1] 这一层继续向右选择 3，得到 [1,3]。",
      noteEn: "At path=[1], continue right and choose 3, producing [1,3].",
      highlight: [0, 2],
      path: [1, 3],
      results: [[], [1], [1, 2], [1, 2, 3]],
      activeNode: "1-3",
      activeEdge: "1-1-3",
      visitedNodes: ["root", "1", "1-2", "1-2-3", "1-3"],
      action: "choose",
      choice: 3,
    },
    {
      titleZh: "记录 [1,3]",
      titleEn: "Record [1,3]",
      noteZh: "进入 backtrack([1,3], start=3)，把 [1,3] 加入结果。",
      noteEn: "Enter backtrack([1,3], start=3), then record [1,3].",
      highlight: [0, 2],
      path: [1, 3],
      results: [[], [1], [1, 2], [1, 2, 3], [1, 3]],
      activeNode: "1-3",
      visitedNodes: ["root", "1", "1-2", "1-2-3", "1-3"],
      action: "record",
    },
    {
      titleZh: "回到根节点",
      titleEn: "Back to root",
      noteZh: "撤销 3，再撤销 1，path 回到 []。接下来根节点会选择 2。",
      noteEn: "Undo 3 and then undo 1. path returns to []. The root will choose 2 next.",
      highlight: [],
      path: [],
      results: [[], [1], [1, 2], [1, 2, 3], [1, 3]],
      activeNode: "root",
      visitedNodes: ["root", "1", "1-2", "1-2-3", "1-3"],
      action: "undo",
      removed: 1,
    },
    {
      titleZh: "选择并记录 [2]",
      titleEn: "Choose and record [2]",
      noteZh: "根节点选择 2，进入 backtrack([2], start=2)，记录 [2]。",
      noteEn: "The root chooses 2, enters backtrack([2], start=2), and records [2].",
      highlight: [1],
      path: [2],
      results: [[], [1], [1, 2], [1, 2, 3], [1, 3], [2]],
      activeNode: "2",
      activeEdge: "root-2",
      visitedNodes: ["root", "1", "1-2", "1-2-3", "1-3", "2"],
      action: "record",
      choice: 2,
    },
    {
      titleZh: "选择并记录 [2,3]",
      titleEn: "Choose and record [2,3]",
      noteZh: "在 [2] 下面继续选择 3，记录 [2,3]，然后撤销 3。",
      noteEn: "Under [2], choose 3 and record [2,3], then undo 3.",
      highlight: [1, 2],
      path: [2, 3],
      results: [[], [1], [1, 2], [1, 2, 3], [1, 3], [2], [2, 3]],
      activeNode: "2-3",
      activeEdge: "2-2-3",
      visitedNodes: ["root", "1", "1-2", "1-2-3", "1-3", "2", "2-3"],
      action: "record",
      choice: 3,
    },
    {
      titleZh: "选择并记录 [3]",
      titleEn: "Choose and record [3]",
      noteZh: "回到根节点，最后选择 3，记录 [3]。",
      noteEn: "Back at the root, choose 3 last and record [3].",
      highlight: [2],
      path: [3],
      results: [[], [1], [1, 2], [1, 2, 3], [1, 3], [2], [2, 3], [3]],
      activeNode: "3",
      activeEdge: "root-3",
      visitedNodes: ["root", "1", "1-2", "1-2-3", "1-3", "2", "2-3", "3"],
      action: "record",
      choice: 3,
    },
    {
      titleZh: "完成幂集",
      titleEn: "Power set complete",
      noteZh: "所有分支都走完，结果集包含 8 个子集：每个元素都有选或不选两种可能。",
      noteEn: "All branches are complete. The result contains 8 subsets: each element is either chosen or skipped.",
      highlight: [],
      path: [],
      results: [[], [1], [1, 2], [1, 2, 3], [1, 3], [2], [2, 3], [3]],
      activeNode: "root",
      visitedNodes: ["root", "1", "1-2", "1-2-3", "1-3", "2", "2-3", "3"],
      action: "done",
    },
  ],
};
