import type { ProblemDefinition } from "../../../types/content";

const statementMarkdown = `给你一个字符串 \`s\`，请你将 \`s\` 分割成一些子串，使每个子串都是回文串。返回 \`s\` 所有可能的分割方案。

## 示例 1

输入：\`s = "aab"\`

输出：\`[["a","a","b"],["aa","b"]]\``;

const coreIdeaMarkdown = `## 核心思路

这道题可以拆成两件事：

1. 先用动态规划预处理：任意区间 \`s[i..j]\` 是否是回文串。
2. 再用回溯枚举分割方案：从当前位置 \`index\` 开始，尝试每一个结束位置 \`i\`，只有 \`dp[index][i] == true\` 的子串才允许加入 \`path\`。

动态规划的定义是：

\`\`\`text
dp[i][j] 表示 s[i..j] 是否是回文串
\`\`\`

转移逻辑：

\`\`\`text
如果 s[i] == s[j]，并且：
  1. j - i <= 2
  2. 或者 dp[i + 1][j - 1] == true
那么 dp[i][j] = true
\`\`\`

为什么 \`i\` 要从右往左遍历？因为 \`dp[i][j]\` 可能依赖左下方的 \`dp[i + 1][j - 1]\`，所以要先算出更靠后的行。

以 \`s = "aab"\` 为例，回文区间有：

- \`s[0..0] = "a"\`
- \`s[1..1] = "a"\`
- \`s[2..2] = "b"\`
- \`s[0..1] = "aa"\`

回溯时从 \`index = 0\` 开始：

- 先切 \`"a"\`，继续切剩下的 \`"ab"\`，得到 \`["a","a","b"]\`
- 再切 \`"aa"\`，继续切剩下的 \`"b"\`，得到 \`["aa","b"]\`

遇到不是回文的候选，比如 \`"ab"\` 或 \`"aab"\`，直接跳过，不进入递归。`;

const solutionMarkdown = `\`\`\`java
import java.util.ArrayList;
import java.util.List;

class Solution {
    public List<List<String>> partition(String s) {
        List<List<String>> res = new ArrayList<>();
        List<String> path = new ArrayList<>();
        int n = s.length();
        boolean[][] dp = new boolean[n][n];

        for (int i = n - 1; i >= 0; i--) {
            for (int j = i; j < n; j++) {
                if (s.charAt(i) == s.charAt(j)) {
                    if (j - i <= 2 || dp[i + 1][j - 1]) {
                        dp[i][j] = true;
                    }
                }
            }
        }

        backtrack(res, path, 0, s, dp);
        return res;
    }

    private void backtrack(
            List<List<String>> res,
            List<String> path,
            int index,
            String s,
            boolean[][] dp
    ) {
        if (index == s.length()) {
            res.add(new ArrayList<>(path));
            return;
        }

        for (int i = index; i < s.length(); i++) {
            if (!dp[index][i]) {
                continue;
            }

            path.add(s.substring(index, i + 1));
            backtrack(res, path, i + 1, s, dp);
            path.remove(path.size() - 1);
        }
    }
}
\`\`\``;

const palindromeCells: Array<[number, number]> = [
  [0, 0],
  [1, 1],
  [2, 2],
  [0, 1],
];

export const palindromePartitioningProblem: ProblemDefinition = {
  id: "131",
  slug: "palindrome-partitioning",
  categoryId: "backtracking",
  titleZh: "分割回文串",
  titleEn: "Palindrome Partitioning",
  difficulty: "medium",
  tags: ["Backtracking", "Dynamic Programming", "String"],
  leetcodeUrl: "https://leetcode.cn/problems/palindrome-partitioning/",
  animationKey: "palindrome-partitioning",
  statementMarkdown,
  coreIdeaMarkdown,
  solutionMarkdown,
  animationSteps: [
    {
      titleZh: "定义 DP 表",
      titleEn: "Define the DP table",
      noteZh: '用 dp[i][j] 表示 s[i..j] 是否为回文串。示例字符串是 "aab"，先预处理所有可切的回文区间。',
      noteEn: 'Use dp[i][j] to mark whether s[i..j] is a palindrome. The sample string is "aab".',
      highlight: [],
      stringPath: [],
      stringResults: [],
      dpTrueCells: [],
      dpPhase: "prepare",
      scanIndex: 0,
      action: "choose",
    },
    {
      titleZh: "单字符 b 是回文",
      titleEn: "Single b is a palindrome",
      noteZh: '从右往左填表。i=2, j=2，子串 "b" 长度为 1，一定是回文。',
      noteEn: 'Fill the table from right to left. For i=2, j=2, substring "b" has length 1, so it is a palindrome.',
      highlight: [2],
      stringPath: [],
      stringResults: [],
      dpTrueCells: [[2, 2]],
      dpActiveCell: [2, 2],
      activeSubstring: "b",
      activeRange: [2, 2],
      dpPhase: "fill",
      scanIndex: 2,
      action: "record",
    },
    {
      titleZh: "单字符 a 是回文",
      titleEn: "Single a is a palindrome",
      noteZh: 'i=1, j=1，子串 "a" 也是回文。单个字符都能作为独立切分段。',
      noteEn: 'For i=1, j=1, substring "a" is also a palindrome. Every single character can be a partition segment.',
      highlight: [1],
      stringPath: [],
      stringResults: [],
      dpTrueCells: [[2, 2], [1, 1]],
      dpActiveCell: [1, 1],
      activeSubstring: "a",
      activeRange: [1, 1],
      dpPhase: "fill",
      scanIndex: 1,
      action: "record",
    },
    {
      titleZh: "ab 不是回文",
      titleEn: "ab is not a palindrome",
      noteZh: 'i=1, j=2，首尾字符 a 和 b 不相等，所以 dp[1][2] 保持 false，回溯时会跳过 "ab"。',
      noteEn: 'For i=1, j=2, the endpoints a and b are different, so dp[1][2] stays false.',
      highlight: [1, 2],
      stringPath: [],
      stringResults: [],
      dpTrueCells: [[2, 2], [1, 1]],
      dpRejectedCell: [1, 2],
      activeSubstring: "ab",
      activeRange: [1, 2],
      dpPhase: "fill",
      scanIndex: 1,
      action: "undo",
    },
    {
      titleZh: "单字符 a 是回文",
      titleEn: "Single a is a palindrome",
      noteZh: 'i=0, j=0，子串 "a" 也是回文，dp[0][0] 标记为 true。',
      noteEn: 'For i=0, j=0, substring "a" is a palindrome, so dp[0][0] is true.',
      highlight: [0],
      stringPath: [],
      stringResults: [],
      dpTrueCells: [[2, 2], [1, 1], [0, 0]],
      dpActiveCell: [0, 0],
      activeSubstring: "a",
      activeRange: [0, 0],
      dpPhase: "fill",
      scanIndex: 0,
      action: "record",
    },
    {
      titleZh: "aa 是回文",
      titleEn: "aa is a palindrome",
      noteZh: 'i=0, j=1，首尾都是 a，长度为 2，满足 j - i <= 2，所以 "aa" 是回文。',
      noteEn: 'For i=0, j=1, both endpoints are a and the length is 2, so "aa" is a palindrome.',
      highlight: [0, 1],
      stringPath: [],
      stringResults: [],
      dpTrueCells: palindromeCells,
      dpActiveCell: [0, 1],
      activeSubstring: "aa",
      activeRange: [0, 1],
      dpPhase: "fill",
      scanIndex: 0,
      action: "record",
    },
    {
      titleZh: "aab 不是回文",
      titleEn: "aab is not a palindrome",
      noteZh: 'i=0, j=2，首尾 a 和 b 不相等，所以整段 "aab" 不能一次切走。',
      noteEn: 'For i=0, j=2, endpoints a and b are different, so "aab" cannot be taken as one segment.',
      highlight: [0, 1, 2],
      stringPath: [],
      stringResults: [],
      dpTrueCells: palindromeCells,
      dpRejectedCell: [0, 2],
      activeSubstring: "aab",
      activeRange: [0, 2],
      dpPhase: "fill",
      scanIndex: 0,
      action: "undo",
    },
    {
      titleZh: "开始回溯搜索",
      titleEn: "Start backtracking",
      noteZh: "DP 表准备完成。现在从 index=0 开始枚举切分点，只允许选择 dp[index][i] 为 true 的子串。",
      noteEn: "The DP table is ready. Start from index=0 and only choose substrings whose dp[index][i] is true.",
      highlight: [],
      stringPath: [],
      stringResults: [],
      dpTrueCells: palindromeCells,
      dpPhase: "search",
      scanIndex: 0,
      activeNode: "root",
      visitedNodes: ["root"],
      action: "choose",
    },
    {
      titleZh: "选择第一个 a",
      titleEn: "Choose the first a",
      noteZh: 'index=0，候选 "a" 对应 dp[0][0]=true，把它加入 path，然后递归到 index=1。',
      noteEn: 'At index=0, candidate "a" has dp[0][0]=true. Add it to path and recurse to index=1.',
      highlight: [0],
      stringPath: ["a"],
      stringResults: [],
      dpTrueCells: palindromeCells,
      dpActiveCell: [0, 0],
      activeSubstring: "a",
      activeRange: [0, 0],
      dpPhase: "search",
      scanIndex: 1,
      activeNode: "a",
      activeEdge: "root-a",
      visitedNodes: ["root", "a"],
      action: "choose",
    },
    {
      titleZh: "继续选择第二个 a",
      titleEn: "Choose the second a",
      noteZh: 'index=1，候选 "a" 对应 dp[1][1]=true，path 变成 ["a","a"]，递归到 index=2。',
      noteEn: 'At index=1, candidate "a" has dp[1][1]=true. Path becomes ["a","a"], then recurse to index=2.',
      highlight: [1],
      stringPath: ["a", "a"],
      stringResults: [],
      dpTrueCells: palindromeCells,
      dpActiveCell: [1, 1],
      activeSubstring: "a",
      activeRange: [1, 1],
      dpPhase: "search",
      scanIndex: 2,
      activeNode: "a-a",
      activeEdge: "a-a-a",
      visitedNodes: ["root", "a", "a-a"],
      action: "choose",
    },
    {
      titleZh: "选择 b",
      titleEn: "Choose b",
      noteZh: 'index=2，候选 "b" 对应 dp[2][2]=true，path 变成 ["a","a","b"]。',
      noteEn: 'At index=2, candidate "b" has dp[2][2]=true. Path becomes ["a","a","b"].',
      highlight: [2],
      stringPath: ["a", "a", "b"],
      stringResults: [],
      dpTrueCells: palindromeCells,
      dpActiveCell: [2, 2],
      activeSubstring: "b",
      activeRange: [2, 2],
      dpPhase: "search",
      scanIndex: 3,
      activeNode: "a-a-b",
      activeEdge: "a-a-a-a-b",
      visitedNodes: ["root", "a", "a-a", "a-a-b"],
      action: "choose",
    },
    {
      titleZh: "记录第一种方案",
      titleEn: "Record the first partition",
      noteZh: 'index 到达字符串末尾，说明 path 中每一段都是回文，记录 ["a","a","b"]。',
      noteEn: 'Index reaches the end, so every segment in path is a palindrome. Record ["a","a","b"].',
      highlight: [0, 1, 2],
      stringPath: ["a", "a", "b"],
      stringResults: [["a", "a", "b"]],
      dpTrueCells: palindromeCells,
      dpActiveCell: [2, 2],
      activeSubstring: "a|a|b",
      activeRange: [0, 2],
      dpPhase: "search",
      scanIndex: 3,
      activeNode: "a-a-b",
      visitedNodes: ["root", "a", "a-a", "a-a-b"],
      action: "record",
    },
    {
      titleZh: "回到 index=1，跳过 ab",
      titleEn: "Back to index=1, skip ab",
      noteZh: '撤销 b 和第二个 a 后，尝试从 index=1 切 "ab"。dp[1][2]=false，所以直接跳过，不递归。',
      noteEn: 'Undo b and the second a, then try "ab" from index=1. Since dp[1][2]=false, skip it.',
      highlight: [1, 2],
      stringPath: ["a"],
      stringResults: [["a", "a", "b"]],
      dpTrueCells: palindromeCells,
      dpRejectedCell: [1, 2],
      activeSubstring: "ab",
      activeRange: [1, 2],
      dpPhase: "search",
      scanIndex: 1,
      activeNode: "a",
      visitedNodes: ["root", "a", "a-a", "a-a-b"],
      action: "undo",
      removed: 1,
    },
    {
      titleZh: "回到根节点，选择 aa",
      titleEn: "Back to root, choose aa",
      noteZh: '撤销第一个 a，回到 index=0。候选 "aa" 对应 dp[0][1]=true，把 "aa" 加入 path。',
      noteEn: 'Undo the first a and return to index=0. Candidate "aa" has dp[0][1]=true, so add it to path.',
      highlight: [0, 1],
      stringPath: ["aa"],
      stringResults: [["a", "a", "b"]],
      dpTrueCells: palindromeCells,
      dpActiveCell: [0, 1],
      activeSubstring: "aa",
      activeRange: [0, 1],
      dpPhase: "search",
      scanIndex: 2,
      activeNode: "aa",
      activeEdge: "root-aa",
      visitedNodes: ["root", "a", "a-a", "a-a-b", "aa"],
      action: "choose",
    },
    {
      titleZh: "选择剩下的 b",
      titleEn: "Choose the remaining b",
      noteZh: 'index=2，剩下的 "b" 是回文，path 变成 ["aa","b"]。',
      noteEn: 'At index=2, the remaining "b" is a palindrome. Path becomes ["aa","b"].',
      highlight: [2],
      stringPath: ["aa", "b"],
      stringResults: [["a", "a", "b"]],
      dpTrueCells: palindromeCells,
      dpActiveCell: [2, 2],
      activeSubstring: "b",
      activeRange: [2, 2],
      dpPhase: "search",
      scanIndex: 3,
      activeNode: "aa-b",
      activeEdge: "aa-aa-b",
      visitedNodes: ["root", "a", "a-a", "a-a-b", "aa", "aa-b"],
      action: "choose",
    },
    {
      titleZh: "记录第二种方案",
      titleEn: "Record the second partition",
      noteZh: '再次到达末尾，记录 ["aa","b"]。这就是示例中的第二个答案。',
      noteEn: 'Reach the end again and record ["aa","b"], the second answer in the sample.',
      highlight: [0, 1, 2],
      stringPath: ["aa", "b"],
      stringResults: [["a", "a", "b"], ["aa", "b"]],
      dpTrueCells: palindromeCells,
      dpActiveCell: [2, 2],
      activeSubstring: "aa|b",
      activeRange: [0, 2],
      dpPhase: "search",
      scanIndex: 3,
      activeNode: "aa-b",
      visitedNodes: ["root", "a", "a-a", "a-a-b", "aa", "aa-b"],
      action: "record",
    },
    {
      titleZh: "跳过 aab，搜索完成",
      titleEn: "Skip aab, search complete",
      noteZh: '回到根节点后还会尝试 "aab"，但 dp[0][2]=false，跳过。最终得到 2 种分割方案。',
      noteEn: 'Back at root, "aab" is also tried, but dp[0][2]=false, so skip it. The final result has 2 partitions.',
      highlight: [0, 1, 2],
      stringPath: [],
      stringResults: [["a", "a", "b"], ["aa", "b"]],
      dpTrueCells: palindromeCells,
      dpRejectedCell: [0, 2],
      activeSubstring: "aab",
      activeRange: [0, 2],
      dpPhase: "done",
      scanIndex: 0,
      activeNode: "root",
      visitedNodes: ["root", "a", "a-a", "a-a-b", "aa", "aa-b"],
      action: "done",
    },
  ],
};
