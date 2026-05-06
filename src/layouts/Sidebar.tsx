import {
  Binary,
  Braces,
  ChartNoAxesCombined,
  CircleDot,
  GitBranch,
  Layers3,
  type LucideIcon,
  ListTree,
  Network,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { Tooltip } from "../components/Tooltip";
import { categories } from "../data/categories";
import type { CategoryIcon, Language } from "../types/content";

const iconMap: Record<CategoryIcon, LucideIcon> = {
  array: Braces,
  link: GitBranch,
  tree: Network,
  stack: Layers3,
  queue: ListTree,
  backtrack: CircleDot,
  greedy: ChartNoAxesCombined,
  dp: Binary,
};

interface SidebarProps {
  language: Language;
  isOpen: boolean;
  isCollapsed: boolean;
}

export function Sidebar({ language, isOpen, isCollapsed }: SidebarProps) {
  return (
    <aside className={`sidebar ${isOpen ? "open" : ""} ${isCollapsed ? "collapsed" : ""}`}>
      <nav className="category-nav" aria-label="Problem categories">
        {categories.map((category) => {
          const Icon = iconMap[category.icon];
          const label = language === "zh" ? category.nameZh : category.nameEn;
          const categoryLink = (
            <NavLink to={`/category/${category.id}`} className="category-link" data-label={label}>
              <span className="category-icon">
                <Icon size={19} />
              </span>
              <span className="category-copy">
                <strong>{label}</strong>
                <small>{language === "zh" ? category.descriptionZh : category.descriptionEn}</small>
              </span>
            </NavLink>
          );

          return isCollapsed ? (
            <Tooltip key={category.id} label={label}>
              {categoryLink}
            </Tooltip>
          ) : (
            <span className="category-link-wrap" key={category.id}>
              {categoryLink}
            </span>
          );
        })}
      </nav>
    </aside>
  );
}
