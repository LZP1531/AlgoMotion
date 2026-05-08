import type { ComponentType } from "react";
import type { AnimationSceneProps } from "./shared/AnimationSceneProps";
import { InorderTraversalScene } from "./scenes/inorder-traversal/InorderTraversalScene";
import { LetterCombinationsScene } from "./scenes/letter-combinations/LetterCombinationsScene";
import { PalindromePartitioningScene } from "./scenes/palindrome-partitioning/PalindromePartitioningScene";
import { PermutationsScene } from "./scenes/permutations/PermutationsScene";
import { ReverseLinkedListScene } from "./scenes/reverse-linked-list/ReverseLinkedListScene";
import { SubsetsScene } from "./scenes/subsets/SubsetsScene";
import { TwoSumScene } from "./scenes/two-sum/TwoSumScene";

interface AnimationSceneRegistration {
  Component: ComponentType<AnimationSceneProps>;
  frameClassName?: string;
  hideStepCopy?: boolean;
  intervalMs?: number;
}

const animationSceneRegistry: Record<string, AnimationSceneRegistration> = {
  "two-sum": {
    Component: TwoSumScene,
  },
  "reverse-list": {
    Component: ReverseLinkedListScene,
  },
  "inorder-tree": {
    Component: InorderTraversalScene,
  },
  subsets: {
    Component: SubsetsScene,
    frameClassName: "visual-scene-wide",
    hideStepCopy: true,
    intervalMs: 1350,
  },
  permutations: {
    Component: PermutationsScene,
    frameClassName: "visual-scene-wide",
    hideStepCopy: true,
  },
  "letter-combinations": {
    Component: LetterCombinationsScene,
    frameClassName: "visual-scene-wide",
    hideStepCopy: true,
  },
  "palindrome-partitioning": {
    Component: PalindromePartitioningScene,
    frameClassName: "visual-scene-wide",
    hideStepCopy: true,
  },
};

export function getAnimationScene(animationKey: string) {
  return animationSceneRegistry[animationKey] ?? animationSceneRegistry["two-sum"];
}
