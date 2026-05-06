import { motion } from "framer-motion";
import { Pause, Play, RotateCcw, Route, SkipBack, SkipForward } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { animationSteps } from "../../../data/problems";
import type { AnimationStep, Language, Problem } from "../../../types/content";

interface VisualizerPanelProps {
  problem: Problem;
  language: Language;
}

const arrayValues = [2, 7, 11, 15];
const listValues = [1, 2, 3, 4];
const treeNodes = [
  { value: 1, x: 34, y: 32 },
  { value: 2, x: 62, y: 62 },
  { value: 3, x: 45, y: 82 },
];

const subsetTreeNodes = [
  { id: "root", label: "[]", x: 50, y: 9 },
  { id: "1", label: "[1]", x: 24, y: 27 },
  { id: "1-2", label: "[1,2]", x: 14, y: 47 },
  { id: "1-2-3", label: "[1,2,3]", x: 10, y: 70 },
  { id: "1-3", label: "[1,3]", x: 34, y: 70 },
  { id: "2", label: "[2]", x: 60, y: 47 },
  { id: "2-3", label: "[2,3]", x: 58, y: 70 },
  { id: "3", label: "[3]", x: 82, y: 70 },
];

const subsetTreeEdges = [
  { id: "root-1", from: "root", to: "1" },
  { id: "1-1-2", from: "1", to: "1-2" },
  { id: "1-2-1-2-3", from: "1-2", to: "1-2-3" },
  { id: "1-1-3", from: "1", to: "1-3" },
  { id: "root-2", from: "root", to: "2" },
  { id: "2-2-3", from: "2", to: "2-3" },
  { id: "root-3", from: "root", to: "3" },
];

function subsetCurvePath(from: (typeof subsetTreeNodes)[number], to: (typeof subsetTreeNodes)[number]) {
  const midY = (from.y + to.y) / 2;
  return `M ${from.x} ${from.y + 6} C ${from.x} ${midY} ${to.x} ${midY} ${to.x} ${to.y - 6}`;
}

const permutationTreeNodes = [
  { id: "root", label: "[]", x: 50, y: 7 },
  { id: "1", label: "1", x: 18, y: 22 },
  { id: "1-2", label: "1,2", x: 10, y: 39 },
  { id: "1-2-3", label: "1,2,3", x: 7, y: 58 },
  { id: "1-3", label: "1,3", x: 26, y: 39 },
  { id: "1-3-2", label: "1,3,2", x: 28, y: 58 },
  { id: "2", label: "2", x: 50, y: 22 },
  { id: "2-1", label: "2,1", x: 42, y: 39 },
  { id: "2-1-3", label: "2,1,3", x: 40, y: 58 },
  { id: "2-3", label: "2,3", x: 58, y: 39 },
  { id: "2-3-1", label: "2,3,1", x: 60, y: 58 },
  { id: "3", label: "3", x: 82, y: 22 },
  { id: "3-1", label: "3,1", x: 74, y: 39 },
  { id: "3-1-2", label: "3,1,2", x: 72, y: 58 },
  { id: "3-2", label: "3,2", x: 90, y: 39 },
  { id: "3-2-1", label: "3,2,1", x: 93, y: 58 },
];

const permutationTreeEdges = [
  { id: "root-1", from: "root", to: "1" },
  { id: "1-1-2", from: "1", to: "1-2" },
  { id: "1-2-1-2-3", from: "1-2", to: "1-2-3" },
  { id: "1-1-3", from: "1", to: "1-3" },
  { id: "1-3-1-3-2", from: "1-3", to: "1-3-2" },
  { id: "root-2", from: "root", to: "2" },
  { id: "2-2-1", from: "2", to: "2-1" },
  { id: "2-1-2-1-3", from: "2-1", to: "2-1-3" },
  { id: "2-2-3", from: "2", to: "2-3" },
  { id: "2-3-2-3-1", from: "2-3", to: "2-3-1" },
  { id: "root-3", from: "root", to: "3" },
  { id: "3-3-1", from: "3", to: "3-1" },
  { id: "3-1-3-1-2", from: "3-1", to: "3-1-2" },
  { id: "3-3-2", from: "3", to: "3-2" },
  { id: "3-2-3-2-1", from: "3-2", to: "3-2-1" },
];

function permutationCurvePath(
  from: (typeof permutationTreeNodes)[number],
  to: (typeof permutationTreeNodes)[number],
) {
  const startY = from.y + 4.9;
  const endY = to.y - 4.9;
  const controlY = (startY + endY) / 2;
  return `M ${from.x} ${startY} C ${from.x} ${controlY} ${to.x} ${controlY} ${to.x} ${endY}`;
}

export function VisualizerPanel({ problem, language }: VisualizerPanelProps) {
  const steps = animationSteps[problem.animationKey] ?? animationSteps["two-sum"];
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const step = steps[stepIndex];

  useEffect(() => {
    setStepIndex(0);
    setIsPlaying(false);
  }, [problem.animationKey]);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => {
      setStepIndex((current) => {
        if (current === steps.length - 1) {
          setIsPlaying(false);
          return current;
        }
        return current + 1;
      });
    }, problem.animationKey === "subsets" ? 1350 : 1500);
    return () => window.clearInterval(timer);
  }, [isPlaying, problem.animationKey, steps.length]);

  const progress = useMemo(() => ((stepIndex + 1) / steps.length) * 100, [stepIndex, steps.length]);

  return (
    <section className="visualizer-panel">
      <div className="panel-header">
        <span>
          <Route size={17} />
          {language === "zh" ? "动态图解" : "Animation"}
        </span>
        <strong>
          {stepIndex + 1}/{steps.length}
        </strong>
      </div>

      <div className="visual-stage">
        <motion.div
          className={`visual-scene ${problem.animationKey === "subsets" ? "subsets-visual-scene" : ""} ${
            problem.animationKey === "permutations" ? "permutation-visual-scene" : ""
          }`}
          layout
        >
          {problem.animationKey === "reverse-list" && <ListScene active={step.highlight} pointer={step.pointer} />}
          {problem.animationKey === "inorder-tree" && <TreeScene active={step.highlight} />}
          {problem.animationKey === "subsets" && <SubsetsScene step={step} language={language} />}
          {problem.animationKey === "permutations" && <PermutationScene step={step} language={language} />}
          {problem.animationKey === "two-sum" && (
            <ArrayScene active={step.highlight} pointer={step.pointer} target={step.target} />
          )}
        </motion.div>
      </div>

      <div className="step-copy">
        <h2>{language === "zh" ? step.titleZh : step.titleEn}</h2>
        <p>{language === "zh" ? step.noteZh : step.noteEn}</p>
      </div>

      <div className="progress-track" aria-label="Animation progress">
        <span style={{ width: `${progress}%` }} />
      </div>

      <div className="player-controls">
        <button type="button" onClick={() => setStepIndex(0)} aria-label="Reset">
          <RotateCcw size={17} />
        </button>
        <button type="button" onClick={() => setStepIndex(Math.max(0, stepIndex - 1))} aria-label="Previous step">
          <SkipBack size={17} />
        </button>
        <button className="play-button" type="button" onClick={() => setIsPlaying((value) => !value)} aria-label="Play or pause">
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <button
          type="button"
          onClick={() => setStepIndex(Math.min(steps.length - 1, stepIndex + 1))}
          aria-label="Next step"
        >
          <SkipForward size={17} />
        </button>
      </div>
    </section>
  );
}

function ArrayScene({ active, pointer, target }: { active: number[]; pointer?: number; target?: number }) {
  return (
    <div className="array-scene">
      {arrayValues.map((value, index) => (
        <motion.div
          layout
          key={value}
          className={`array-cell ${active.includes(index) ? "active" : ""} ${pointer === index ? "pointer" : ""}`}
        >
          <span>{value}</span>
          <small>i={index}</small>
          {target === index && <em>need</em>}
        </motion.div>
      ))}
    </div>
  );
}

function ListScene({ active, pointer }: { active: number[]; pointer?: number }) {
  const visibleValues = pointer && pointer > 1 ? [...listValues].reverse() : listValues;

  return (
    <div className="list-scene">
      {visibleValues.map((value, index) => (
        <div className="node-wrap" key={`${value}-${index}`}>
          <motion.div className={`list-node ${active.includes(index) ? "active" : ""}`} layout>
            {value}
          </motion.div>
          {index < visibleValues.length - 1 && <span className={pointer && pointer > 1 ? "arrow reversed" : "arrow"} />}
        </div>
      ))}
    </div>
  );
}

function TreeScene({ active }: { active: number[] }) {
  return (
    <div className="tree-scene">
      <svg viewBox="0 0 100 100" role="img" aria-label="Binary tree">
        <line x1="34" y1="32" x2="62" y2="62" />
        <line x1="62" y1="62" x2="45" y2="82" />
        {treeNodes.map((node, index) => (
          <g key={node.value}>
            <circle className={active.includes(index) ? "active" : ""} cx={node.x} cy={node.y} r="8" />
            <text x={node.x} y={node.y + 1.8}>
              {node.value}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function SubsetsScene({ step, language }: { step: AnimationStep; language: Language }) {
  const visitedNodes = new Set(step.visitedNodes ?? []);
  const path = step.path ?? [];
  const results = step.results ?? [];

  function getNode(id: string) {
    return subsetTreeNodes.find((node) => node.id === id)!;
  }

  return (
    <div className="subsets-scene">
      <div className="subsets-tree">
        <svg viewBox="0 0 100 86" role="img" aria-label="Subsets backtracking tree">
          <defs>
            <filter id="subset-node-glow" x="-70%" y="-70%" width="240%" height="240%">
              <feGaussianBlur stdDeviation="2.6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {subsetTreeEdges.map((edge) => {
            const from = getNode(edge.from);
            const to = getNode(edge.to);
            const isActive = step.activeEdge === edge.id;
            const isVisited = visitedNodes.has(edge.to);

            return (
              <motion.path
                key={edge.id}
                d={subsetCurvePath(from, to)}
                className={`${isVisited ? "visited" : ""} ${isActive ? "active" : ""}`}
                initial={false}
                animate={{ pathLength: isVisited || isActive ? 1 : 0.14, opacity: isVisited || isActive ? 1 : 0.24 }}
                transition={{ duration: 0.68, ease: "easeInOut" }}
              />
            );
          })}
          {step.activeEdge &&
            subsetTreeEdges
              .filter((edge) => edge.id === step.activeEdge)
              .map((edge) => {
                const from = getNode(edge.from);
                const to = getNode(edge.to);

                return (
                  <motion.circle
                    className="subset-travel-dot"
                    key={`dot-${edge.id}-${step.activeNode}`}
                    r="1.7"
                    initial={{ cx: from.x, cy: from.y + 6, opacity: 0 }}
                    animate={{ cx: [from.x, to.x], cy: [from.y + 6, to.y - 6], opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 0.78, ease: "easeInOut" }}
                  />
                );
              })}
          {subsetTreeNodes.map((node) => {
            const isActive = step.activeNode === node.id;
            const isVisited = visitedNodes.has(node.id);

            return (
              <motion.g
                key={node.id}
                initial={false}
                animate={{
                  scale: isActive ? 1.12 : isVisited ? 1 : 0.92,
                  opacity: isVisited ? 1 : 0.34,
                  x: isActive ? [0, 0.2, -0.2, 0] : 0,
                  y: isActive ? [0, -0.35, 0.15, 0] : 0,
                }}
                style={{ transformOrigin: `${node.x}% ${node.y}%` }}
                transition={{ type: "spring", stiffness: 360, damping: 23 }}
              >
                <motion.circle
                  className={`subset-node-halo ${isVisited ? "visited" : ""} ${isActive ? "active" : ""}`}
                  cx={node.x}
                  cy={node.y}
                  r="8.4"
                  animate={{ opacity: isActive ? [0.36, 0.75, 0.36] : isVisited ? 0.28 : 0 }}
                  transition={{ duration: 1.45, repeat: isActive ? Infinity : 0, ease: "easeInOut" }}
                />
                <circle
                  className={`subset-node-core ${isVisited ? "visited" : ""} ${isActive ? "active" : ""}`}
                  cx={node.x}
                  cy={node.y}
                  r="6.6"
                />
                <text x={node.x} y={node.y + 1.5}>
                  {node.label}
                </text>
              </motion.g>
            );
          })}
        </svg>
      </div>

      <div className="subsets-state">
        <div className={`action-pill ${step.action ?? ""}`}>
          {step.action === "choose" && (language === "zh" ? `选择 ${step.choice}` : `Choose ${step.choice}`)}
          {step.action === "undo" && (language === "zh" ? `撤销 ${step.removed}` : `Undo ${step.removed}`)}
          {step.action === "record" && (language === "zh" ? "记录当前 path" : "Record current path")}
          {step.action === "done" && (language === "zh" ? "完成" : "Done")}
        </div>

        <div className="path-lane">
          <strong>path</strong>
          <div className="path-values">
            {path.length === 0 ? (
              <motion.span className="empty-token" layout>
                []
              </motion.span>
            ) : (
              path.map((value, index) => (
                <motion.span
                  key={`${value}-${index}-${path.join("-")}`}
                  layout
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                >
                  {value}
                </motion.span>
              ))
            )}
          </div>
        </div>

        <div className="result-board">
          <strong>
            res <em>{results.length}/8</em>
          </strong>
          <div className="result-chips">
            {results.map((item, index) => (
              <motion.span
                key={`${item.join("-") || "empty"}-${index}`}
                layout
                initial={{ scale: 0.82, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 420, damping: 26 }}
              >
                [{item.join(",")}]
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PermutationScene({ step, language }: { step: AnimationStep; language: Language }) {
  const nums = [1, 2, 3];
  const used = step.used ?? [false, false, false];
  const path = step.path ?? [];
  const results = step.results ?? [];
  const visitedNodes = new Set(step.visitedNodes ?? []);

  function getNode(id: string) {
    return permutationTreeNodes.find((node) => node.id === id)!;
  }

  return (
    <div className="permutation-scene">
      <div className="permutation-main">
        <div className="perm-candidates">
          {nums.map((value, index) => (
            <motion.div
              key={value}
              className={`perm-number ${used[index] ? "used" : ""} ${step.highlight.includes(index) ? "active" : ""}`}
              layout
            >
              <strong>{value}</strong>
              <span>{used[index] ? "used" : `i=${index}`}</span>
            </motion.div>
          ))}
        </div>

        <div className="perm-tree">
          <svg viewBox="0 0 100 68" role="img" aria-label="Permutation recursion tree">
            <defs>
              <filter id="perm-node-glow" x="-70%" y="-70%" width="240%" height="240%">
                <feGaussianBlur stdDeviation="1.9" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {permutationTreeEdges.map((edge) => {
              const from = getNode(edge.from);
              const to = getNode(edge.to);
              const isActive = step.activeEdge === edge.id;
              const isVisited = visitedNodes.has(edge.to);

              return (
                <motion.path
                  key={edge.id}
                  d={permutationCurvePath(from, to)}
                  className={`${isVisited ? "visited" : ""} ${isActive ? "active" : ""}`}
                  initial={false}
                  animate={{ pathLength: isVisited || isActive ? 1 : 0.12, opacity: isVisited || isActive ? 1 : 0.2 }}
                  transition={{ duration: 0.62, ease: "easeInOut" }}
                />
              );
            })}
            {step.activeEdge &&
              permutationTreeEdges
                .filter((edge) => edge.id === step.activeEdge)
                .map((edge) => {
                  const from = getNode(edge.from);
                  const to = getNode(edge.to);

                  return (
                    <motion.circle
                      className="perm-travel-dot"
                      key={`perm-dot-${edge.id}-${step.activeNode}`}
                      r="1.25"
                      initial={{ cx: from.x, cy: from.y + 4.9, opacity: 0 }}
                      animate={{ cx: [from.x, to.x], cy: [from.y + 4.9, to.y - 4.9], opacity: [0, 1, 1, 0] }}
                      transition={{ duration: 0.7, ease: "easeInOut" }}
                    />
                  );
                })}
            {permutationTreeNodes.map((node) => {
              const isActive = step.activeNode === node.id;
              const isVisited = visitedNodes.has(node.id);

              return (
                <motion.g
                  key={node.id}
                  initial={false}
                  animate={{
                    scale: isActive ? 1.12 : isVisited ? 1 : 0.9,
                    opacity: isVisited ? 1 : 0.34,
                    y: isActive ? [0, -0.25, 0.1, 0] : 0,
                  }}
                  style={{ transformOrigin: `${node.x}% ${node.y}%` }}
                  transition={{ type: "spring", stiffness: 360, damping: 23 }}
                >
                  <motion.circle
                    className={`perm-node-halo ${isVisited ? "visited" : ""} ${isActive ? "active" : ""}`}
                    cx={node.x}
                    cy={node.y}
                    r="6.2"
                    animate={{ opacity: isActive ? [0.32, 0.72, 0.32] : isVisited ? 0.22 : 0 }}
                    transition={{ duration: 1.45, repeat: isActive ? Infinity : 0, ease: "easeInOut" }}
                  />
                  <circle
                    className={`perm-node-core ${isVisited ? "visited" : ""} ${isActive ? "active" : ""}`}
                    cx={node.x}
                    cy={node.y}
                    r="4.8"
                  />
                  <text x={node.x} y={node.y + 1.2}>
                    {node.label}
                  </text>
                </motion.g>
              );
            })}
          </svg>
        </div>
      </div>

      <div className="subsets-state permutation-state">
        <div className={`action-pill ${step.action ?? ""}`}>
          {step.action === "choose" && (language === "zh" ? `选择 ${step.choice}` : `Choose ${step.choice}`)}
          {step.action === "undo" && (language === "zh" ? `撤销 ${step.removed}` : `Undo ${step.removed}`)}
          {step.action === "record" && (language === "zh" ? "记录完整排列" : "Record permutation")}
          {step.action === "done" && (language === "zh" ? "完成" : "Done")}
        </div>

        <div className="path-lane">
          <strong>path</strong>
          <div className="perm-slots">
            {[0, 1, 2].map((slot) => (
              <motion.span key={`${slot}-${path[slot] ?? "empty"}`} className={path[slot] ? "filled" : ""} layout>
                {path[slot] ?? "_"}
              </motion.span>
            ))}
          </div>
        </div>

        <div className="used-board">
          <strong>used[]</strong>
          <div>
            {used.map((item, index) => (
              <span key={index} className={item ? "true" : ""}>
                {item ? "T" : "F"}
              </span>
            ))}
          </div>
        </div>

        <div className="result-board">
          <strong>
            res <em>{results.length}/6</em>
          </strong>
          <div className="result-chips">
            {results.map((item, index) => (
              <motion.span
                key={`${item.join("-")}-${index}`}
                layout
                initial={{ scale: 0.82, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 420, damping: 26 }}
              >
                [{item.join(",")}]
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
