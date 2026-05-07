import { AnimatePresence, motion } from "framer-motion";
import type { AnimationSceneProps } from "../../shared/AnimationSceneProps";
import { verticalCurvePath } from "../../shared/curvePath";
import styles from "./LetterCombinationsScene.module.css";

const treeNodes = [
  { id: "root", label: '""', x: 50, y: 8 },
  { id: "a", label: "a", x: 20, y: 29 },
  { id: "b", label: "b", x: 50, y: 29 },
  { id: "c", label: "c", x: 80, y: 29 },
  { id: "ad", label: "ad", x: 10, y: 59 },
  { id: "ae", label: "ae", x: 20, y: 59 },
  { id: "af", label: "af", x: 30, y: 59 },
  { id: "bd", label: "bd", x: 40, y: 59 },
  { id: "be", label: "be", x: 50, y: 59 },
  { id: "bf", label: "bf", x: 60, y: 59 },
  { id: "cd", label: "cd", x: 70, y: 59 },
  { id: "ce", label: "ce", x: 80, y: 59 },
  { id: "cf", label: "cf", x: 90, y: 59 },
];

const treeEdges = [
  { id: "root-a", from: "root", to: "a" },
  { id: "root-b", from: "root", to: "b" },
  { id: "root-c", from: "root", to: "c" },
  { id: "a-ad", from: "a", to: "ad" },
  { id: "a-ae", from: "a", to: "ae" },
  { id: "a-af", from: "a", to: "af" },
  { id: "b-bd", from: "b", to: "bd" },
  { id: "b-be", from: "b", to: "be" },
  { id: "b-bf", from: "b", to: "bf" },
  { id: "c-cd", from: "c", to: "cd" },
  { id: "c-ce", from: "c", to: "ce" },
  { id: "c-cf", from: "c", to: "cf" },
];

const digits = ["2", "3"];
const fallbackGroups = ["abc", "def"];

function getNode(id: string) {
  return treeNodes.find((node) => node.id === id)!;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function LetterCombinationsScene({ step, language }: AnimationSceneProps) {
  const isZh = language === "zh";
  const path = step.wordPath ?? "";
  const results = step.wordResults ?? [];
  const groups = step.letterGroups ?? fallbackGroups;
  const visitedNodes = new Set(step.visitedNodes ?? []);
  const digitIndex = step.digitIndex ?? 0;
  const action = step.action ?? "choose";
  const isDone = action === "done";

  const activeGroupIndex = isDone
    ? -1
    : action === "record"
      ? groups.length - 1
      : clamp(digitIndex, 0, groups.length - 1);

  const activeCandidates = activeGroupIndex >= 0 ? groups[activeGroupIndex].split("") : [];
  const activeDigit = activeGroupIndex >= 0 ? digits[activeGroupIndex] : "";
  const totalResults = groups.reduce((product, group) => product * group.length, 1);
  const latestResult = results[results.length - 1] ?? path;
  const progress = totalResults === 0 ? 0 : Math.round((results.length / totalResults) * 100);

  const actionLabel = (() => {
    if (action === "choose") {
      if (step.activeLetter) {
        return isZh ? `选择 ${step.activeLetter}` : `Choose ${step.activeLetter}`;
      }

      return isZh ? "准备映射" : "Prepare mapping";
    }

    if (action === "record") {
      return isZh ? `记录 ${latestResult}` : `Record ${latestResult}`;
    }

    if (action === "undo") {
      return isZh ? `撤销 ${step.activeLetter ?? ""}` : `Undo ${step.activeLetter ?? ""}`;
    }

    return isZh ? "全部完成" : "All done";
  })();

  const actionHint = (() => {
    if (action === "choose") {
      if (!step.activeLetter) {
        return isZh ? "先建立数字到字母的映射，path 从空字符串开始。" : "Build the digit-to-letter map. The path starts empty.";
      }

      return isZh
        ? `把字母 ${step.activeLetter} 放进 path，递归继续向下一位。`
        : `Put ${step.activeLetter} into path, then recurse to the next digit.`;
    }

    if (action === "record") {
      return isZh
        ? `path 长度已经等于 digits 长度，把 ${latestResult} 复制进 res。`
        : `The path length equals the digits length, so copy ${latestResult} into res.`;
    }

    if (action === "undo") {
      return isZh
        ? `这一支已经试完，删除最后一个字母，回到上一层继续换选择。`
        : `This branch is done. Remove the last letter and go back to try the next choice.`;
    }

    return isZh
      ? `所有分支都遍历完成，共得到 ${results.length} 个组合。`
      : `Every branch is explored. We collected ${results.length} combinations.`;
  })();

  const stackRows = [
    {
      id: "root-call",
      depth: 0,
      label: `backtrack(0, "")`,
      active: path.length === 0 && action !== "done",
    },
    path.length >= 1
      ? {
          id: "level-1-call",
          depth: 1,
          label: `backtrack(1, "${path[0]}")`,
          active: path.length === 1 && action !== "done",
        }
      : null,
    path.length >= 2
      ? {
          id: "level-2-call",
          depth: 2,
          label: `backtrack(2, "${path}")`,
          active: path.length === 2 || action === "record",
        }
      : null,
  ].filter(Boolean) as Array<{ id: string; depth: number; label: string; active: boolean }>;

  return (
    <div className={styles.scene}>
      <section className={styles.animationStage}>
        <div className={styles.stageHeader}>
          <div>
            <strong>{isZh ? "电话号码字母组合" : "Phone letter combinations"}</strong>
          </div>

          <div className={[styles.actionBadge, styles[action]].filter(Boolean).join(" ")}>
            <span className={styles.actionDot} />
            {actionLabel}
          </div>
        </div>

        <div className={styles.flowBoard}>
          <div className={styles.phonePanel}>
            <div className={styles.panelTitle}>
              <strong>{isZh ? "电话按键映射" : "Phone keypad map"}</strong>
              <span>digits = "23"</span>
            </div>

            <div className={styles.keypadGrid}>
              {digits.map((digit, index) => {
                const letters = groups[index] ?? "";
                const isActiveDigit = activeGroupIndex === index;
                const isDoneDigit = !isDone && path.length > index;

                return (
                  <motion.div
                    className={[
                      styles.keyCard,
                      isActiveDigit ? styles.activeKeyCard : "",
                      isDoneDigit ? styles.doneKeyCard : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    key={digit}
                    initial={false}
                    animate={{
                      y: isActiveDigit ? -4 : 0,
                      scale: isActiveDigit ? 1.03 : 1,
                    }}
                    transition={{ type: "spring", stiffness: 420, damping: 25 }}
                  >
                    <div className={styles.keyNumber}>{digit}</div>
                    <div className={styles.keyLetters}>
                      {letters.split("").map((letter) => {
                        const isActiveLetter = step.activeLetter === letter;

                        return (
                          <motion.span
                            className={[
                              styles.keyLetter,
                              isActiveDigit && isActiveLetter ? styles.activeKeyLetter : "",
                              path.includes(letter) ? styles.usedKeyLetter : "",
                            ]
                              .filter(Boolean)
                              .join(" ")}
                            key={letter}
                            initial={false}
                            animate={{
                              scale: isActiveDigit && isActiveLetter ? [1, 1.28, 1] : 1,
                              y: isActiveDigit && isActiveLetter ? [0, -4, 0] : 0,
                            }}
                            transition={{ duration: 0.58, ease: "easeInOut" }}
                          >
                            {letter}
                          </motion.span>
                        );
                      })}
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
                index = {Math.min(digitIndex, digits.length)} / {digits.length}
              </span>
            </div>

            <div className={styles.motionLayer}>
              <div className={styles.indexRail}>
                {digits.map((digit, index) => (
                  <div
                    className={[
                      styles.indexStation,
                      activeGroupIndex === index ? styles.activeStation : "",
                      path.length > index ? styles.passedStation : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    key={`station-${digit}`}
                  >
                    <span>index {index}</span>
                    <strong>{digit}</strong>
                  </div>
                ))}

                <div
                  className={[
                    styles.indexStation,
                    digitIndex >= digits.length || action === "record" || action === "done" ? styles.activeStation : "",
                    action === "done" ? styles.passedStation : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <span>base</span>
                  <strong>✓</strong>
                </div>
              </div>

              <div className={styles.candidateShelf}>
                <span className={styles.shelfLabel}>
                  {isDone
                    ? isZh
                      ? "候选字母已全部遍历"
                      : "All candidates explored"
                    : isZh
                      ? `当前数字 ${activeDigit} 的候选字母`
                      : `Candidates for digit ${activeDigit}`}
                </span>

                <div className={styles.candidateLetters}>
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
                    activeCandidates.map((letter) => {
                      const isActiveLetter = step.activeLetter === letter;

                      return (
                        <motion.span
                          className={[
                            styles.candidateLetter,
                            isActiveLetter ? styles.activeCandidateLetter : "",
                            path.includes(letter) ? styles.chosenCandidateLetter : "",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                          key={`${activeDigit}-${letter}`}
                          initial={false}
                          animate={{
                            scale: isActiveLetter ? [1, 1.22, 1] : 1,
                            y: isActiveLetter ? [0, -8, 0] : 0,
                          }}
                          transition={{ duration: 0.62, ease: "easeInOut" }}
                        >
                          {letter}
                        </motion.span>
                      );
                    })
                  )}
                </div>
              </div>

              <div className={styles.pathBuilder}>
                <span className={styles.shelfLabel}>path</span>

                <div className={styles.pathSlots}>
                  {digits.map((digit, index) => {
                    const value = path[index];
                    const isNewest =
                      action === "choose" &&
                      Boolean(value) &&
                      value === step.activeLetter &&
                      index === Math.max(path.length - 1, 0);

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
                        key={`path-${digit}-${index}-${value ?? "empty"}`}
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
                {action === "choose" && step.activeLetter ? (
                  <motion.div
                    className={[styles.flyingToken, styles.flyingChoose].join(" ")}
                    key={`choose-${step.activeLetter}-${path}-${results.length}`}
                    initial={{
                      x: activeGroupIndex === 0 ? -132 : 132,
                      y: -62,
                      scale: 0.65,
                      opacity: 0,
                    }}
                    animate={{
                      x: path.length <= 1 ? -42 : 42,
                      y: 74,
                      scale: [0.65, 1.18, 0.92],
                      opacity: [0, 1, 1, 0],
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.92, ease: "easeInOut" }}
                  >
                    {step.activeLetter}
                  </motion.div>
                ) : null}

                {action === "record" && latestResult ? (
                  <motion.div
                    className={[styles.flyingToken, styles.flyingRecord].join(" ")}
                    key={`record-${latestResult}-${results.length}`}
                    initial={{ x: 0, y: 82, scale: 0.74, opacity: 0 }}
                    animate={{
                      x: 174,
                      y: 132,
                      scale: [0.74, 1.08, 0.82],
                      opacity: [0, 1, 1, 0],
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.05, ease: "easeInOut" }}
                  >
                    "{latestResult}"
                  </motion.div>
                ) : null}

                {action === "undo" && step.activeLetter ? (
                  <motion.div
                    className={[styles.flyingToken, styles.flyingUndo].join(" ")}
                    key={`undo-${step.activeLetter}-${path}-${results.length}`}
                    initial={{
                      x: path.length === 0 ? -42 : 42,
                      y: 78,
                      scale: 0.96,
                      rotate: 0,
                      opacity: 0,
                    }}
                    animate={{
                      x: [path.length === 0 ? -42 : 42, -122],
                      y: [78, -74],
                      scale: [0.96, 0.9, 0.55],
                      rotate: [0, -10, 12, -20],
                      opacity: [0, 1, 1, 0],
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.98, ease: "easeInOut" }}
                  >
                    {step.activeLetter}
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
                    key={`result-${index}-${value ?? "empty"}`}
                    layout
                    initial={value ? { scale: 0.76, opacity: 0, y: 12 } : false}
                    animate={value ? { scale: 1, opacity: 1, y: 0 } : { opacity: 1 }}
                    transition={{ type: "spring", stiffness: 430, damping: 27 }}
                  >
                    {value ? `"${value}"` : index + 1}
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
            <span>{isZh ? "组合数量" : "Combinations"}</span>
            <strong>3 × 3 = 9</strong>
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
              <code>path.append(letter)</code>
            </div>
            <div className={[styles.codeLine, action === "record" ? styles.activeCodeLine : ""].join(" ")}>
              <span>2</span>
              <code>res.add(path)</code>
            </div>
            <div className={[styles.codeLine, action === "undo" ? styles.activeCodeLine : ""].join(" ")}>
              <span>3</span>
              <code>path.deleteLast()</code>
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
                style={{ marginLeft: row.depth * 14 }}
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

          <svg viewBox="0 0 100 72" role="img" aria-label="Letter combination search tree">
            <defs>
              <filter id="letter-combinations-rich-glow" x="-70%" y="-70%" width="240%" height="240%">
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
                    const reverse = action === "undo";

                    return (
                      <motion.circle
                        className={[styles.treeTravelDot, reverse ? styles.undoTreeTravelDot : ""]
                          .filter(Boolean)
                          .join(" ")}
                        key={`travel-${edge.id}-${action}-${step.activeNode}-${step.activeLetter}`}
                        r="1.55"
                        initial={{
                          cx: reverse ? to.x : from.x,
                          cy: reverse ? to.y - 5.2 : from.y + 5.2,
                          opacity: 0,
                        }}
                        animate={{
                          cx: reverse ? [to.x, from.x] : [from.x, to.x],
                          cy: reverse ? [to.y - 5.2, from.y + 5.2] : [from.y + 5.2, to.y - 5.2],
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
                    r="7.2"
                    animate={{
                      opacity: isActive ? [0.25, 0.72, 0.25] : isVisited ? 0.24 : 0,
                    }}
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
                    r="5.65"
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
