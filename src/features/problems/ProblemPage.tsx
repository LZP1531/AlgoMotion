import { ArrowLeft, Check, Clipboard, Code2, FileText, Maximize2, Minimize2, Tag } from "lucide-react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { Link, useOutletContext, useParams } from "react-router-dom";
import { type PointerEvent, type ReactNode, useEffect, useRef, useState } from "react";
import { problems } from "../../data/problems";
import type { Language } from "../../types/content";
import { getDifficultyLabel } from "../../utils/difficulty";
import { VisualizerPanel } from "./animations/VisualizerPanel";

interface OutletContext {
  language: Language;
}

function extractText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (node && typeof node === "object" && "props" in node) {
    return extractText((node as { props?: { children?: ReactNode } }).props?.children);
  }
  return "";
}

function CodeBlock({ children, language }: { children?: ReactNode; language: Language }) {
  const [copied, setCopied] = useState(false);
  const code = extractText(children).replace(/\n$/, "");

  async function copyCode() {
    if (!navigator.clipboard) return;
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <div className="code-block-wrap">
      <button
        className="code-copy-button"
        type="button"
        onClick={copyCode}
        aria-label={language === "zh" ? "复制代码" : "Copy code"}
      >
        {copied ? <Check size={15} /> : <Clipboard size={15} />}
        <span>
          {copied
            ? language === "zh"
              ? "已复制"
              : "Copied"
            : language === "zh"
              ? "复制"
              : "Copy"}
        </span>
      </button>
      <pre>{children}</pre>
    </div>
  );
}

function StatementIntro({
  problem,
  language,
}: {
  problem: NonNullable<(typeof problems)[number]>;
  language: Language;
}) {
  return (
    <header className="statement-intro">
      <h1>
        {problem.id}. {language === "zh" ? problem.titleZh : problem.titleEn}
      </h1>
      <div className="statement-meta">
        <span className={`difficulty ${problem.difficulty}`}>
          {getDifficultyLabel(problem.difficulty, language)}
        </span>
        {problem.tags.map((tag) => (
          <span className="statement-tag" key={tag}>
            <Tag size={15} />
            {tag}
          </span>
        ))}
      </div>
    </header>
  );
}

export function ProblemPage() {
  const { language } = useOutletContext<OutletContext>();
  const { slug } = useParams();
  const [activeTab, setActiveTab] = useState<"statement" | "solution">("statement");
  const [visualWidth, setVisualWidth] = useState(62);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const studyGridRef = useRef<HTMLDivElement>(null);
  const problem = problems.find((item) => item.slug === slug);

  useEffect(() => {
    setActiveTab("statement");
    setIsFocusMode(false);
    setVisualWidth(62);
  }, [slug]);

  function startResize(event: PointerEvent<HTMLButtonElement>) {
    event.preventDefault();
    setIsFocusMode(false);

    const grid = studyGridRef.current;
    if (!grid) return;

    const bounds = grid.getBoundingClientRect();

    function handlePointerMove(moveEvent: globalThis.PointerEvent) {
      const nextWidth = ((moveEvent.clientX - bounds.left) / bounds.width) * 100;
      setVisualWidth(Math.min(Math.max(nextWidth, 46), 78));
    }

    function stopResize() {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", stopResize);
      document.body.classList.remove("is-resizing-study-grid");
    }

    document.body.classList.add("is-resizing-study-grid");
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", stopResize, { once: true });
  }

  if (!problem) {
    return (
      <section className="empty-state full">
        <h1>{language === "zh" ? "没有找到这道题" : "Problem not found"}</h1>
        <Link className="inline-link" to="/">
          <ArrowLeft size={16} />
          {language === "zh" ? "返回首页" : "Back home"}
        </Link>
      </section>
    );
  }

  return (
    <section className="problem-page">
      <div
        className={`study-grid ${isFocusMode ? "focus-visual" : ""}`}
        ref={studyGridRef}
        style={{
          gridTemplateColumns: isFocusMode ? "minmax(0, 1fr) 8px 56px" : `minmax(480px, ${visualWidth}%) 8px minmax(300px, 1fr)`,
        }}
      >
        <VisualizerPanel problem={problem} language={language} />
        <button
          className="study-resizer"
          type="button"
          onPointerDown={startResize}
          aria-label={language === "zh" ? "拖动调整动态图和题解宽度" : "Resize animation and explanation panels"}
          title=""
        >
          <span />
        </button>
        <article className="markdown-panel">
          <div className="panel-header">
            <span>
              {activeTab === "statement" ? <FileText size={18} /> : <Code2 size={18} />}
              {activeTab === "statement"
                ? language === "zh"
                  ? "题目描述"
                  : "Statement"
                : language === "zh"
                  ? "代码答案"
                  : "Solution code"}
            </span>
            <div className="panel-header-actions">
              <div className="content-tabs" role="tablist" aria-label="Problem content">
                <button
                  className={activeTab === "statement" ? "active" : ""}
                  type="button"
                  onClick={() => setActiveTab("statement")}
                >
                  {language === "zh" ? "题目描述" : "Statement"}
                </button>
                <button
                  className={activeTab === "solution" ? "active" : ""}
                  type="button"
                  onClick={() => setActiveTab("solution")}
                >
                  {language === "zh" ? "代码答案" : "Solution"}
                </button>
              </div>
              <button
                className="icon-button panel-focus-button"
                type="button"
                onClick={() => setIsFocusMode((value) => !value)}
                aria-label={isFocusMode ? (language === "zh" ? "恢复分栏" : "Restore split view") : language === "zh" ? "专注图解" : "Focus animation"}
              >
                {isFocusMode ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
            </div>
          </div>
          <div className="markdown-body">
            {activeTab === "statement" ? (
              <StatementIntro problem={problem} language={language} />
            ) : null}
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                pre: ({ children }) => <CodeBlock language={language}>{children}</CodeBlock>,
              }}
            >
              {activeTab === "statement" ? problem.statementMarkdown : problem.solutionMarkdown}
            </ReactMarkdown>
          </div>
        </article>
      </div>
    </section>
  );
}
