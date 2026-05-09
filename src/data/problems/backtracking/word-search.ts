import type { ProblemDefinition } from "../../../types/content";

const statementMarkdown = `给定一个 \`m x n\` 二维字符网格 \`board\` 和一个字符串单词 \`word\`。如果 \`word\` 存在于网格中，返回 \`true\`；否则，返回 \`false\`。

单词必须按照字母顺序，通过相邻的单元格内的字母构成，其中“相邻”单元格是水平相邻或垂直相邻的单元格。同一个单元格内的字母不允许被重复使用。

## 示例 1

输入：

\`\`\`text
board = [
  ['A','B','C','E'],
  ['S','F','C','S'],
  ['A','D','E','E']
]
word = "ABCCED"
\`\`\`

输出：\`true\``;

const coreIdeaMarkdown = `## 核心思路

这道题是典型的 DFS + 回溯。

我们枚举网格里的每一个格子，把它当成单词的起点。对于每个起点，调用：

\`\`\`text
dfs(row, col, index)
\`\`\`

含义是：尝试从 \`board[row][col]\` 开始，匹配 \`word[index]\` 以及后面的字符。

DFS 里有几个剪枝条件：

1. 越界，直接失败。
2. 当前格子已经被当前路径使用过，直接失败。
3. 当前字符不等于 \`word[index]\`，直接失败。
4. 如果 \`index == word.length - 1\`，说明最后一个字符也匹配成功，直接返回 \`true\`。

如果当前格子匹配成功，就把 \`visited[row][col]\` 标记为 \`true\`，然后向下、上、右、左四个方向继续搜索下一个字符。

如果四个方向都走不通，就要回溯：

\`\`\`text
visited[row][col] = false
\`\`\`

这样这个格子才能被其他搜索路径重新使用。

以示例 \`word = "ABCCED"\` 为例，一条成功路径是：

\`\`\`text
A(0,0) -> B(0,1) -> C(0,2) -> C(1,2) -> E(2,2) -> D(2,1)
\`\`\`

搜索过程中会遇到很多失败候选，例如从 \`A\` 往下看到 \`S\`，但下一个要找的是 \`B\`，所以这条路会被剪掉；从第一个 \`C\` 往右看到 \`E\`，但下一个要找的是 \`C\`，也会被剪掉。`;

const solutionMarkdown = `\`\`\`java
class Solution {
    private int[][] dirs = {
        {1, 0},
        {-1, 0},
        {0, 1},
        {0, -1}
    };

    public boolean exist(char[][] board, String word) {
        int m = board.length;
        int n = board[0].length;
        boolean[][] visited = new boolean[m][n];

        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (dfs(board, word, i, j, 0, visited)) {
                    return true;
                }
            }
        }

        return false;
    }

    private boolean dfs(
            char[][] board,
            String word,
            int row,
            int col,
            int index,
            boolean[][] visited
    ) {
        if (row < 0 || row >= board.length || col < 0 || col >= board[0].length) {
            return false;
        }

        if (visited[row][col]) {
            return false;
        }

        if (board[row][col] != word.charAt(index)) {
            return false;
        }

        if (index == word.length() - 1) {
            return true;
        }

        visited[row][col] = true;

        for (int[] dir : dirs) {
            int nextRow = row + dir[0];
            int nextCol = col + dir[1];

            if (dfs(board, word, nextRow, nextCol, index + 1, visited)) {
                return true;
            }
        }

        visited[row][col] = false;
        return false;
    }
}
\`\`\``;

const finalPath: Array<[number, number]> = [
  [0, 0],
  [0, 1],
  [0, 2],
  [1, 2],
  [2, 2],
  [2, 1],
];

export const wordSearchProblem: ProblemDefinition = {
  id: "79",
  slug: "word-search",
  categoryId: "backtracking",
  titleZh: "单词搜索",
  titleEn: "Word Search",
  difficulty: "medium",
  tags: ["Backtracking", "DFS", "Matrix"],
  leetcodeUrl: "https://leetcode.cn/problems/word-search/",
  animationKey: "word-search",
  statementMarkdown,
  coreIdeaMarkdown,
  solutionMarkdown,
  animationSteps: [
    {
      titleZh: "准备搜索",
      titleEn: "Prepare the search",
      noteZh: '目标单词是 "ABCCED"。从每个格子尝试作为起点，visited 初始全为 false。',
      noteEn: 'The target word is "ABCCED". Try every cell as the start, with visited initialized to false.',
      highlight: [],
      wordPath: "",
      gridPath: [],
      visitedCells: [],
      candidateCells: [[0, 0]],
      wordIndex: 0,
      activeDirection: "start",
      gridPhase: "scan",
      action: "choose",
    },
    {
      titleZh: "起点 A 匹配",
      titleEn: "Start A matches",
      noteZh: 'board[0][0] = A，正好匹配 word[0]。标记 visited[0][0]，准备寻找下一个字符 B。',
      noteEn: 'board[0][0] is A, matching word[0]. Mark visited[0][0] and search for B.',
      highlight: [0],
      wordPath: "A",
      gridPath: [[0, 0]],
      visitedCells: [[0, 0]],
      activeCell: [0, 0],
      candidateCells: [[1, 0], [0, 1]],
      wordIndex: 0,
      activeDirection: "start",
      gridPhase: "match",
      action: "choose",
    },
    {
      titleZh: "向下看到 S，失败",
      titleEn: "Down sees S, reject",
      noteZh: "按照方向顺序先向下，来到 (1,0)。这里是 S，但需要 B，字符不匹配，剪掉这条分支。",
      noteEn: "Try down first at (1,0). It is S but we need B, so this branch is rejected.",
      highlight: [0],
      wordPath: "A",
      gridPath: [[0, 0]],
      visitedCells: [[0, 0]],
      activeCell: [0, 0],
      rejectedCell: [1, 0],
      wordIndex: 1,
      activeDirection: "down",
      gridPhase: "reject",
      action: "undo",
    },
    {
      titleZh: "向右选择 B",
      titleEn: "Move right to B",
      noteZh: "向右来到 (0,1)，字符 B 匹配 word[1]。加入路径并标记 visited。",
      noteEn: "Move right to (0,1). B matches word[1], so add it to the path and mark visited.",
      highlight: [0, 1],
      wordPath: "AB",
      gridPath: [[0, 0], [0, 1]],
      visitedCells: [[0, 0], [0, 1]],
      activeCell: [0, 1],
      candidateCells: [[1, 1], [0, 2], [0, 0]],
      wordIndex: 1,
      activeDirection: "right",
      activeEdge: "0,0-0,1",
      gridPhase: "match",
      action: "choose",
    },
    {
      titleZh: "向下看到 F，失败",
      titleEn: "Down sees F, reject",
      noteZh: "从 B 向下到 (1,1)，这里是 F，但下一个字符需要 C，剪枝返回。",
      noteEn: "From B, down reaches (1,1), which is F. The next character is C, so reject it.",
      highlight: [0, 1],
      wordPath: "AB",
      gridPath: [[0, 0], [0, 1]],
      visitedCells: [[0, 0], [0, 1]],
      activeCell: [0, 1],
      rejectedCell: [1, 1],
      wordIndex: 2,
      activeDirection: "down",
      gridPhase: "reject",
      action: "undo",
    },
    {
      titleZh: "向左会重复使用 A",
      titleEn: "Left would reuse A",
      noteZh: "从 B 向左回到 (0,0)，但 A 已经在当前路径中，visited=true，同一个格子不能重复使用。",
      noteEn: "From B, left returns to (0,0), but A is already visited in the current path, so it cannot be reused.",
      highlight: [0, 1],
      wordPath: "AB",
      gridPath: [[0, 0], [0, 1]],
      visitedCells: [[0, 0], [0, 1]],
      activeCell: [0, 1],
      rejectedCell: [0, 0],
      wordIndex: 2,
      activeDirection: "left",
      gridPhase: "reject",
      action: "undo",
    },
    {
      titleZh: "向右选择 C",
      titleEn: "Move right to C",
      noteZh: "从 B 向右到 (0,2)，字符 C 匹配 word[2]，路径变成 A -> B -> C。",
      noteEn: "From B, move right to (0,2). C matches word[2], so the path becomes A -> B -> C.",
      highlight: [0, 1, 2],
      wordPath: "ABC",
      gridPath: [[0, 0], [0, 1], [0, 2]],
      visitedCells: [[0, 0], [0, 1], [0, 2]],
      activeCell: [0, 2],
      candidateCells: [[1, 2], [0, 3], [0, 1]],
      wordIndex: 2,
      activeDirection: "right",
      activeEdge: "0,1-0,2",
      gridPhase: "match",
      action: "choose",
    },
    {
      titleZh: "向右看到 E，失败",
      titleEn: "Right sees E, reject",
      noteZh: "从第一个 C 向右到 (0,3)，这里是 E，但 word[3] 需要 C，所以不能走。",
      noteEn: "From the first C, right reaches (0,3), which is E. word[3] needs C, so reject it.",
      highlight: [0, 1, 2],
      wordPath: "ABC",
      gridPath: [[0, 0], [0, 1], [0, 2]],
      visitedCells: [[0, 0], [0, 1], [0, 2]],
      activeCell: [0, 2],
      rejectedCell: [0, 3],
      wordIndex: 3,
      activeDirection: "right",
      gridPhase: "reject",
      action: "undo",
    },
    {
      titleZh: "向左会重复使用 B",
      titleEn: "Left would reuse B",
      noteZh: "从 C 向左回到 B，但 B 已经在路径中，visited=true，不能重复使用。",
      noteEn: "From C, left returns to B, but B is already visited, so this move is invalid.",
      highlight: [0, 1, 2],
      wordPath: "ABC",
      gridPath: [[0, 0], [0, 1], [0, 2]],
      visitedCells: [[0, 0], [0, 1], [0, 2]],
      activeCell: [0, 2],
      rejectedCell: [0, 1],
      wordIndex: 3,
      activeDirection: "left",
      gridPhase: "reject",
      action: "undo",
    },
    {
      titleZh: "向下选择第二个 C",
      titleEn: "Move down to the second C",
      noteZh: "从 (0,2) 向下到 (1,2)，字符 C 匹配 word[3]，继续深入搜索 E。",
      noteEn: "Move down from (0,2) to (1,2). C matches word[3], then continue searching for E.",
      highlight: [0, 1, 2, 6],
      wordPath: "ABCC",
      gridPath: [[0, 0], [0, 1], [0, 2], [1, 2]],
      visitedCells: [[0, 0], [0, 1], [0, 2], [1, 2]],
      activeCell: [1, 2],
      candidateCells: [[2, 2], [0, 2], [1, 3], [1, 1]],
      wordIndex: 3,
      activeDirection: "down",
      activeEdge: "0,2-1,2",
      gridPhase: "match",
      action: "choose",
    },
    {
      titleZh: "向右看到 S，失败",
      titleEn: "Right sees S, reject",
      noteZh: "从第二个 C 向右到 (1,3)，这里是 S，但下一个需要 E，剪掉。",
      noteEn: "From the second C, right reaches (1,3), which is S. The next character is E, so reject it.",
      highlight: [0, 1, 2, 6],
      wordPath: "ABCC",
      gridPath: [[0, 0], [0, 1], [0, 2], [1, 2]],
      visitedCells: [[0, 0], [0, 1], [0, 2], [1, 2]],
      activeCell: [1, 2],
      rejectedCell: [1, 3],
      wordIndex: 4,
      activeDirection: "right",
      gridPhase: "reject",
      action: "undo",
    },
    {
      titleZh: "向下选择 E",
      titleEn: "Move down to E",
      noteZh: "从第二个 C 向下到 (2,2)，字符 E 匹配 word[4]，路径继续延长。",
      noteEn: "From the second C, move down to (2,2). E matches word[4], extending the path.",
      highlight: [0, 1, 2, 6, 10],
      wordPath: "ABCCE",
      gridPath: [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2]],
      visitedCells: [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2]],
      activeCell: [2, 2],
      candidateCells: [[1, 2], [2, 3], [2, 1]],
      wordIndex: 4,
      activeDirection: "down",
      activeEdge: "1,2-2,2",
      gridPhase: "match",
      action: "choose",
    },
    {
      titleZh: "向右看到 E，失败",
      titleEn: "Right sees E, reject",
      noteZh: "从 E 向右到 (2,3)，仍然是 E，但最后一个字符需要 D，所以跳过。",
      noteEn: "From E, right reaches (2,3), also E. The final character should be D, so skip it.",
      highlight: [0, 1, 2, 6, 10],
      wordPath: "ABCCE",
      gridPath: [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2]],
      visitedCells: [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2]],
      activeCell: [2, 2],
      rejectedCell: [2, 3],
      wordIndex: 5,
      activeDirection: "right",
      gridPhase: "reject",
      action: "undo",
    },
    {
      titleZh: "向左选择 D",
      titleEn: "Move left to D",
      noteZh: "从 E 向左到 (2,1)，字符 D 匹配 word[5]，已经匹配到最后一个字符。",
      noteEn: "From E, move left to (2,1). D matches word[5], the final character.",
      highlight: [0, 1, 2, 6, 10, 9],
      wordPath: "ABCCED",
      gridPath: finalPath,
      visitedCells: finalPath,
      activeCell: [2, 1],
      wordIndex: 5,
      activeDirection: "left",
      activeEdge: "2,2-2,1",
      gridPhase: "match",
      action: "choose",
    },
    {
      titleZh: "搜索成功",
      titleEn: "Search succeeds",
      noteZh: 'index == word.length - 1，说明 "ABCCED" 已完整匹配，返回 true。',
      noteEn: 'index == word.length - 1, so "ABCCED" is fully matched and the algorithm returns true.',
      highlight: [0, 1, 2, 6, 10, 9],
      wordPath: "ABCCED",
      wordResults: ["ABCCED"],
      gridPath: finalPath,
      visitedCells: finalPath,
      activeCell: [2, 1],
      wordIndex: 5,
      activeDirection: "left",
      gridPhase: "done",
      action: "done",
    },
  ],
};
