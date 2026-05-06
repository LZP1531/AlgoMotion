import type { Difficulty, Language } from "../types/content";

const difficultyLabels: Record<Difficulty, Record<Language, string>> = {
  easy: {
    zh: "简单",
    en: "Easy",
  },
  medium: {
    zh: "中等",
    en: "Medium",
  },
  hard: {
    zh: "困难",
    en: "Hard",
  },
};

export function getDifficultyLabel(difficulty: Difficulty, language: Language) {
  return difficultyLabels[difficulty][language];
}
