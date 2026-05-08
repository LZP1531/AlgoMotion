import type { AnimationStep, Problem } from "../../types/content";
import { twoSumProblem } from "./arrays/two-sum";
import { inorderTraversalProblem } from "./binary-tree/inorder-traversal";
import { subsetsProblem } from "./backtracking/subsets";
import { permutationsProblem } from "./backtracking/permutations";
import { letterCombinationsProblem } from "./backtracking/letter-combinations";
import { palindromePartitioningProblem } from "./backtracking/palindrome-partitioning";
import { reverseLinkedListProblem } from "./linked-list/reverse-linked-list";

const problemDefinitions = [
  twoSumProblem,
  reverseLinkedListProblem,
  inorderTraversalProblem,
  subsetsProblem,
  permutationsProblem,
  letterCombinationsProblem,
  palindromePartitioningProblem,
];

export const problems: Problem[] = problemDefinitions.map(({ animationSteps, ...problem }) => problem);

export const animationSteps: Record<string, AnimationStep[]> = Object.fromEntries(
  problemDefinitions.map((problem) => [problem.animationKey, problem.animationSteps]),
);
