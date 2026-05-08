import type { ProblemDefinition } from "../../../types/content";

const statementMarkdown = `给定一个仅包含数字 \`2-9\` 的字符串，返回所有它能表示的字母组合。答案可以按任意顺序返回。

数字到字母的映射与电话按键相同，注意 \`1\` 不对应任何字母。

## 示例 1

输入：\`digits = "23"\`

输出：\`["ad","ae","af","bd","be","bf","cd","ce","cf"]\`
`;

const coreIdeaMarkdown = `## 核心思路

这道题本质上是一棵回溯搜索树：\`digits\` 有几位，\`path\` 就要选择几个字母。

以 \`digits = "23"\` 为例，第一层看数字 \`2\`，可以选择 \`a / b / c\`；第二层看数字 \`3\`，可以选择 \`d / e / f\`。

每次做选择时，把字母追加到 \`path\`；递归结束后，再把刚才追加的字母删除，这一步就是回溯里的“撤销选择”。

当 \`index == digits.length()\` 时，说明每一位数字都已经选过一个字母，当前 \`path\` 就是一个完整组合，把它加入结果集。`;

const solutionMarkdown = `## 核心思路

这道题本质上是一个回溯搜索树：\`digits\` 有几位，\`path\` 就要选几个字母。

以 \`digits = "23"\` 为例，第一层看数字 \`2\`，可以选择 \`a / b / c\`；第二层看数字 \`3\`，可以选择 \`d / e / f\`。

每次做选择时，把字母追加到 \`path\`；递归结束后，再把刚才追加的字母删除，这一步就是回溯里的“撤销选择”。

当 \`index == digits.length()\` 时，说明每一位数字都已经选过一个字母，当前 \`path\` 就是一个完整组合，把它加入结果集。

## 递归过程

\`\`\`text
backtrack(index=0, path="")
  数字 2 -> 选择 a
    数字 3 -> 选择 d -> 记录 "ad" -> 撤销 d
    数字 3 -> 选择 e -> 记录 "ae" -> 撤销 e
    数字 3 -> 选择 f -> 记录 "af" -> 撤销 f
  撤销 a

  数字 2 -> 选择 b
    数字 3 -> 选择 d -> 记录 "bd" -> 撤销 d
    数字 3 -> 选择 e -> 记录 "be" -> 撤销 e
    数字 3 -> 选择 f -> 记录 "bf" -> 撤销 f
  撤销 b

  数字 2 -> 选择 c
    数字 3 -> 选择 d -> 记录 "cd" -> 撤销 d
    数字 3 -> 选择 e -> 记录 "ce" -> 撤销 e
    数字 3 -> 选择 f -> 记录 "cf" -> 撤销 f
  撤销 c
\`\`\`

## Java 答案

\`\`\`java
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

class Solution {
    public List<String> letterCombinations(String digits) {
        Map<String, String> map = new HashMap<>();
        map.put("2", "abc");
        map.put("3", "def");
        map.put("4", "ghi");
        map.put("5", "jkl");
        map.put("6", "mno");
        map.put("7", "pqrs");
        map.put("8", "tuv");
        map.put("9", "wxyz");

        List<String> result = new ArrayList<>();
        StringBuilder path = new StringBuilder();

        if (digits.length() == 0) {
            return result;
        }

        backtrack(result, path, digits, map, 0);
        return result;
    }

    private void backtrack(
            List<String> result,
            StringBuilder path,
            String digits,
            Map<String, String> map,
            int index
    ) {
        if (index == digits.length()) {
            result.add(path.toString());
            return;
        }

        char digit = digits.charAt(index);
        String letters = map.get(String.valueOf(digit));

        for (int i = 0; i < letters.length(); i++) {
            char choice = letters.charAt(i);

            path.append(choice);

            backtrack(result, path, digits, map, index + 1);

            path.deleteCharAt(path.length() - 1);
        }
    }
}
\`\`\`
`;

const groups = ["abc", "def"];

export const letterCombinationsProblem: ProblemDefinition = {
  id: "17",
  slug: "letter-combinations-of-a-phone-number",
  categoryId: "backtracking",
  titleZh: "电话号码的字母组合",
  titleEn: "Letter Combinations of a Phone Number",
  difficulty: "medium",
  tags: ["Backtracking", "String", "Hash Table"],
  leetcodeUrl: "https://leetcode.cn/problems/letter-combinations-of-a-phone-number/",
  animationKey: "letter-combinations",
  statementMarkdown,
  coreIdeaMarkdown,
  solutionMarkdown,
  animationSteps: [
    {
      titleZh: "准备数字映射",
      titleEn: "Prepare digit mapping",
      noteZh: '输入 digits="23"。数字 2 对应 abc，数字 3 对应 def。path 和 res 都从空开始。',
      noteEn: 'Input digits="23". Digit 2 maps to abc, digit 3 maps to def. Both path and res start empty.',
      highlight: [],
      wordPath: "",
      wordResults: [],
      digitIndex: 0,
      activeDigit: "2",
      letterGroups: groups,
      activeNode: "root",
      visitedNodes: ["root"],
      action: "choose",
    },
    {
      titleZh: "选择 a",
      titleEn: "Choose a",
      noteZh: "index=0，当前数字是 2。从 abc 中选择 a，把 a 放入 path 的第 1 个槽位。",
      noteEn: "At index=0, the current digit is 2. Choose a from abc and put it into the first path slot.",
      highlight: [0],
      wordPath: "a",
      wordResults: [],
      digitIndex: 0,
      activeDigit: "2",
      activeLetter: "a",
      letterGroups: groups,
      activeNode: "a",
      activeEdge: "root-a",
      visitedNodes: ["root", "a"],
      action: "choose",
      choice: 0,
    },
    {
      titleZh: "选择 d",
      titleEn: "Choose d",
      noteZh: "递归进入 index=1，当前数字是 3。从 def 中选择 d，把 d 放入 path 的第 2 个槽位。",
      noteEn: "Recurse to index=1. The current digit is 3. Choose d from def and put it into the second path slot.",
      highlight: [0, 1],
      wordPath: "ad",
      wordResults: [],
      digitIndex: 1,
      activeDigit: "3",
      activeLetter: "d",
      letterGroups: groups,
      activeNode: "ad",
      activeEdge: "a-ad",
      visitedNodes: ["root", "a", "ad"],
      action: "choose",
      choice: 0,
    },
    {
      titleZh: "记录 ad",
      titleEn: "Record ad",
      noteZh: "path 已经是 ad，长度等于 digits.length，说明得到一个完整组合，把 ad 放入 res。",
      noteEn: "The path is ad, whose length equals digits.length. We found a complete combination, so add ad to res.",
      highlight: [0, 1],
      wordPath: "ad",
      wordResults: ["ad"],
      digitIndex: 2,
      activeLetter: "d",
      letterGroups: groups,
      activeNode: "ad",
      activeEdge: "a-ad",
      visitedNodes: ["root", "a", "ad"],
      action: "record",
      choice: 0,
    },
    {
      titleZh: "撤销 d",
      titleEn: "Undo d",
      noteZh: "ad 这一支已经记录完成，回到上一层，删除最后选择的 d，path 回到 a。",
      noteEn: "The ad branch has been recorded. Return to the previous level, remove d, and path goes back to a.",
      highlight: [0],
      wordPath: "a",
      wordResults: ["ad"],
      digitIndex: 1,
      activeDigit: "3",
      activeLetter: "d",
      letterGroups: groups,
      activeNode: "a",
      activeEdge: "a-ad",
      visitedNodes: ["root", "a", "ad"],
      action: "undo",
      removed: 1,
    },
    {
      titleZh: "选择 e",
      titleEn: "Choose e",
      noteZh: "仍然在 index=1，for 循环继续尝试下一个候选字母 e，path 变成 ae。",
      noteEn: "Still at index=1, the loop tries the next candidate e. The path becomes ae.",
      highlight: [0, 1],
      wordPath: "ae",
      wordResults: ["ad"],
      digitIndex: 1,
      activeDigit: "3",
      activeLetter: "e",
      letterGroups: groups,
      activeNode: "ae",
      activeEdge: "a-ae",
      visitedNodes: ["root", "a", "ad", "ae"],
      action: "choose",
      choice: 1,
    },
    {
      titleZh: "记录 ae",
      titleEn: "Record ae",
      noteZh: "path=ae，又到达递归出口，把 ae 加入 res。",
      noteEn: "The path is ae, so we reached the base case again. Add ae to res.",
      highlight: [0, 1],
      wordPath: "ae",
      wordResults: ["ad", "ae"],
      digitIndex: 2,
      activeLetter: "e",
      letterGroups: groups,
      activeNode: "ae",
      activeEdge: "a-ae",
      visitedNodes: ["root", "a", "ad", "ae"],
      action: "record",
      choice: 1,
    },
    {
      titleZh: "撤销 e",
      titleEn: "Undo e",
      noteZh: "ae 记录完成，删除 e，path 回到 a，准备尝试同层的下一个字母。",
      noteEn: "After recording ae, remove e. The path returns to a, ready to try the next letter at the same level.",
      highlight: [0],
      wordPath: "a",
      wordResults: ["ad", "ae"],
      digitIndex: 1,
      activeDigit: "3",
      activeLetter: "e",
      letterGroups: groups,
      activeNode: "a",
      activeEdge: "a-ae",
      visitedNodes: ["root", "a", "ad", "ae"],
      action: "undo",
      removed: 1,
    },
    {
      titleZh: "选择 f",
      titleEn: "Choose f",
      noteZh: "index=1 继续选择 f，path 从 a 变成 af。",
      noteEn: "At index=1, choose f next. The path changes from a to af.",
      highlight: [0, 1],
      wordPath: "af",
      wordResults: ["ad", "ae"],
      digitIndex: 1,
      activeDigit: "3",
      activeLetter: "f",
      letterGroups: groups,
      activeNode: "af",
      activeEdge: "a-af",
      visitedNodes: ["root", "a", "ad", "ae", "af"],
      action: "choose",
      choice: 2,
    },
    {
      titleZh: "记录 af",
      titleEn: "Record af",
      noteZh: "path=af，记录第三个以 a 开头的组合。现在 a 分支下的 d/e/f 都试完了。",
      noteEn: "The path is af. Record the third combination starting with a. Now d/e/f under branch a are all tried.",
      highlight: [0, 1],
      wordPath: "af",
      wordResults: ["ad", "ae", "af"],
      digitIndex: 2,
      activeLetter: "f",
      letterGroups: groups,
      activeNode: "af",
      activeEdge: "a-af",
      visitedNodes: ["root", "a", "ad", "ae", "af"],
      action: "record",
      choice: 2,
    },
    {
      titleZh: "撤销 f",
      titleEn: "Undo f",
      noteZh: "af 记录完成，撤销 f，path 回到 a。",
      noteEn: "After recording af, undo f and the path goes back to a.",
      highlight: [0],
      wordPath: "a",
      wordResults: ["ad", "ae", "af"],
      digitIndex: 1,
      activeDigit: "3",
      activeLetter: "f",
      letterGroups: groups,
      activeNode: "a",
      activeEdge: "a-af",
      visitedNodes: ["root", "a", "ad", "ae", "af"],
      action: "undo",
      removed: 1,
    },
    {
      titleZh: "撤销 a",
      titleEn: "Undo a",
      noteZh: "a 后面的 d/e/f 都已经试完，回到 index=0，撤销 a，准备选择 b。",
      noteEn: "All d/e/f choices after a are done. Return to index=0, undo a, and get ready to choose b.",
      highlight: [],
      wordPath: "",
      wordResults: ["ad", "ae", "af"],
      digitIndex: 0,
      activeDigit: "2",
      activeLetter: "a",
      letterGroups: groups,
      activeNode: "root",
      activeEdge: "root-a",
      visitedNodes: ["root", "a", "ad", "ae", "af"],
      action: "undo",
      removed: 0,
    },
    {
      titleZh: "选择 b",
      titleEn: "Choose b",
      noteZh: "回到第一层，数字 2 的下一个候选字母是 b，把 b 放入 path。",
      noteEn: "Back at the first level, the next candidate for digit 2 is b. Put b into path.",
      highlight: [0],
      wordPath: "b",
      wordResults: ["ad", "ae", "af"],
      digitIndex: 0,
      activeDigit: "2",
      activeLetter: "b",
      letterGroups: groups,
      activeNode: "b",
      activeEdge: "root-b",
      visitedNodes: ["root", "a", "ad", "ae", "af", "b"],
      action: "choose",
      choice: 1,
    },
    {
      titleZh: "选择 d",
      titleEn: "Choose d",
      noteZh: "递归到 index=1，在 b 后面选择 d，path 变成 bd。",
      noteEn: "Recurse to index=1. Choose d after b, and the path becomes bd.",
      highlight: [0, 1],
      wordPath: "bd",
      wordResults: ["ad", "ae", "af"],
      digitIndex: 1,
      activeDigit: "3",
      activeLetter: "d",
      letterGroups: groups,
      activeNode: "bd",
      activeEdge: "b-bd",
      visitedNodes: ["root", "a", "ad", "ae", "af", "b", "bd"],
      action: "choose",
      choice: 0,
    },
    {
      titleZh: "记录 bd",
      titleEn: "Record bd",
      noteZh: "path=bd，达到出口条件，记录 bd。",
      noteEn: "The path is bd. We reached the base case, so record bd.",
      highlight: [0, 1],
      wordPath: "bd",
      wordResults: ["ad", "ae", "af", "bd"],
      digitIndex: 2,
      activeLetter: "d",
      letterGroups: groups,
      activeNode: "bd",
      activeEdge: "b-bd",
      visitedNodes: ["root", "a", "ad", "ae", "af", "b", "bd"],
      action: "record",
      choice: 0,
    },
    {
      titleZh: "撤销 d",
      titleEn: "Undo d",
      noteZh: "bd 记录完成，撤销 d，path 回到 b。",
      noteEn: "After recording bd, undo d and the path returns to b.",
      highlight: [0],
      wordPath: "b",
      wordResults: ["ad", "ae", "af", "bd"],
      digitIndex: 1,
      activeDigit: "3",
      activeLetter: "d",
      letterGroups: groups,
      activeNode: "b",
      activeEdge: "b-bd",
      visitedNodes: ["root", "a", "ad", "ae", "af", "b", "bd"],
      action: "undo",
      removed: 1,
    },
    {
      titleZh: "选择 e",
      titleEn: "Choose e",
      noteZh: "b 分支下继续选择 e，path 变成 be。",
      noteEn: "Under branch b, choose e next. The path becomes be.",
      highlight: [0, 1],
      wordPath: "be",
      wordResults: ["ad", "ae", "af", "bd"],
      digitIndex: 1,
      activeDigit: "3",
      activeLetter: "e",
      letterGroups: groups,
      activeNode: "be",
      activeEdge: "b-be",
      visitedNodes: ["root", "a", "ad", "ae", "af", "b", "bd", "be"],
      action: "choose",
      choice: 1,
    },
    {
      titleZh: "记录 be",
      titleEn: "Record be",
      noteZh: "path=be，记录 be。",
      noteEn: "The path is be. Record be.",
      highlight: [0, 1],
      wordPath: "be",
      wordResults: ["ad", "ae", "af", "bd", "be"],
      digitIndex: 2,
      activeLetter: "e",
      letterGroups: groups,
      activeNode: "be",
      activeEdge: "b-be",
      visitedNodes: ["root", "a", "ad", "ae", "af", "b", "bd", "be"],
      action: "record",
      choice: 1,
    },
    {
      titleZh: "撤销 e",
      titleEn: "Undo e",
      noteZh: "be 记录完成，撤销 e，path 回到 b。",
      noteEn: "After recording be, undo e and the path returns to b.",
      highlight: [0],
      wordPath: "b",
      wordResults: ["ad", "ae", "af", "bd", "be"],
      digitIndex: 1,
      activeDigit: "3",
      activeLetter: "e",
      letterGroups: groups,
      activeNode: "b",
      activeEdge: "b-be",
      visitedNodes: ["root", "a", "ad", "ae", "af", "b", "bd", "be"],
      action: "undo",
      removed: 1,
    },
    {
      titleZh: "选择 f",
      titleEn: "Choose f",
      noteZh: "b 分支下最后选择 f，path 变成 bf。",
      noteEn: "Under branch b, choose f last. The path becomes bf.",
      highlight: [0, 1],
      wordPath: "bf",
      wordResults: ["ad", "ae", "af", "bd", "be"],
      digitIndex: 1,
      activeDigit: "3",
      activeLetter: "f",
      letterGroups: groups,
      activeNode: "bf",
      activeEdge: "b-bf",
      visitedNodes: ["root", "a", "ad", "ae", "af", "b", "bd", "be", "bf"],
      action: "choose",
      choice: 2,
    },
    {
      titleZh: "记录 bf",
      titleEn: "Record bf",
      noteZh: "path=bf，记录 bf。现在 b 分支下的三个组合都完成了。",
      noteEn: "The path is bf. Record bf. Now all three combinations under branch b are done.",
      highlight: [0, 1],
      wordPath: "bf",
      wordResults: ["ad", "ae", "af", "bd", "be", "bf"],
      digitIndex: 2,
      activeLetter: "f",
      letterGroups: groups,
      activeNode: "bf",
      activeEdge: "b-bf",
      visitedNodes: ["root", "a", "ad", "ae", "af", "b", "bd", "be", "bf"],
      action: "record",
      choice: 2,
    },
    {
      titleZh: "撤销 f",
      titleEn: "Undo f",
      noteZh: "bf 记录完成，撤销 f，path 回到 b。",
      noteEn: "After recording bf, undo f and the path returns to b.",
      highlight: [0],
      wordPath: "b",
      wordResults: ["ad", "ae", "af", "bd", "be", "bf"],
      digitIndex: 1,
      activeDigit: "3",
      activeLetter: "f",
      letterGroups: groups,
      activeNode: "b",
      activeEdge: "b-bf",
      visitedNodes: ["root", "a", "ad", "ae", "af", "b", "bd", "be", "bf"],
      action: "undo",
      removed: 1,
    },
    {
      titleZh: "撤销 b",
      titleEn: "Undo b",
      noteZh: "b 后面的 d/e/f 都试完，撤销 b，回到第一层继续选择 c。",
      noteEn: "All d/e/f choices after b are done. Undo b and return to the first level to choose c.",
      highlight: [],
      wordPath: "",
      wordResults: ["ad", "ae", "af", "bd", "be", "bf"],
      digitIndex: 0,
      activeDigit: "2",
      activeLetter: "b",
      letterGroups: groups,
      activeNode: "root",
      activeEdge: "root-b",
      visitedNodes: ["root", "a", "ad", "ae", "af", "b", "bd", "be", "bf"],
      action: "undo",
      removed: 0,
    },
    {
      titleZh: "选择 c",
      titleEn: "Choose c",
      noteZh: "第一层最后一个候选字母是 c，把 c 放入 path。",
      noteEn: "The last candidate at the first level is c. Put c into path.",
      highlight: [0],
      wordPath: "c",
      wordResults: ["ad", "ae", "af", "bd", "be", "bf"],
      digitIndex: 0,
      activeDigit: "2",
      activeLetter: "c",
      letterGroups: groups,
      activeNode: "c",
      activeEdge: "root-c",
      visitedNodes: ["root", "a", "ad", "ae", "af", "b", "bd", "be", "bf", "c"],
      action: "choose",
      choice: 2,
    },
    {
      titleZh: "选择 d",
      titleEn: "Choose d",
      noteZh: "递归到 index=1，在 c 后面选择 d，path 变成 cd。",
      noteEn: "Recurse to index=1. Choose d after c, and the path becomes cd.",
      highlight: [0, 1],
      wordPath: "cd",
      wordResults: ["ad", "ae", "af", "bd", "be", "bf"],
      digitIndex: 1,
      activeDigit: "3",
      activeLetter: "d",
      letterGroups: groups,
      activeNode: "cd",
      activeEdge: "c-cd",
      visitedNodes: ["root", "a", "ad", "ae", "af", "b", "bd", "be", "bf", "c", "cd"],
      action: "choose",
      choice: 0,
    },
    {
      titleZh: "记录 cd",
      titleEn: "Record cd",
      noteZh: "path=cd，记录 cd。",
      noteEn: "The path is cd. Record cd.",
      highlight: [0, 1],
      wordPath: "cd",
      wordResults: ["ad", "ae", "af", "bd", "be", "bf", "cd"],
      digitIndex: 2,
      activeLetter: "d",
      letterGroups: groups,
      activeNode: "cd",
      activeEdge: "c-cd",
      visitedNodes: ["root", "a", "ad", "ae", "af", "b", "bd", "be", "bf", "c", "cd"],
      action: "record",
      choice: 0,
    },
    {
      titleZh: "撤销 d",
      titleEn: "Undo d",
      noteZh: "cd 记录完成，撤销 d，path 回到 c。",
      noteEn: "After recording cd, undo d and the path returns to c.",
      highlight: [0],
      wordPath: "c",
      wordResults: ["ad", "ae", "af", "bd", "be", "bf", "cd"],
      digitIndex: 1,
      activeDigit: "3",
      activeLetter: "d",
      letterGroups: groups,
      activeNode: "c",
      activeEdge: "c-cd",
      visitedNodes: ["root", "a", "ad", "ae", "af", "b", "bd", "be", "bf", "c", "cd"],
      action: "undo",
      removed: 1,
    },
    {
      titleZh: "选择 e",
      titleEn: "Choose e",
      noteZh: "c 分支下继续选择 e，path 变成 ce。",
      noteEn: "Under branch c, choose e next. The path becomes ce.",
      highlight: [0, 1],
      wordPath: "ce",
      wordResults: ["ad", "ae", "af", "bd", "be", "bf", "cd"],
      digitIndex: 1,
      activeDigit: "3",
      activeLetter: "e",
      letterGroups: groups,
      activeNode: "ce",
      activeEdge: "c-ce",
      visitedNodes: ["root", "a", "ad", "ae", "af", "b", "bd", "be", "bf", "c", "cd", "ce"],
      action: "choose",
      choice: 1,
    },
    {
      titleZh: "记录 ce",
      titleEn: "Record ce",
      noteZh: "path=ce，记录 ce。",
      noteEn: "The path is ce. Record ce.",
      highlight: [0, 1],
      wordPath: "ce",
      wordResults: ["ad", "ae", "af", "bd", "be", "bf", "cd", "ce"],
      digitIndex: 2,
      activeLetter: "e",
      letterGroups: groups,
      activeNode: "ce",
      activeEdge: "c-ce",
      visitedNodes: ["root", "a", "ad", "ae", "af", "b", "bd", "be", "bf", "c", "cd", "ce"],
      action: "record",
      choice: 1,
    },
    {
      titleZh: "撤销 e",
      titleEn: "Undo e",
      noteZh: "ce 记录完成，撤销 e，path 回到 c。",
      noteEn: "After recording ce, undo e and the path returns to c.",
      highlight: [0],
      wordPath: "c",
      wordResults: ["ad", "ae", "af", "bd", "be", "bf", "cd", "ce"],
      digitIndex: 1,
      activeDigit: "3",
      activeLetter: "e",
      letterGroups: groups,
      activeNode: "c",
      activeEdge: "c-ce",
      visitedNodes: ["root", "a", "ad", "ae", "af", "b", "bd", "be", "bf", "c", "cd", "ce"],
      action: "undo",
      removed: 1,
    },
    {
      titleZh: "选择 f",
      titleEn: "Choose f",
      noteZh: "c 分支下最后选择 f，path 变成 cf。",
      noteEn: "Under branch c, choose f last. The path becomes cf.",
      highlight: [0, 1],
      wordPath: "cf",
      wordResults: ["ad", "ae", "af", "bd", "be", "bf", "cd", "ce"],
      digitIndex: 1,
      activeDigit: "3",
      activeLetter: "f",
      letterGroups: groups,
      activeNode: "cf",
      activeEdge: "c-cf",
      visitedNodes: ["root", "a", "ad", "ae", "af", "b", "bd", "be", "bf", "c", "cd", "ce", "cf"],
      action: "choose",
      choice: 2,
    },
    {
      titleZh: "记录 cf",
      titleEn: "Record cf",
      noteZh: "path=cf，记录最后一个组合 cf。",
      noteEn: "The path is cf. Record the final combination cf.",
      highlight: [0, 1],
      wordPath: "cf",
      wordResults: ["ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"],
      digitIndex: 2,
      activeLetter: "f",
      letterGroups: groups,
      activeNode: "cf",
      activeEdge: "c-cf",
      visitedNodes: ["root", "a", "ad", "ae", "af", "b", "bd", "be", "bf", "c", "cd", "ce", "cf"],
      action: "record",
      choice: 2,
    },
    {
      titleZh: "撤销 f",
      titleEn: "Undo f",
      noteZh: "cf 记录完成，撤销 f，path 回到 c。",
      noteEn: "After recording cf, undo f and the path returns to c.",
      highlight: [0],
      wordPath: "c",
      wordResults: ["ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"],
      digitIndex: 1,
      activeDigit: "3",
      activeLetter: "f",
      letterGroups: groups,
      activeNode: "c",
      activeEdge: "c-cf",
      visitedNodes: ["root", "a", "ad", "ae", "af", "b", "bd", "be", "bf", "c", "cd", "ce", "cf"],
      action: "undo",
      removed: 1,
    },
    {
      titleZh: "撤销 c",
      titleEn: "Undo c",
      noteZh: "c 后面的 d/e/f 都已经试完，撤销 c，path 回到空字符串。",
      noteEn: "All d/e/f choices after c are done. Undo c and the path returns to an empty string.",
      highlight: [],
      wordPath: "",
      wordResults: ["ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"],
      digitIndex: 0,
      activeDigit: "2",
      activeLetter: "c",
      letterGroups: groups,
      activeNode: "root",
      activeEdge: "root-c",
      visitedNodes: ["root", "a", "ad", "ae", "af", "b", "bd", "be", "bf", "c", "cd", "ce", "cf"],
      action: "undo",
      removed: 0,
    },
    {
      titleZh: "完成所有组合",
      titleEn: "All combinations complete",
      noteZh: "所有分支都遍历完毕。最终得到 3 × 3 = 9 个组合。",
      noteEn: "Every branch has been explored. Finally, we get 3 x 3 = 9 combinations.",
      highlight: [],
      wordPath: "",
      wordResults: ["ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"],
      digitIndex: 2,
      letterGroups: groups,
      activeNode: "root",
      visitedNodes: ["root", "a", "ad", "ae", "af", "b", "bd", "be", "bf", "c", "cd", "ce", "cf"],
      action: "done",
    },
  ],
};
