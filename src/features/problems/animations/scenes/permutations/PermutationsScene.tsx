import { motion } from "framer-motion";
import type { AnimationSceneProps } from "../../shared/AnimationSceneProps";
import { verticalCurvePath } from "../../shared/curvePath";
import styles from "./PermutationsScene.module.css";

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

export function PermutationsScene({ step, language }: AnimationSceneProps) {
  const nums = [1, 2, 3];
  const used = step.used ?? [false, false, false];
  const path = step.path ?? [];
  const results = step.results ?? [];
  const visitedNodes = new Set(step.visitedNodes ?? []);

  function getNode(id: string) {
    return permutationTreeNodes.find((node) => node.id === id)!;
  }

  function actionText() {
    if (step.action === "choose") return language === "zh" ? `选择 ${step.choice}` : `Choose ${step.choice}`;
    if (step.action === "undo") return language === "zh" ? `撤销 ${step.removed}` : `Undo ${step.removed}`;
    if (step.action === "record") return language === "zh" ? "记录完整排列" : "Record permutation";
    if (step.action === "done") return language === "zh" ? "完成" : "Done";
    return "";
  }

  return (
    <div className={styles.scene}>
      <div className={styles.mainArea}>
        <div className={styles.candidateNumbers}>
          {nums.map((value, index) => (
            <motion.div
              key={value}
              className={[
                styles.candidateNumber,
                used[index] ? styles.used : "",
                step.highlight.includes(index) ? styles.activeCandidate : "",
              ]
                .filter(Boolean)
                .join(" ")}
              layout
            >
              <strong>{value}</strong>
              <span>{used[index] ? "used" : `i=${index}`}</span>
            </motion.div>
          ))}
        </div>

        <div className={styles.treePanel}>
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
                  d={verticalCurvePath(from, to, 4.9)}
                  className={[isVisited ? styles.visited : "", isActive ? styles.active : ""].filter(Boolean).join(" ")}
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
                      className={styles.travelDot}
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
                    className={[styles.nodeHalo, isVisited ? styles.visited : "", isActive ? styles.active : ""]
                      .filter(Boolean)
                      .join(" ")}
                    cx={node.x}
                    cy={node.y}
                    r="6.2"
                    animate={{ opacity: isActive ? [0.32, 0.72, 0.32] : isVisited ? 0.22 : 0 }}
                    transition={{ duration: 1.45, repeat: isActive ? Infinity : 0, ease: "easeInOut" }}
                  />
                  <circle
                    className={[styles.nodeCore, isVisited ? styles.visited : "", isActive ? styles.active : ""]
                      .filter(Boolean)
                      .join(" ")}
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

      <div className={styles.statePanel}>
        <div className={[styles.actionPill, step.action ? styles[step.action] : ""].filter(Boolean).join(" ")}>
          {actionText()}
        </div>

        <div className={styles.pathLane}>
          <strong>path</strong>
          <div className={styles.pathSlots}>
            {[0, 1, 2].map((slot) => (
              <motion.span
                key={`${slot}-${path[slot] ?? "empty"}`}
                className={path[slot] ? styles.filledPathSlot : ""}
                layout
              >
                {path[slot] ?? "_"}
              </motion.span>
            ))}
          </div>
        </div>

        <div className={styles.usedBoard}>
          <strong>used[]</strong>
          <div className={styles.usedValues}>
            {used.map((item, index) => (
              <span key={index} className={item ? styles.usedTrue : ""}>
                {item ? "T" : "F"}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.resultBoard}>
          <strong>
            res <em>{results.length}/6</em>
          </strong>
          <div className={styles.resultChips}>
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

