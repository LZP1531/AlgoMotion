import { AnimatePresence, motion } from "framer-motion";
import type { AnimationSceneProps } from "../../shared/AnimationSceneProps";
import { verticalCurvePath } from "../../shared/curvePath";
import styles from "./PermutationsScene.module.css";

const nums = [1, 2, 3];
const totalResults = 6;

const treeNodes = [
  { id: "root", label: "[]", x: 50, y: 7 },
  { id: "1", label: "1", x: 18, y: 23 },
  { id: "1-2", label: "1,2", x: 9, y: 41 },
  { id: "1-2-3", label: "1,2,3", x: 7, y: 61 },
  { id: "1-3", label: "1,3", x: 27, y: 41 },
  { id: "1-3-2", label: "1,3,2", x: 29, y: 61 },
  { id: "2", label: "2", x: 50, y: 23 },
  { id: "2-1", label: "2,1", x: 41, y: 41 },
  { id: "2-1-3", label: "2,1,3", x: 39, y: 61 },
  { id: "2-3", label: "2,3", x: 59, y: 41 },
  { id: "2-3-1", label: "2,3,1", x: 61, y: 61 },
  { id: "3", label: "3", x: 82, y: 23 },
  { id: "3-1", label: "3,1", x: 73, y: 41 },
  { id: "3-1-2", label: "3,1,2", x: 71, y: 61 },
  { id: "3-2", label: "3,2", x: 91, y: 41 },
  { id: "3-2-1", label: "3,2,1", x: 93, y: 61 },
];

const treeEdges = [
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

function getNode(id: string) {
  return treeNodes.find((node) => node.id === id)!;
}

function formatArray(value: number[]) {
  return `[${value.join(",")}]`;
}

export function PermutationsScene({ step, language }: AnimationSceneProps) {
  const isZh = language === "zh";
  const used = step.used ?? [false, false, false];
  const path = step.path ?? [];
  const results = step.results ?? [];
  const visitedNodes = new Set(step.visitedNodes ?? []);
  const action = step.action ?? "choose";
  const isDone = action === "done";
  const activeValue = action === "undo" ? step.removed : step.choice;
  const latestResult = results[results.length - 1] ?? path;
  const progress = Math.round((results.length / totalResults) * 100);
  const activeDepth = Math.min(path.length, nums.length);

  const actionLabel = (() => {
    if (action === "choose") return isZh ? `选择 ${activeValue}` : `Choose ${activeValue}`;
    if (action === "record") return isZh ? `记录 ${formatArray(latestResult)}` : `Record ${formatArray(latestResult)}`;
    if (action === "undo") return isZh ? `撤销 ${activeValue}` : `Undo ${activeValue}`;
    return isZh ? "全部完成" : "All done";
  })();

  const actionHint = (() => {
    if (action === "choose") {
      return isZh
        ? `把 ${activeValue} 放进 path，并把对应 used 标记为 true。下一层仍然从 i=0 扫描，但会跳过已使用的数字。`
        : `Put ${activeValue} into path and mark its used flag true. The next level scans from i=0 again, skipping used numbers.`;
    }

    if (action === "record") {
      return isZh
        ? `path 长度已经等于 nums.length，当前排列完整，复制一份加入 res。`
        : `The path length equals nums.length. Copy the complete permutation into res.`;
    }

    if (action === "undo") {
      return isZh
        ? `当前分支已经尝试完，弹出最后一次选择，并把 used 改回 false，回到上一层继续换选择。`
        : `This branch is done. Pop the last choice, reset used to false, and return to try the next option.`;
    }

    return isZh
      ? `所有分支都遍历完成，3 个不同数字共有 3! = 6 种排列。`
      : `Every branch has been explored. Three distinct numbers produce 3! = 6 permutations.`;
  })();

  const stackRows = [
    {
      id: "depth-0",
      depth: 0,
      label: "backtrack([])",
      active: path.length === 0 && action !== "done",
    },
    path.length >= 1
      ? {
          id: "depth-1",
          depth: 1,
          label: `backtrack(${formatArray(path.slice(0, 1))})`,
          active: path.length === 1 && action !== "done",
        }
      : null,
    path.length >= 2
      ? {
          id: "depth-2",
          depth: 2,
          label: `backtrack(${formatArray(path.slice(0, 2))})`,
          active: path.length === 2 && action !== "done",
        }
      : null,
    path.length >= 3 || action === "record"
      ? {
          id: "depth-3",
          depth: 3,
          label: `backtrack(${formatArray(path)})`,
          active: action === "record",
        }
      : null,
  ].filter(Boolean) as Array<{ id: string; depth: number; label: string; active: boolean }>;

  return (
    <div className={styles.scene}>
      <section className={styles.animationStage}>
        <div className={styles.stageHeader}>
          <div>
            <strong>{isZh ? "全排列" : "Permutations"}</strong>
          </div>

          <div className={[styles.actionBadge, styles[action]].filter(Boolean).join(" ")}>
            <span className={styles.actionDot} />
            {actionLabel}
          </div>
        </div>

        <div className={styles.flowBoard}>
          <div className={styles.candidatePanel}>
            <div className={styles.panelTitle}>
              <strong>{isZh ? "候选数字" : "Candidates"}</strong>
              <span>nums = [1,2,3]</span>
            </div>

            <div className={styles.numberGrid}>
              {nums.map((value, index) => {
                const isActive = activeValue === value || step.highlight.includes(index);
                const isUsed = used[index];

                return (
                  <motion.div
                    className={[
                      styles.numberCard,
                      isActive ? styles.activeNumberCard : "",
                      isUsed ? styles.usedNumberCard : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    key={value}
                    initial={false}
                    animate={{
                      y: isActive ? -4 : 0,
                      scale: isActive ? 1.03 : 1,
                    }}
                    transition={{ type: "spring", stiffness: 420, damping: 25 }}
                  >
                    <div className={styles.numberToken}>{value}</div>
                    <div className={styles.numberMeta}>
                      <strong>i = {index}</strong>
                      <span>{isUsed ? "used[i] = true" : "used[i] = false"}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className={styles.buildPanel}>
            <div className={styles.panelTitle}>
              <strong>{isZh ? "当前递归动作" : "Current recursive action"}</strong>
              <span>
                depth = {activeDepth} / {nums.length}
              </span>
            </div>

            <div className={styles.motionLayer}>
              <div className={styles.indexRail}>
                {nums.map((value, index) => (
                  <div
                    className={[
                      styles.indexStation,
                      step.highlight.includes(index) ? styles.activeStation : "",
                      used[index] ? styles.passedStation : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    key={`station-${value}`}
                  >
                    <span>i = {index}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>

              <div className={styles.candidateShelf}>
                <span className={styles.shelfLabel}>
                  {isDone
                    ? isZh
                      ? "所有候选数字都已完成搜索"
                      : "All candidates explored"
                    : isZh
                      ? "本层从 i=0 开始扫描，used=true 的数字会跳过"
                      : "Each level scans from i=0; numbers with used=true are skipped"}
                </span>

                <div className={styles.candidateNumbers}>
                  {isDone ? (
                    <motion.span
                      className={styles.doneCandidate}
                      initial={{ scale: 0.88, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 420, damping: 24 }}
                    >
                      {isZh ? "搜索结束" : "Search complete"}
                    </motion.span>
                  ) : (
                    nums.map((value, index) => {
                      const isActive = activeValue === value || step.highlight.includes(index);
                      const isUsed = used[index];

                      return (
                        <motion.span
                          className={[
                            styles.candidateNumber,
                            isActive ? styles.activeCandidateNumber : "",
                            isUsed ? styles.skippedCandidateNumber : "",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                          key={`candidate-${value}`}
                          initial={false}
                          animate={{
                            scale: isActive ? [1, 1.22, 1] : 1,
                            y: isActive ? [0, -8, 0] : 0,
                          }}
                          transition={{ duration: 0.62, ease: "easeInOut" }}
                        >
                          <strong>{value}</strong>
                          <small>{isUsed ? "skip" : "try"}</small>
                        </motion.span>
                      );
                    })
                  )}
                </div>
              </div>

              <div className={styles.pathBuilder}>
                <span className={styles.shelfLabel}>path</span>

                <div className={styles.pathSlots}>
                  {nums.map((_, index) => {
                    const value = path[index];
                    const isNewest = action !== "undo" && value === activeValue && index === path.length - 1;
                    const isUndoFocus = action === "undo" && index === path.length;

                    return (
                      <motion.div
                        className={[
                          styles.pathSlot,
                          value ? styles.filledPathSlot : "",
                          isNewest ? styles.newestPathSlot : "",
                          isUndoFocus ? styles.undoPathSlot : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        key={`path-${index}-${value ?? "empty"}`}
                        layout
                        initial={{ scale: value ? 0.75 : 1, opacity: value ? 0.35 : 1 }}
                        animate={{
                          scale: value ? 1 : 1,
                          opacity: 1,
                          y: isNewest ? [0, -7, 0] : 0,
                        }}
                        transition={{ type: "spring", stiffness: 430, damping: 25 }}
                      >
                        <span>{value ?? "_"}</span>
                        <small>{isZh ? `第 ${index + 1} 位` : `slot ${index + 1}`}</small>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              <AnimatePresence mode="popLayout">
                {action === "choose" && activeValue ? (
                  <motion.div
                    className={[styles.flyingToken, styles.flyingChoose].join(" ")}
                    key={`choose-${activeValue}-${path.join("-")}-${results.length}`}
                    initial={{
                      x: activeValue === 1 ? -138 : activeValue === 2 ? 0 : 138,
                      y: -62,
                      scale: 0.65,
                      opacity: 0,
                    }}
                    animate={{
                      x: path.length === 1 ? -86 : path.length === 2 ? 0 : 86,
                      y: 84,
                      scale: [0.65, 1.18, 0.92],
                      opacity: [0, 1, 1, 0],
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.92, ease: "easeInOut" }}
                  >
                    {activeValue}
                  </motion.div>
                ) : null}

                {action === "record" && latestResult.length > 0 ? (
                  <motion.div
                    className={[styles.flyingToken, styles.flyingRecord].join(" ")}
                    key={`record-${latestResult.join("-")}-${results.length}`}
                    initial={{ x: 0, y: 92, scale: 0.74, opacity: 0 }}
                    animate={{
                      x: 178,
                      y: 140,
                      scale: [0.74, 1.08, 0.82],
                      opacity: [0, 1, 1, 0],
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.05, ease: "easeInOut" }}
                  >
                    {formatArray(latestResult)}
                  </motion.div>
                ) : null}

                {action === "undo" && activeValue ? (
                  <motion.div
                    className={[styles.flyingToken, styles.flyingUndo].join(" ")}
                    key={`undo-${activeValue}-${path.join("-")}-${results.length}`}
                    initial={{
                      x: path.length === 0 ? -86 : path.length === 1 ? 0 : 86,
                      y: 84,
                      scale: 0.96,
                      rotate: 0,
                      opacity: 0,
                    }}
                    animate={{
                      x: [path.length === 0 ? -86 : path.length === 1 ? 0 : 86, -136],
                      y: [84, -74],
                      scale: [0.96, 0.9, 0.55],
                      rotate: [0, -10, 12, -20],
                      opacity: [0, 1, 1, 0],
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.98, ease: "easeInOut" }}
                  >
                    {activeValue}
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>

          <div className={styles.resultPanel}>
            <div className={styles.panelTitle}>
              <strong>res</strong>
              <span>
                {results.length} / {totalResults}
              </span>
            </div>

            <div className={styles.progressTrack}>
              <motion.div
                className={styles.progressFill}
                initial={false}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.48, ease: "easeOut" }}
              />
            </div>

            <div className={styles.resultGrid}>
              {Array.from({ length: totalResults }).map((_, index) => {
                const value = results[index];

                return (
                  <motion.div
                    className={[styles.resultSlot, value ? styles.filledResultSlot : ""].filter(Boolean).join(" ")}
                    key={`result-${index}-${value?.join("-") ?? "empty"}`}
                    layout
                    initial={value ? { scale: 0.76, opacity: 0, y: 12 } : false}
                    animate={value ? { scale: 1, opacity: 1, y: 0 } : { opacity: 1 }}
                    transition={{ type: "spring", stiffness: 430, damping: 27 }}
                  >
                    {value ? formatArray(value) : index + 1}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        <div className={styles.explainStrip}>
          <div className={styles.explainText}>
            <strong>{actionLabel}</strong>
            <span>{actionHint}</span>
          </div>

          <div className={styles.formulaCard}>
            <span>{isZh ? "排列数量" : "Permutations"}</span>
            <strong>3! = 6</strong>
          </div>
        </div>
      </section>

      <aside className={styles.sidePanel}>
        <div className={styles.codePanel}>
          <div className={styles.sideTitle}>
            <strong>{isZh ? "伪代码对应动作" : "Pseudocode action"}</strong>
            <span>{isZh ? "每一步都对应一行动画" : "Each step maps to a visual action"}</span>
          </div>

          <div className={styles.codeLines}>
            <div className={[styles.codeLine, action === "choose" ? styles.activeCodeLine : ""].join(" ")}>
              <span>1</span>
              <code>path.add(nums[i]); used[i] = true</code>
            </div>
            <div className={[styles.codeLine, action === "record" ? styles.activeCodeLine : ""].join(" ")}>
              <span>2</span>
              <code>res.add(copy(path))</code>
            </div>
            <div className={[styles.codeLine, action === "undo" ? styles.activeCodeLine : ""].join(" ")}>
              <span>3</span>
              <code>path.removeLast(); used[i] = false</code>
            </div>
          </div>
        </div>

        <div className={styles.stackPanel}>
          <div className={styles.sideTitle}>
            <strong>{isZh ? "递归调用栈" : "Recursive call stack"}</strong>
            <span>{isZh ? "越往下表示递归越深" : "Lower rows mean deeper recursion"}</span>
          </div>

          <div className={styles.stackList}>
            {stackRows.map((row) => (
              <motion.div
                className={[styles.stackFrame, row.active ? styles.activeStackFrame : ""].filter(Boolean).join(" ")}
                key={row.id}
                layout
                initial={{ x: -12, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 380, damping: 26 }}
                style={{ marginLeft: row.depth * 12 }}
              >
                <span>depth {row.depth}</span>
                <code>{row.label}</code>
              </motion.div>
            ))}

            {action === "done" ? (
              <motion.div
                className={[styles.stackFrame, styles.activeStackFrame].join(" ")}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 420, damping: 24 }}
              >
                <span>return</span>
                <code>{isZh ? "返回完整结果集" : "return all results"}</code>
              </motion.div>
            ) : null}
          </div>
        </div>

        <div className={styles.treePanel}>
          <div className={styles.sideTitle}>
            <strong>{isZh ? "搜索树辅助视图" : "Search tree helper"}</strong>
          </div>

          <svg viewBox="0 0 100 74" role="img" aria-label="Permutation search tree">
            <defs>
              <filter id="permutations-rich-glow" x="-70%" y="-70%" width="240%" height="240%">
                <feGaussianBlur stdDeviation="2.2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {treeEdges.map((edge) => {
              const from = getNode(edge.from);
              const to = getNode(edge.to);
              const isActive = step.activeEdge === edge.id;
              const isVisited = visitedNodes.has(edge.to);

              return (
                <motion.path
                  className={[
                    styles.treeEdge,
                    isVisited ? styles.visitedTreeEdge : "",
                    isActive ? styles.activeTreeEdge : "",
                    action === "undo" && isActive ? styles.undoTreeEdge : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  d={verticalCurvePath(from, to, 5.2)}
                  initial={false}
                  key={edge.id}
                  animate={{
                    pathLength: isVisited || isActive ? 1 : 0.08,
                    opacity: isVisited || isActive ? 1 : 0.16,
                  }}
                  transition={{ duration: 0.62, ease: "easeInOut" }}
                />
              );
            })}

            {step.activeEdge
              ? treeEdges
                  .filter((edge) => edge.id === step.activeEdge)
                  .map((edge) => {
                    const from = getNode(edge.from);
                    const to = getNode(edge.to);

                    return (
                      <motion.circle
                        className={styles.treeTravelDot}
                        key={`travel-${edge.id}-${action}-${step.activeNode}`}
                        r="1.55"
                        initial={{ cx: from.x, cy: from.y + 5.2, opacity: 0 }}
                        animate={{
                          cx: [from.x, to.x],
                          cy: [from.y + 5.2, to.y - 5.2],
                          opacity: [0, 1, 1, 0],
                        }}
                        transition={{ duration: 0.72, ease: "easeInOut" }}
                      />
                    );
                  })
              : null}

            {treeNodes.map((node) => {
              const isActive = step.activeNode === node.id;
              const isVisited = visitedNodes.has(node.id);

              return (
                <motion.g
                  key={node.id}
                  initial={false}
                  animate={{
                    scale: isActive ? 1.15 : isVisited ? 1 : 0.88,
                    opacity: isVisited || isActive ? 1 : 0.28,
                    y: isActive ? [0, -0.4, 0] : 0,
                  }}
                  style={{ transformOrigin: `${node.x}% ${node.y}%` }}
                  transition={{ type: "spring", stiffness: 390, damping: 24 }}
                >
                  <motion.circle
                    className={[
                      styles.treeNodeHalo,
                      isVisited ? styles.visitedTreeNode : "",
                      isActive ? styles.activeTreeNode : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    cx={node.x}
                    cy={node.y}
                    r="6.8"
                    animate={{ opacity: isActive ? [0.25, 0.72, 0.25] : isVisited ? 0.24 : 0 }}
                    transition={{
                      duration: 1.45,
                      repeat: isActive ? Infinity : 0,
                      ease: "easeInOut",
                    }}
                  />
                  <circle
                    className={[
                      styles.treeNodeCore,
                      isVisited ? styles.visitedTreeNode : "",
                      isActive ? styles.activeTreeNode : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    cx={node.x}
                    cy={node.y}
                    r="5.25"
                  />
                  <text x={node.x} y={node.y + 1.35}>
                    {node.label}
                  </text>
                </motion.g>
              );
            })}
          </svg>
        </div>
      </aside>
    </div>
  );
}
