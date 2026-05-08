import type { ProblemDefinition } from "../../../types/content";

const statementMarkdown = `给定一个不含重复数字的数组 \`nums\`，返回其所有可能的全排列。你可以按任意顺序返回答案。

## 示例

输入：\`nums = [1,2,3]\`

输出：\`[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]\`
`;

const coreIdeaMarkdown = `## 核心思路

全排列和子集不一样：每一层都可以重新从下标 \`0\` 开始扫描，因为排列关心顺序。

但是同一个排列里不能重复使用同一个数字，所以需要 \`used[i]\` 记录 \`nums[i]\` 是否已经在当前 \`path\` 中。

当 \`path.size() == nums.length\` 时，说明已经选满一个排列，把当前 \`path\` 复制进结果集，然后返回上一层继续尝试其他选择。`;

const solutionMarkdown = `## 核心思路

全排列和子集不一样：每一层都可以重新从下标 \`0\` 开始扫描，因为排列关心顺序。

但是同一个排列里不能重复使用同一个数字，所以需要 \`used[i]\` 记录 \`nums[i]\` 是否已经在当前 \`path\` 中。

当 \`path.size() == nums.length\` 时，说明已经选满一个排列，把当前 \`path\` 复制进结果集，然后返回上一层继续尝试其他选择。

## 递归过程

\`\`\`text
path=[]
  选 1 -> [1]
    跳过 1，因为 used[0]=true
    选 2 -> [1,2]
      选 3 -> [1,2,3]，记录
      撤销 3
    撤销 2
    选 3 -> [1,3]
      选 2 -> [1,3,2]，记录
      撤销 2
    撤销 3
  撤销 1
  选 2 -> ...
  选 3 -> ...
\`\`\`

## Java 答案

\`\`\`java
import java.util.ArrayList;
import java.util.List;

class Solution {
    public List<List<Integer>> permute(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        List<Integer> path = new ArrayList<>();
        boolean[] used = new boolean[nums.length];

        backtrack(res, path, used, nums);

        return res;
    }

    private void backtrack(List<List<Integer>> res, List<Integer> path, boolean[] used, int[] nums) {
        if (path.size() == nums.length) {
            res.add(new ArrayList<>(path));
            return;
        }

        for (int i = 0; i < nums.length; i++) {
            if (used[i]) {
                continue;
            }

            path.add(nums[i]);
            used[i] = true;

            backtrack(res, path, used, nums);

            path.remove(path.size() - 1);
            used[i] = false;
        }
    }
}
\`\`\`
`;

export const permutationsProblem: ProblemDefinition = {
  id: "46",
  slug: "permutations",
  categoryId: "backtracking",
  titleZh: "全排列",
  titleEn: "Permutations",
  difficulty: "medium",
  tags: ["Backtracking", "DFS"],
  leetcodeUrl: "https://leetcode.cn/problems/permutations/",
  animationKey: "permutations",
  statementMarkdown,
  coreIdeaMarkdown,
  solutionMarkdown,
  animationSteps: [
    {
      titleZh: "从空路径开始",
      titleEn: "Start from an empty path",
      noteZh: "path=[]，used=[false,false,false]。全排列每层都会从 i=0 重新扫描，但已经用过的数字会被跳过。",
      noteEn: "path=[], used=[false,false,false]. Every level scans from i=0, but used numbers are skipped.",
      highlight: [],
      path: [],
      used: [false, false, false],
      results: [],
      activeNode: "root",
      visitedNodes: ["root"],
      action: "record",
    },
    {
      titleZh: "选择 1",
      titleEn: "Choose 1",
      noteZh: "选择 nums[0]=1，放入 path，并把 used[0] 标记为 true，表示 1 已经被当前排列占用。",
      noteEn: "Choose nums[0]=1, push it into path, and mark used[0]=true.",
      highlight: [0],
      path: [1],
      used: [true, false, false],
      results: [],
      activeNode: "1",
      activeEdge: "root-1",
      visitedNodes: ["root", "1"],
      action: "choose",
      choice: 1,
    },
    {
      titleZh: "跳过已使用的 1，选择 2",
      titleEn: "Skip used 1, choose 2",
      noteZh: "进入下一层仍从 i=0 扫描，但 used[0]=true，所以跳过 1；接着选择 2，path=[1,2]。",
      noteEn: "The next level still scans from i=0. Since used[0]=true, skip 1 and choose 2.",
      highlight: [0, 1],
      path: [1, 2],
      used: [true, true, false],
      results: [],
      activeNode: "1-2",
      activeEdge: "1-1-2",
      visitedNodes: ["root", "1", "1-2"],
      action: "choose",
      choice: 2,
    },
    {
      titleZh: "选择 3，记录 [1,2,3]",
      titleEn: "Choose 3, record [1,2,3]",
      noteZh: "只剩 3 没用，选择后 path 长度等于 nums 长度，得到第一个完整排列 [1,2,3]。",
      noteEn: "Only 3 is unused. After choosing it, path reaches full length, so record [1,2,3].",
      highlight: [0, 1, 2],
      path: [1, 2, 3],
      used: [true, true, true],
      results: [[1, 2, 3]],
      activeNode: "1-2-3",
      activeEdge: "1-2-1-2-3",
      visitedNodes: ["root", "1", "1-2", "1-2-3"],
      action: "record",
      choice: 3,
    },
    {
      titleZh: "撤销 3，再撤销 2",
      titleEn: "Undo 3, then undo 2",
      noteZh: "返回上一层时先移除 3，并把 used[2] 改回 false；随后 [1,2] 这一支结束，再撤销 2。",
      noteEn: "Backtrack by removing 3 and setting used[2]=false. Then branch [1,2] ends, so undo 2.",
      highlight: [0],
      path: [1],
      used: [true, false, false],
      results: [[1, 2, 3]],
      activeNode: "1",
      visitedNodes: ["root", "1", "1-2", "1-2-3"],
      action: "undo",
      removed: 2,
    },
    {
      titleZh: "在 [1] 下选择 3",
      titleEn: "Choose 3 under [1]",
      noteZh: "回到 path=[1] 后，继续 for 循环的下一个候选 3，得到 path=[1,3]。",
      noteEn: "Back at path=[1], continue the loop and choose 3, giving path=[1,3].",
      highlight: [0, 2],
      path: [1, 3],
      used: [true, false, true],
      results: [[1, 2, 3]],
      activeNode: "1-3",
      activeEdge: "1-1-3",
      visitedNodes: ["root", "1", "1-2", "1-2-3", "1-3"],
      action: "choose",
      choice: 3,
    },
    {
      titleZh: "补上 2，记录 [1,3,2]",
      titleEn: "Add 2, record [1,3,2]",
      noteZh: "进入下一层时 1 和 3 已用，跳过它们，只能选 2，得到第二个排列 [1,3,2]。",
      noteEn: "At the next level, 1 and 3 are used, so only 2 can be chosen. Record [1,3,2].",
      highlight: [0, 1, 2],
      path: [1, 3, 2],
      used: [true, true, true],
      results: [[1, 2, 3], [1, 3, 2]],
      activeNode: "1-3-2",
      activeEdge: "1-3-1-3-2",
      visitedNodes: ["root", "1", "1-2", "1-2-3", "1-3", "1-3-2"],
      action: "record",
      choice: 2,
    },
    {
      titleZh: "撤销到根节点",
      titleEn: "Backtrack to root",
      noteZh: "以 1 开头的两个排列都完成了，连续撤销 2、3、1，path 回到 []，准备以 2 开头。",
      noteEn: "Both permutations starting with 1 are done. Undo 2, 3, and 1, returning to root.",
      highlight: [],
      path: [],
      used: [false, false, false],
      results: [[1, 2, 3], [1, 3, 2]],
      activeNode: "root",
      visitedNodes: ["root", "1", "1-2", "1-2-3", "1-3", "1-3-2"],
      action: "undo",
      removed: 1,
    },
    {
      titleZh: "选择 2 开头",
      titleEn: "Start with 2",
      noteZh: "根节点继续扫描，选择 nums[1]=2。注意：排列允许 2 放在第一位，因为顺序本身就是答案的一部分。",
      noteEn: "The root continues scanning and chooses nums[1]=2. Order matters, so 2 can be the first element.",
      highlight: [1],
      path: [2],
      used: [false, true, false],
      results: [[1, 2, 3], [1, 3, 2]],
      activeNode: "2",
      activeEdge: "root-2",
      visitedNodes: ["root", "1", "1-2", "1-2-3", "1-3", "1-3-2", "2"],
      action: "choose",
      choice: 2,
    },
    {
      titleZh: "得到 [2,1,3]",
      titleEn: "Build [2,1,3]",
      noteZh: "在 [2] 下先选 1，再选 3，path 满了，记录第三个排列 [2,1,3]。",
      noteEn: "Under [2], choose 1 then 3. The path is full, so record [2,1,3].",
      highlight: [0, 1, 2],
      path: [2, 1, 3],
      used: [true, true, true],
      results: [[1, 2, 3], [1, 3, 2], [2, 1, 3]],
      activeNode: "2-1-3",
      activeEdge: "2-1-2-1-3",
      visitedNodes: ["root", "1", "1-2", "1-2-3", "1-3", "1-3-2", "2", "2-1", "2-1-3"],
      action: "record",
      choice: 3,
    },
    {
      titleZh: "得到 [2,3,1]",
      titleEn: "Build [2,3,1]",
      noteZh: "撤销到 [2] 后，换另一个分支：先选 3，再选 1，记录 [2,3,1]。",
      noteEn: "Back at [2], take the other branch: choose 3 then 1, and record [2,3,1].",
      highlight: [0, 1, 2],
      path: [2, 3, 1],
      used: [true, true, true],
      results: [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1]],
      activeNode: "2-3-1",
      activeEdge: "2-3-2-3-1",
      visitedNodes: ["root", "1", "1-2", "1-2-3", "1-3", "1-3-2", "2", "2-1", "2-1-3", "2-3", "2-3-1"],
      action: "record",
      choice: 1,
    },
    {
      titleZh: "选择 3 开头",
      titleEn: "Start with 3",
      noteZh: "以 2 开头的分支完成，回到根节点，最后选择 3 作为第一位。",
      noteEn: "All branches starting with 2 are done. Return to root and choose 3 as the first element.",
      highlight: [2],
      path: [3],
      used: [false, false, true],
      results: [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1]],
      activeNode: "3",
      activeEdge: "root-3",
      visitedNodes: ["root", "1", "1-2", "1-2-3", "1-3", "1-3-2", "2", "2-1", "2-1-3", "2-3", "2-3-1", "3"],
      action: "choose",
      choice: 3,
    },
    {
      titleZh: "得到 [3,1,2]",
      titleEn: "Build [3,1,2]",
      noteZh: "在 [3] 下先选 1，再选 2，记录第五个排列 [3,1,2]。",
      noteEn: "Under [3], choose 1 then 2, and record the fifth permutation [3,1,2].",
      highlight: [0, 1, 2],
      path: [3, 1, 2],
      used: [true, true, true],
      results: [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2]],
      activeNode: "3-1-2",
      activeEdge: "3-1-3-1-2",
      visitedNodes: ["root", "1", "1-2", "1-2-3", "1-3", "1-3-2", "2", "2-1", "2-1-3", "2-3", "2-3-1", "3", "3-1", "3-1-2"],
      action: "record",
      choice: 2,
    },
    {
      titleZh: "得到 [3,2,1]",
      titleEn: "Build [3,2,1]",
      noteZh: "撤销到 [3] 后，改选 2，再补 1，记录最后一个排列 [3,2,1]。",
      noteEn: "Back at [3], choose 2 then 1, and record the final permutation [3,2,1].",
      highlight: [0, 1, 2],
      path: [3, 2, 1],
      used: [true, true, true],
      results: [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]],
      activeNode: "3-2-1",
      activeEdge: "3-2-3-2-1",
      visitedNodes: ["root", "1", "1-2", "1-2-3", "1-3", "1-3-2", "2", "2-1", "2-1-3", "2-3", "2-3-1", "3", "3-1", "3-1-2", "3-2", "3-2-1"],
      action: "record",
      choice: 1,
    },
    {
      titleZh: "全排列完成",
      titleEn: "Permutations complete",
      noteZh: "三个数字共有 3! = 6 种排列。每一次记录都发生在 path 长度等于 nums.length 的叶子节点。",
      noteEn: "Three numbers have 3! = 6 permutations. Every result is recorded at a leaf where path length equals nums.length.",
      highlight: [],
      path: [],
      used: [false, false, false],
      results: [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]],
      activeNode: "root",
      visitedNodes: ["root", "1", "1-2", "1-2-3", "1-3", "1-3-2", "2", "2-1", "2-1-3", "2-3", "2-3-1", "3", "3-1", "3-1-2", "3-2", "3-2-1"],
      action: "done",
    },
  ],
};
