import {
  ChevronLeft,
  ChevronRight,
  Languages,
  Maximize2,
  Menu,
  Minimize2,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Route,
  Sun,
} from "lucide-react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Tooltip } from "../components/Tooltip";
import { categories } from "../data/categories";
import { problems } from "../data/problems";
import type { Language, ThemeName } from "../types/content";
import { useLocalPreference } from "../hooks/useLocalPreference";

export function AppShell() {
  const [theme, setTheme] = useLocalPreference<ThemeName>("algomotion-theme", "light");
  const [language, setLanguage] = useLocalPreference<Language>("algomotion-language", "zh");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  }, [language]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const routeState = useMemo(() => {
    const [, routeType, routeValue] = location.pathname.split("/");

    if (routeType === "problem") {
      const problem = problems.find((item) => item.slug === routeValue);
      const category = categories.find((item) => item.id === problem?.categoryId);

      if (problem && category) {
        return { category, problem };
      }
    }

    const category = categories.find((item) => item.id === routeValue) ?? categories[0];
    return { category, problem: undefined };
  }, [location.pathname]);

  const breadcrumb = useMemo(() => {
    const items = [language === "zh" ? routeState.category.nameZh : routeState.category.nameEn];

    if (routeState.problem) {
      items.push(language === "zh" ? routeState.problem.titleZh : routeState.problem.titleEn);
    }

    return items;
  }, [language, routeState]);

  const activeProblemIndex = routeState.problem
    ? problems.findIndex((problem) => problem.slug === routeState.problem?.slug)
    : -1;
  const previousProblem = activeProblemIndex > 0 ? problems[activeProblemIndex - 1] : undefined;
  const nextProblem = activeProblemIndex >= 0 && activeProblemIndex < problems.length - 1 ? problems[activeProblemIndex + 1] : undefined;

  async function toggleFullscreen() {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      return;
    }
    await document.exitFullscreen();
  }

  return (
    <div className={`app-shell ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      <header className="topbar">
        <button className="icon-button menu-button" type="button" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
          <Menu size={20} />
        </button>

        <div className="topbar-brand">
          <div className="brand-mark">A</div>
          <strong>AlgoMotion</strong>
        </div>

        <div className="topbar-nav-actions">
          <Tooltip label={language === "zh" ? (sidebarCollapsed ? "展开目录" : "收缩目录") : sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}>
            <button
              className="icon-button"
              type="button"
              onClick={() => setSidebarCollapsed((value) => !value)}
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
            </button>
          </Tooltip>
          <Tooltip label={language === "zh" ? "上一题" : "Previous problem"}>
            <button
              className="icon-button"
              type="button"
              disabled={!previousProblem}
              onClick={() => previousProblem && navigate(`/problem/${previousProblem.slug}`)}
              aria-label="Previous problem"
            >
              <ChevronLeft size={18} />
            </button>
          </Tooltip>
          <Tooltip label={language === "zh" ? "下一题" : "Next problem"}>
            <button
              className="icon-button"
              type="button"
              disabled={!nextProblem}
              onClick={() => nextProblem && navigate(`/problem/${nextProblem.slug}`)}
              aria-label="Next problem"
            >
              <ChevronRight size={18} />
            </button>
          </Tooltip>
        </div>

        <div className="topbar-breadcrumb" aria-label="Current location">
          <Route size={14} />
          {breadcrumb.map((item, index) => (
            <span key={`${item}-${index}`} className={`breadcrumb-item ${index === breadcrumb.length - 1 ? "current" : ""}`}>
              {index === breadcrumb.length - 1 && routeState.problem ? (
                <a href={routeState.problem.leetcodeUrl} target="_blank" rel="noreferrer">
                  {item}
                </a>
              ) : (
                item
              )}
            </span>
          ))}
        </div>

        <div className="topbar-actions">
          <Tooltip label={language === "zh" ? "切换主题" : "Toggle theme"}>
            <button
              className="tool-button"
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              <span>{theme === "dark" ? "Light" : "Dark"}</span>
            </button>
          </Tooltip>
          <Tooltip label={language === "zh" ? "切换语言" : "Toggle language"}>
            <button
              className="tool-button"
              type="button"
              onClick={() => setLanguage(language === "zh" ? "en" : "zh")}
              aria-label="Toggle language"
            >
              <Languages size={18} />
              <span>{language === "zh" ? "EN" : "中"}</span>
            </button>
          </Tooltip>
          <Tooltip label={language === "zh" ? "全屏" : "Fullscreen"}>
            <button className="icon-button" type="button" onClick={toggleFullscreen} aria-label="Toggle fullscreen">
              {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
          </Tooltip>
        </div>
      </header>

      <div className="workspace">
        <Sidebar
          language={language}
          isOpen={sidebarOpen}
          isCollapsed={sidebarCollapsed}
        />
        <main className="content-panel">
          <Outlet context={{ language }} />
        </main>
      </div>

      <button
        className={`sidebar-backdrop ${sidebarOpen ? "visible" : ""}`}
        type="button"
        aria-label="Close menu"
        onClick={() => setSidebarOpen(false)}
      />
    </div>
  );
}
