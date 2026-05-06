import type { ProblemDefinition } from "../../../types/content";

const statementMarkdown = `给你单链表的头节点 \`head\`，请你反转链表，并返回反转后的链表。
`;

const solutionMarkdown = `## 思路

维护三个指针：\`prev\`、\`current\`、\`next\`。每次把当前节点指向前一个节点，然后整体向后移动。

\`\`\`ts
class ListNode {
  val: number;
  next: ListNode | null;

  constructor(val = 0, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}

function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  let current = head;

  while (current) {
    const next = current.next;
    current.next = prev;
    prev = current;
    current = next;
  }

  return prev;
}
\`\`\`
`;

export const reverseLinkedListProblem: ProblemDefinition = {
  id: "206",
  slug: "reverse-linked-list",
  categoryId: "linked-list",
  titleZh: "反转链表",
  titleEn: "Reverse Linked List",
  difficulty: "easy",
  tags: ["Pointer", "Linked List"],
  leetcodeUrl: "https://leetcode.cn/problems/reverse-linked-list/",
  animationKey: "reverse-list",
  statementMarkdown,
  solutionMarkdown,
  animationSteps: [
    {
      titleZh: "准备指针",
      titleEn: "Prepare pointers",
      noteZh: "prev 指向空，current 指向头节点 1。",
      noteEn: "prev is null, current points to node 1.",
      highlight: [0],
      pointer: 0,
    },
    {
      titleZh: "反转 1",
      titleEn: "Reverse 1",
      noteZh: "把 1 的 next 指向 prev，然后 prev 前进到 1。",
      noteEn: "Point 1.next to prev, then move prev to 1.",
      highlight: [0],
      pointer: 1,
    },
    {
      titleZh: "反转 2 和 3",
      titleEn: "Reverse 2 and 3",
      noteZh: "重复断开、反指、前进，链表方向逐步改变。",
      noteEn: "Repeat detach, reverse, and advance. The chain flips gradually.",
      highlight: [0, 1, 2],
      pointer: 3,
    },
    {
      titleZh: "完成反转",
      titleEn: "Complete",
      noteZh: "current 为空，prev 成为新的头节点。",
      noteEn: "current is null, and prev becomes the new head.",
      highlight: [0, 1, 2, 3],
    },
  ],
};
