import type { ProblemDefinition } from "../../../types/content";

const statementMarkdown = `给定一个整数数组 \`nums\` 和一个整数目标值 \`target\`，请你在该数组中找出和为目标值的那两个整数，并返回它们的数组下标。

你可以假设每种输入只会对应一个答案，并且不能使用两次相同的元素。
`;

const coreIdeaMarkdown = `## 核心思路

这部分讲解后续补充。`;

const solutionMarkdown = `## 思路

用哈希表记录已经看过的数字。遍历到当前数字时，只要检查目标值需要的补数是否已经出现。

\`\`\`ts
function twoSum(nums: number[], target: number): number[] {
  const seen = new Map<number, number>();

  for (let i = 0; i < nums.length; i += 1) {
    const need = target - nums[i];

    if (seen.has(need)) {
      return [seen.get(need)!, i];
    }

    seen.set(nums[i], i);
  }

  return [];
}
\`\`\`
`;

export const twoSumProblem: ProblemDefinition = {
  id: "1",
  slug: "two-sum",
  categoryId: "arrays",
  titleZh: "两数之和",
  titleEn: "Two Sum",
  difficulty: "easy",
  tags: ["Hash Map", "Array"],
  leetcodeUrl: "https://leetcode.cn/problems/two-sum/",
  animationKey: "two-sum",
  statementMarkdown,
  coreIdeaMarkdown,
  solutionMarkdown,
  animationSteps: [
    {
      titleZh: "初始化哈希表",
      titleEn: "Initialize map",
      noteZh: "目标值为 9，准备从左到右扫描数组。",
      noteEn: "Target is 9. Scan the array from left to right.",
      highlight: [],
    },
    {
      titleZh: "查看 2",
      titleEn: "Visit 2",
      noteZh: "需要补数 7，哈希表还没有 7，因此记录 2 的下标。",
      noteEn: "Need 7. It is not in the map, so store index of 2.",
      highlight: [0],
      pointer: 0,
      target: 1,
    },
    {
      titleZh: "查看 7",
      titleEn: "Visit 7",
      noteZh: "需要补数 2，哈希表已经记录 2，答案出现。",
      noteEn: "Need 2. The map already has it, so the answer is found.",
      highlight: [0, 1],
      pointer: 1,
      target: 0,
    },
    {
      titleZh: "返回下标",
      titleEn: "Return indexes",
      noteZh: "返回 [0, 1]，对应数字 2 和 7。",
      noteEn: "Return [0, 1], the numbers 2 and 7.",
      highlight: [0, 1],
    },
  ],
};
