import { AnimatePresence, motion } from "framer-motion";
import type { AnimationSceneProps } from "../../shared/AnimationSceneProps";
import { verticalCurvePath } from "../../shared/curvePath";
import styles from "./PalindromePartitioningScene.module.css";

const source = "aab";
const chars = source.split("");
const totalResults = 2;

const treeNodes = [
  { id: "root", label: "[]", x: 50, y: 8 },
  { id: "a", label: "a", x: 30, y: 29 },
  { id: "a-a", label: "a|a", x: 20, y: 50 },
  { id: "a-a-b", label: "a|a|b", x: 20, y: 70 },
  { id: "aa", label: "aa", x: 70, y: 29 },
  { id: "aa-b", label: "aa|b", x: 70, y: 50 },
];

const treeEdges = [
  { id: "root-a", from: "root", to: "a" },
  { id: "a-a-a", from: "a", to: "a-a" },
  { id: "a-a-a-a-b", from: "a-a", to: "a-a-b" },
  { id: "root-aa", from: "root", to: "aa" },
  { id: "aa-aa-b", from: "aa", to: "aa-b" },
];

function getNode(id: string) {
  return treeNodes.find((node) => node.id === id)!;
}

function sameCell(a: [number, number] | undefined, b: [number, number]) {
  return Boolean(a && a[0] === b[0] && a[1] === b[1]);
}

function hasCell(cells: Array<[number, number]> | undefined, cell: [number, number]) {
  return Boolean(cells?.some((item) => item[0] === cell[0] && item[1] === cell[1]));
}

function formatPartition(value: string[]) {
  return `[${value.map((item) => `"${item}"`).join(",")}]`;
}

export function PalindromePartitioningScene({ step, language }: AnimationSceneProps) {
  const isZh = language === "zh";
  const path = step.stringPath ?? [];
  const results = step.stringResults ?? [];
  const phase = step.dpPhase ?? "search";
  const action = step.action ?? "choose";
  const activeRange = step.activeRange;
  const visitedNodes = new Set(step.visitedNodes ?? []);
  const latestResult = results[results.length - 1] ?? path;
  const progress = Math.round((results.length / totalResults) * 100);

  const actionLabel = (() => {
    if (phase === "prepare") return isZh ? "准备 DP 表" : "Prepare DP table";
    if (phase === "fill" && action === "record") return isZh ? `标记 ${step.activeSubstring}` : `Mark ${step.activeSubstring}`;
    if (phase === "fill" && action === "undo") return isZh ? `排除 ${step.activeSubstring}` : `Reject ${step.activeSubstring}`;
    if (action === "choose") return isZh ? `选择 ${step.activeSubstring ?? "候选"}` : `Choose ${step.activeSubstring ?? "candidate"}`;
    if (action === "record") return isZh ? `记录 ${formatPartition(latestResult)}` : `Record ${formatPartition(latestResult)}`;
    if (action === "undo") return isZh ? `跳过 ${step.activeSubstring ?? "候选"}` : `Skip ${step.activeSubstring ?? "candidate"}`;
    return isZh ? "全部完成" : "All done";
  })();

  const actionHint = (() => {
    if (phase === "prepare") {
      return isZh
        ? "先用 dp[i][j] 预处理每个区间是否为回文，后面的回溯只查表，不重复判断字符串。"
        : "Precompute whether each interval is a palindrome with dp[i][j], so backtracking only needs table lookups.";
    }

    if (phase === "fill" && action === "record") {
      return isZh
        ? `当前区间 ${step.activeSubstring} 是回文，dp[${activeRange?.[0]}][${activeRange?.[1]}] 置为 true。`
        : `The interval ${step.activeSubstring} is a palindrome, so dp[${activeRange?.[0]}][${activeRange?.[1]}] becomes true.`;
    }

    if (phase === "fill") {
      return isZh
        ? `当前区间 ${step.activeSubstring} 不是回文，dp 保持 false，搜索阶段不会进入这个分支。`
        : `The interval ${step.activeSubstring} is not a palindrome. dp stays false and this branch will be skipped.`;
    }

    if (action === "choose") {
      return isZh
        ? `查表确认 ${step.activeSubstring} 是回文，把它加入 path，然后从下一个下标继续切。`
        : `The table confirms ${step.activeSubstring} is a palindrome. Add it to path and continue from the next index.`;
    }

    if (action === "record") {
      return isZh
        ? "index 到达字符串末尾，path 中的每一段都来自 dp=true 的区间，复制 path 到结果集。"
        : "Index reaches the end. Every segment in path came from a true dp cell, so copy path into the result.";
    }

    if (action === "undo") {
      return isZh
        ? "候选区间不是回文，或者当前分支已完成，回退后继续尝试同层下一个切分点。"
        : "The candidate is not a palindrome or the branch is done. Backtrack and try the next split at the same level.";
    }

    return isZh
      ? "根节点的候选都尝试完，最终得到两种合法分割方案。"
      : "All root candidates have been tried, leaving two valid partition plans.";
  })();

  const stackRows = [
    {
      id: "depth-0",
      depth: 0,
      label: "backtrack(0, [])",
      active: (step.scanIndex ?? 0) === 0 && phase === "search" && action !== "done",
    },
    path.length >= 1
      ? {
          id: "depth-1",
          depth: 1,
          label: `backtrack(${path[0].length}, ${formatPartition(path.slice(0, 1))})`,
          active: path.length === 1 && action !== "done",
        }
      : null,
    path.length >= 2
      ? {
          id: "depth-2",
          depth: 2,
          label: `backtrack(${path.join("").length}, ${formatPartition(path.slice(0, 2))})`,
          active: path.length === 2 && action !== "done",
        }
      : null,
    path.length >= 3 || (action === "record" && path.length > 0)
      ? {
          id: "depth-3",
          depth: 3,
          label: `backtrack(${source.length}, ${formatPartition(path)})`,
          active: action === "record",
        }
      : null,
  ].filter(Boolean) as Array<{ id: string; depth: number; label: string; active: boolean }>;

  return (
    <div className={styles.scene}>
      <section className={styles.animationStage}>
        <div className={styles.stageHeader}>
          <div>
            <strong>{isZh ? "分割回文串" : "Palindrome partitioning"}</strong>
          </div>

          <div className={[styles.actionBadge, styles[action], styles[phase]].filter(Boolean).join(" ")}>
            <span className={styles.actionDot} />
            {actionLabel}
          </div>
        </div>

        <div className={styles.flowBoard}>
          <div className={styles.dpPanel}>
            <div className={styles.panelTitle}>
              <strong>{isZh ? "DP 回文表" : "Palindrome DP table"}</strong>
              <span>s = "aab"</span>
            </div>

            <div className={styles.dpGridWrap}>
              <div className={styles.stringRail}>
                {chars.map((char, index) => {
                  const inRange = Boolean(activeRange && index >= activeRange[0] && index <= activeRange[1]);
                  const isCutPoint = step.scanIndex === index;

                  return (
                    <motion.div
                      className={[styles.charCard, inRange ? styles.activeCharCard : "", isCutPoint ? styles.scanCharCard : ""]
                        .filter(Boolean)
                        .join(" ")}
                      key={`${char}-${index}`}
                      initial={false}
                      animate={{ y: inRange ? -4 : 0, scale: inRange ? 1.04 : 1 }}
                      transition={{ type: "spring", stiffness: 420, damping: 25 }}
                    >
                      <strong>{char}</strong>
                      <span>{index}</span>
                    </motion.div>
                  );
                })}
              </div>

              <div className={styles.dpMatrix} role="img" aria-label="Palindrome DP table">
                <span className={styles.cornerCell}>i\j</span>
                {chars.map((_, index) => (
                  <span className={styles.axisCell} key={`col-${index}`}>
                    {index}
                  </span>
                ))}
                {chars.flatMap((_, row) => [
                  <span className={styles.axisCell} key={`row-${row}`}>
                    {row}
                  </span>,
                  ...chars.map((__, col) => {
                    const cell: [number, number] = [row, col];
                    const impossible = col < row;
                    const isTrue = hasCell(step.dpTrueCells, cell);
                    const isActive = sameCell(step.dpActiveCell, cell);
                    const isRejected = sameCell(step.dpRejectedCell, cell);

                    return (
                      <motion.span
                        className={[
                          styles.dpCell,
                          impossible ? styles.impossibleCell : "",
                          isTrue ? styles.trueCell : "",
                          isActive ? styles.activeCell : "",
                          isRejected ? styles.rejectedCell : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        key={`cell-${row}-${col}`}
                        initial={false}
                        animate={{
                          scale: isActive || isRejected ? [1, 1.12, 1] : 1,
                        }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                      >
                        {impossible ? "" : isTrue ? "T" : isRejected ? "F" : "-"}
                      </motion.span>
                    );
                  }),
                ])}
              </div>
            </div>
          </div>

          <div className={styles.buildPanel}>
            <div className={styles.panelTitle}>
              <strong>{phase === "fill" ? (isZh ? "填表过程" : "DP fill process") : isZh ? "当前回溯动作" : "Current recursive action"}</strong>
              <span>
                index = {Math.min(step.scanIndex ?? 0, source.length)} / {source.length}
              </span>
            </div>

            <div className={styles.motionLayer}>
              <div className={styles.substringRail}>
                {[
                  { label: "a", range: [0, 0] as [number, number] },
                  { label: "aa", range: [0, 1] as [number, number] },
                  { label: "aab", range: [0, 2] as [number, number] },
                  { label: "a", range: [1, 1] as [number, number] },
                  { label: "ab", range: [1, 2] as [number, number] },
                  { label: "b", range: [2, 2] as [number, number] },
                ].map((item) => {
                  const isActive = sameCell(activeRange, item.range);
                  const isTrue = hasCell(step.dpTrueCells, item.range);
                  const isRejected = sameCell(step.dpRejectedCell, item.range);

                  return (
                    <motion.div
                      className={[
                        styles.substringCard,
                        isTrue ? styles.validSubstringCard : "",
                        isActive ? styles.activeSubstringCard : "",
                        isRejected ? styles.rejectedSubstringCard : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      key={`${item.label}-${item.range.join("-")}`}
                      initial={false}
                      animate={{ y: isActive ? -5 : 0, scale: isActive ? 1.04 : 1 }}
                      transition={{ type: "spring", stiffness: 420, damping: 25 }}
                    >
                      <strong>"{item.label}"</strong>
                      <span>
                        dp[{item.range[0]}][{item.range[1]}]
                      </span>
                    </motion.div>
                  );
                })}
              </div>

              <div className={styles.pathBuilder}>
                <span className={styles.shelfLabel}>path</span>
                <div className={styles.pathSlots}>
                  {[0, 1, 2].map((slot) => {
                    const value = path[slot];
                    const isNewest = action !== "undo" && value === step.activeSubstring;
                    const isUndoFocus = action === "undo" && slot === path.length;

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
                        key={`path-${slot}-${value ?? "empty"}`}
                        layout
                        initial={{ scale: value ? 0.75 : 1, opacity: value ? 0.35 : 1 }}
                        animate={{ scale: 1, opacity: 1, y: isNewest ? [0, -7, 0] : 0 }}
                        transition={{ type: "spring", stiffness: 430, damping: 25 }}
                      >
                        <span>{value ? `"${value}"` : "_"}</span>
                        <small>{isZh ? `第 ${slot + 1} 段` : `segment ${slot + 1}`}</small>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              <AnimatePresence mode="popLayout">
                {action === "choose" && step.activeSubstring ? (
                  <motion.div
                    className={[styles.flyingToken, styles.flyingChoose].join(" ")}
                    key={`choose-${step.activeSubstring}-${path.join("|")}-${results.length}`}
                    initial={{ x: -120, y: -58, scale: 0.65, opacity: 0 }}
                    animate={{
                      x: path.length <= 1 ? -64 : path.length === 2 ? 22 : 86,
                      y: 86,
                      scale: [0.65, 1.18, 0.92],
                      opacity: [0, 1, 1, 0],
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.92, ease: "easeInOut" }}
                  >
                    "{step.activeSubstring}"
                  </motion.div>
                ) : null}

                {action === "record" && latestResult.length > 0 ? (
                  <motion.div
                    className={[styles.flyingToken, styles.flyingRecord].join(" ")}
                    key={`record-${latestResult.join("|")}-${results.length}`}
                    initial={{ x: 0, y: 92, scale: 0.74, opacity: 0 }}
                    animate={{ x: 178, y: 142, scale: [0.74, 1.08, 0.82], opacity: [0, 1, 1, 0] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.05, ease: "easeInOut" }}
                  >
                    {formatPartition(latestResult)}
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
              <motion.div className={styles.progressFill} initial={false} animate={{ width: `${progress}%` }} transition={{ duration: 0.48, ease: "easeOut" }} />
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
                    {value ? formatPartition(value) : index + 1}
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
            <span>{isZh ? "答案数量" : "Partitions"}</span>
            <strong>2</strong>
          </div>
        </div>
      </section>

      <aside className={styles.sidePanel}>
        <div className={styles.codePanel}>
          <div className={styles.sideTitle}>
            <strong>{isZh ? "伪代码对应动作" : "Pseudocode action"}</strong>
            <span>{phase === "fill" ? "dp[i][j]" : "backtrack(index)"}</span>
          </div>

          <div className={styles.codeLines}>
            <div className={[styles.codeLine, phase === "fill" ? styles.activeCodeLine : ""].join(" ")}>
              <span>1</span>
              <code>dp[i][j] = isPalindrome(s[i..j])</code>
            </div>
            <div className={[styles.codeLine, action === "choose" && phase !== "fill" ? styles.activeCodeLine : ""].join(" ")}>
              <span>2</span>
              <code>path.add(s.substring(index, i + 1))</code>
            </div>
            <div className={[styles.codeLine, action === "record" && phase !== "fill" ? styles.activeCodeLine : ""].join(" ")}>
              <span>3</span>
              <code>res.add(copy(path))</code>
            </div>
            <div className={[styles.codeLine, action === "undo" && phase !== "fill" ? styles.activeCodeLine : ""].join(" ")}>
              <span>4</span>
              <code>skip false dp cell or remove last</code>
            </div>
          </div>
        </div>

        <div className={styles.stackPanel}>
          <div className={styles.sideTitle}>
            <strong>{isZh ? "递归调用栈" : "Recursive call stack"}</strong>
            <span>{isZh ? "仅搜索阶段增长" : "Grows during search"}</span>
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
              <motion.div className={[styles.stackFrame, styles.activeStackFrame].join(" ")} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 420, damping: 24 }}>
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

          <svg viewBox="0 0 100 78" role="img" aria-label="Palindrome partitioning search tree">
            <defs>
              <filter id="palindrome-partitioning-glow" x="-70%" y="-70%" width="240%" height="240%">
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
                  className={[styles.treeEdge, isVisited ? styles.visitedTreeEdge : "", isActive ? styles.activeTreeEdge : ""]
                    .filter(Boolean)
                    .join(" ")}
                  d={verticalCurvePath(from, to, 5.2)}
                  initial={false}
                  key={edge.id}
                  animate={{ pathLength: isVisited || isActive ? 1 : 0.08, opacity: isVisited || isActive ? 1 : 0.16 }}
                  transition={{ duration: 0.62, ease: "easeInOut" }}
                />
              );
            })}

            {treeNodes.map((node) => {
              const isActive = step.activeNode === node.id;
              const isVisited = visitedNodes.has(node.id);

              return (
                <motion.g
                  key={node.id}
                  initial={false}
                  animate={{ scale: isActive ? 1.15 : isVisited ? 1 : 0.88, opacity: isVisited || isActive ? 1 : 0.28, y: isActive ? [0, -0.4, 0] : 0 }}
                  style={{ transformOrigin: `${node.x}% ${node.y}%` }}
                  transition={{ type: "spring", stiffness: 390, damping: 24 }}
                >
                  <motion.circle
                    className={[styles.treeNodeHalo, isVisited ? styles.visitedTreeNode : "", isActive ? styles.activeTreeNode : ""]
                      .filter(Boolean)
                      .join(" ")}
                    cx={node.x}
                    cy={node.y}
                    r="7"
                    animate={{ opacity: isActive ? [0.25, 0.72, 0.25] : isVisited ? 0.24 : 0 }}
                    transition={{ duration: 1.45, repeat: isActive ? Infinity : 0, ease: "easeInOut" }}
                  />
                  <circle
                    className={[styles.treeNodeCore, isVisited ? styles.visitedTreeNode : "", isActive ? styles.activeTreeNode : ""]
                      .filter(Boolean)
                      .join(" ")}
                    cx={node.x}
                    cy={node.y}
                    r="5.4"
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
