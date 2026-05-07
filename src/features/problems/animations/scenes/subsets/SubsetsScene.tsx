import { motion } from "framer-motion";
import type { AnimationSceneProps } from "../../shared/AnimationSceneProps";
import { verticalCurvePath } from "../../shared/curvePath";
import styles from "./SubsetsScene.module.css";

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

export function SubsetsScene({ step, language }: AnimationSceneProps) {
  const visitedNodes = new Set(step.visitedNodes ?? []);
  const path = step.path ?? [];
  const results = step.results ?? [];

  function getNode(id: string) {
    return subsetTreeNodes.find((node) => node.id === id)!;
  }

  function actionText() {
    if (step.action === "choose") return language === "zh" ? `选择 ${step.choice}` : `Choose ${step.choice}`;
    if (step.action === "undo") return language === "zh" ? `撤销 ${step.removed}` : `Undo ${step.removed}`;
    if (step.action === "record") return language === "zh" ? "记录当前 path" : "Record current path";
    if (step.action === "done") return language === "zh" ? "完成" : "Done";
    return "";
  }

  return (
    <div className={styles.scene}>
      <div className={styles.treePanel}>
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
                d={verticalCurvePath(from, to, 6)}
                className={[isVisited ? styles.visited : "", isActive ? styles.active : ""].filter(Boolean).join(" ")}
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
                    className={styles.travelDot}
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
                  className={[styles.nodeHalo, isVisited ? styles.visited : "", isActive ? styles.active : ""]
                    .filter(Boolean)
                    .join(" ")}
                  cx={node.x}
                  cy={node.y}
                  r="8.4"
                  animate={{ opacity: isActive ? [0.36, 0.75, 0.36] : isVisited ? 0.28 : 0 }}
                  transition={{ duration: 1.45, repeat: isActive ? Infinity : 0, ease: "easeInOut" }}
                />
                <circle
                  className={[styles.nodeCore, isVisited ? styles.visited : "", isActive ? styles.active : ""]
                    .filter(Boolean)
                    .join(" ")}
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

      <div className={styles.statePanel}>
        <div className={[styles.actionPill, step.action ? styles[step.action] : ""].filter(Boolean).join(" ")}>
          {actionText()}
        </div>

        <div className={styles.pathLane}>
          <strong>path</strong>
          <div className={styles.pathValues}>
            {path.length === 0 ? (
              <motion.span className={styles.emptyToken} layout>
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

        <div className={styles.resultBoard}>
          <strong>
            res <em>{results.length}/8</em>
          </strong>
          <div className={styles.resultChips}>
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

