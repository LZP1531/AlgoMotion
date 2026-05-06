export type Language = "zh" | "en";

export type ThemeName = "dark" | "light";

export type Difficulty = "easy" | "medium" | "hard";

export type CategoryIcon =
  | "array"
  | "link"
  | "tree"
  | "stack"
  | "queue"
  | "backtrack"
  | "greedy"
  | "dp";

export interface Category {
  id: string;
  nameZh: string;
  nameEn: string;
  icon: CategoryIcon;
  descriptionZh: string;
  descriptionEn: string;
}

export interface Problem {
  id: string;
  slug: string;
  categoryId: string;
  titleZh: string;
  titleEn: string;
  difficulty: Difficulty;
  tags: string[];
  leetcodeUrl: string;
  animationKey: string;
  statementMarkdown: string;
  solutionMarkdown: string;
}

export interface ProblemDefinition extends Problem {
  animationSteps: AnimationStep[];
}

export interface AnimationStep {
  titleZh: string;
  titleEn: string;
  noteZh: string;
  noteEn: string;
  highlight: number[];
  pointer?: number;
  target?: number;
  path?: number[];
  results?: number[][];
  used?: boolean[];
  activeNode?: string;
  activeEdge?: string;
  visitedNodes?: string[];
  action?: "record" | "choose" | "undo" | "done";
  choice?: number;
  removed?: number;
}
