import { AnimatePresence, motion } from "framer-motion";
import type { AnimationSceneProps } from "../../shared/AnimationSceneProps";
import styles from "./WordSearchScene.module.css";

const board = [
  ["A", "B", "C", "E"],
  ["S", "F", "C", "S"],
  ["A", "D", "E", "E"],
];

const word = "ABCCED";
const directions = [
  { key: "down", labelZh: "下", labelEn: "down", delta: "+1,0" },
  { key: "up", labelZh: "上", labelEn: "up", delta: "-1,0" },
  { key: "right", labelZh: "右", labelEn: "right", delta: "0,+1" },
  { key: "left", labelZh: "左", labelEn: "left", delta: "0,-1" },
] as const;

function sameCell(a: [number, number] | undefined, b: [number, number]) {
  return Boolean(a && a[0] === b[0] && a[1] === b[1]);
}

function hasCell(cells: Array<[number, number]> | undefined, cell: [number, number]) {
  return Boolean(cells?.some((item) => item[0] === cell[0] && item[1] === cell[1]));
}

function cellId(cell: [number, number]) {
  return `${cell[0]},${cell[1]}`;
}

function cellCenter(cell: [number, number]) {
  return {
    x: cell[1] * 25 + 12.5,
    y: cell[0] * 33.3 + 16.65,
  };
}

function polylineForPath(path: Array<[number, number]>) {
  return path.map((cell) => {
    const center = cellCenter(cell);
    return `${center.x},${center.y}`;
  }).join(" ");
}

export function WordSearchScene({ step, language }: AnimationSceneProps) {
  const isZh = language === "zh";
  const path = step.gridPath ?? [];
  const visited = step.visitedCells ?? [];
  const wordPath = step.wordPath ?? "";
  const wordIndex = step.wordIndex ?? 0;
  const phase = step.gridPhase ?? "scan";
  const action = step.action ?? "choose";
  const activeDirection = step.activeDirection ?? "start";
  const progress = Math.round((wordPath.length / word.length) * 100);
  const currentNeed = word[Math.min(wordIndex, word.length - 1)];

  const actionLabel = (() => {
    if (phase === "scan") return isZh ? "枚举起点" : "Scan start";
    if (phase === "reject") return isZh ? "剪枝返回" : "Reject branch";
    if (phase === "done") return isZh ? "匹配成功" : "Matched";
    return isZh ? `匹配 ${currentNeed}` : `Match ${currentNeed}`;
  })();

  const actionHint = (() => {
    if (phase === "scan") {
      return isZh
        ? "从每个格子尝试作为起点。只有字符等于 word[0] 的格子才可能继续 DFS。"
        : "Try each cell as a start. Only cells equal to word[0] can continue into DFS.";
    }

    if (phase === "reject") {
      return isZh
        ? "这个候选要么字符不匹配，要么已经被当前路径使用过，所以直接返回 false。"
        : "This candidate either mismatches the needed character or has already been used, so return false.";
    }

    if (phase === "done") {
      return isZh
        ? "最后一个字符也匹配成功，整条路径连成 ABCCED，算法返回 true。"
        : "The final character is matched. The path forms ABCCED, so the algorithm returns true.";
    }

    return isZh
      ? "当前格子匹配成功后标记 visited=true，再按下、上、右、左搜索下一个字符。"
      : "After a cell matches, mark it visited=true and search the next character in down, up, right, left order.";
  })();

  const stackRows = path.map((cell, index) => ({
    id: `${cell[0]}-${cell[1]}-${index}`,
    depth: index,
    label: `dfs(${cell[0]}, ${cell[1]}, ${index})`,
    active: index === path.length - 1 && phase !== "reject",
  }));

  return (
    <div className={styles.scene}>
      <section className={styles.animationStage}>
        <div className={styles.stageHeader}>
          <div>
            <strong>{isZh ? "单词搜索" : "Word search"}</strong>
          </div>

          <div className={[styles.actionBadge, styles[phase], styles[action]].filter(Boolean).join(" ")}>
            <span className={styles.actionDot} />
            {actionLabel}
          </div>
        </div>

        <div className={styles.flowBoard}>
          <div className={styles.boardPanel}>
            <div className={styles.panelTitle}>
              <strong>{isZh ? "字符网格" : "Board"}</strong>
              <span>3 x 4</span>
            </div>

            <div className={styles.boardWrap}>
              <svg className={styles.pathOverlay} viewBox="0 0 100 100" aria-hidden="true">
                {path.length > 1 ? (
                  <motion.polyline
                    points={polylineForPath(path)}
                    initial={false}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.55, ease: "easeInOut" }}
                  />
                ) : null}
              </svg>

              <div className={styles.boardGrid}>
                {board.flatMap((row, rowIndex) =>
                  row.map((char, colIndex) => {
                    const cell: [number, number] = [rowIndex, colIndex];
                    const isVisited = hasCell(visited, cell);
                    const isActive = sameCell(step.activeCell, cell);
                    const isRejected = sameCell(step.rejectedCell, cell);
                    const isCandidate = hasCell(step.candidateCells, cell);

                    return (
                      <motion.div
                        className={[
                          styles.boardCell,
                          isVisited ? styles.visitedCell : "",
                          isActive ? styles.activeCell : "",
                          isRejected ? styles.rejectedCell : "",
                          isCandidate ? styles.candidateCell : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        key={`${rowIndex}-${colIndex}`}
                        initial={false}
                        animate={{ scale: isActive || isRejected ? [1, 1.08, 1] : 1, y: isActive ? -3 : 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                      >
                        <strong>{char}</strong>
                        <span>
                          {rowIndex},{colIndex}
                        </span>
                      </motion.div>
                    );
                  }),
                )}
              </div>
            </div>
          </div>

          <div className={styles.searchPanel}>
            <div className={styles.panelTitle}>
              <strong>{isZh ? "DFS 匹配过程" : "DFS matching process"}</strong>
              <span>
                index = {Math.min(wordIndex, word.length - 1)} / {word.length - 1}
              </span>
            </div>

            <div className={styles.motionLayer}>
              <div className={styles.wordRail}>
                {word.split("").map((char, index) => (
                  <motion.div
                    className={[
                      styles.wordSlot,
                      index < wordPath.length ? styles.matchedWordSlot : "",
                      index === wordIndex && phase !== "done" ? styles.activeWordSlot : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    key={`${char}-${index}`}
                    initial={false}
                    animate={{ y: index === wordIndex ? -4 : 0 }}
                    transition={{ type: "spring", stiffness: 420, damping: 25 }}
                  >
                    <strong>{char}</strong>
                    <span>{index}</span>
                  </motion.div>
                ))}
              </div>

              <div className={styles.directionPanel}>
                <span className={styles.shelfLabel}>{isZh ? "方向顺序" : "Direction order"}</span>
                <div className={styles.directionGrid}>
                  {directions.map((direction) => (
                    <div
                      className={[
                        styles.directionCard,
                        activeDirection === direction.key ? styles.activeDirectionCard : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      key={direction.key}
                    >
                      <strong>{isZh ? direction.labelZh : direction.labelEn}</strong>
                      <span>{direction.delta}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.pathBuilder}>
                <span className={styles.shelfLabel}>path</span>
                <div className={styles.pathSlots}>
                  {Array.from({ length: word.length }).map((_, index) => {
                    const cell = path[index];
                    const value = wordPath[index];

                    return (
                      <motion.div
                        className={[styles.pathSlot, value ? styles.filledPathSlot : ""].filter(Boolean).join(" ")}
                        key={`path-${index}-${value ?? "empty"}`}
                        layout
                        initial={{ scale: value ? 0.75 : 1, opacity: value ? 0.35 : 1 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 430, damping: 25 }}
                      >
                        <span>{value ?? "_"}</span>
                        <small>{cell ? `(${cell[0]},${cell[1]})` : `step ${index + 1}`}</small>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              <AnimatePresence mode="popLayout">
                {phase === "match" && step.activeCell ? (
                  <motion.div
                    className={[styles.flyingToken, styles.flyingChoose].join(" ")}
                    key={`choose-${cellId(step.activeCell)}-${wordPath}`}
                    initial={{ x: -150, y: -62, scale: 0.65, opacity: 0 }}
                    animate={{ x: Math.min(wordPath.length, 5) * 34 - 92, y: 126, scale: [0.65, 1.18, 0.92], opacity: [0, 1, 1, 0] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.92, ease: "easeInOut" }}
                  >
                    {wordPath[wordPath.length - 1]}
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>

          <div className={styles.statusPanel}>
            <div className={styles.panelTitle}>
              <strong>{isZh ? "匹配状态" : "Status"}</strong>
              <span>{wordPath.length} / {word.length}</span>
            </div>

            <div className={styles.progressTrack}>
              <motion.div className={styles.progressFill} initial={false} animate={{ width: `${progress}%` }} transition={{ duration: 0.48, ease: "easeOut" }} />
            </div>

            <div className={styles.statusCards}>
              <div className={styles.statusCard}>
                <span>{isZh ? "当前需要" : "Need"}</span>
                <strong>{phase === "done" ? "done" : currentNeed}</strong>
              </div>
              <div className={styles.statusCard}>
                <span>{isZh ? "已匹配" : "Matched"}</span>
                <strong>{wordPath || "_"}</strong>
              </div>
              <div className={styles.statusCard}>
                <span>visited</span>
                <strong>{visited.length}</strong>
              </div>
              <div className={[styles.statusCard, phase === "done" ? styles.successCard : ""].join(" ")}>
                <span>{isZh ? "返回值" : "Return"}</span>
                <strong>{phase === "done" ? "true" : phase === "reject" ? "false" : "..."}</strong>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.explainStrip}>
          <div className={styles.explainText}>
            <strong>{actionLabel}</strong>
            <span>{actionHint}</span>
          </div>

          <div className={styles.formulaCard}>
            <span>{isZh ? "目标单词" : "Target"}</span>
            <strong>ABCCED</strong>
          </div>
        </div>
      </section>

      <aside className={styles.sidePanel}>
        <div className={styles.codePanel}>
          <div className={styles.sideTitle}>
            <strong>{isZh ? "伪代码对应动作" : "Pseudocode action"}</strong>
            <span>dfs(row, col, index)</span>
          </div>

          <div className={styles.codeLines}>
            <div className={[styles.codeLine, phase === "reject" ? styles.activeCodeLine : ""].join(" ")}>
              <span>1</span>
              <code>boundary / visited / char mismatch</code>
            </div>
            <div className={[styles.codeLine, phase === "done" ? styles.activeCodeLine : ""].join(" ")}>
              <span>2</span>
              <code>if index == word.length - 1 return true</code>
            </div>
            <div className={[styles.codeLine, phase === "match" ? styles.activeCodeLine : ""].join(" ")}>
              <span>3</span>
              <code>visited[row][col] = true</code>
            </div>
            <div className={[styles.codeLine, phase === "match" ? styles.activeCodeLine : ""].join(" ")}>
              <span>4</span>
              <code>dfs(nextRow, nextCol, index + 1)</code>
            </div>
            <div className={[styles.codeLine, action === "undo" ? styles.activeCodeLine : ""].join(" ")}>
              <span>5</span>
              <code>visited[row][col] = false</code>
            </div>
          </div>
        </div>

        <div className={styles.stackPanel}>
          <div className={styles.sideTitle}>
            <strong>{isZh ? "递归调用栈" : "Recursive call stack"}</strong>
            <span>{isZh ? "路径越长递归越深" : "Deeper path, deeper DFS"}</span>
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
                style={{ marginLeft: row.depth * 8 }}
              >
                <span>depth {row.depth}</span>
                <code>{row.label}</code>
              </motion.div>
            ))}

            {phase === "reject" && step.rejectedCell ? (
              <motion.div className={[styles.stackFrame, styles.rejectStackFrame].join(" ")} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 420, damping: 24 }}>
                <span>return</span>
                <code>false at ({step.rejectedCell[0]}, {step.rejectedCell[1]})</code>
              </motion.div>
            ) : null}

            {phase === "done" ? (
              <motion.div className={[styles.stackFrame, styles.activeStackFrame].join(" ")} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 420, damping: 24 }}>
                <span>return</span>
                <code>true</code>
              </motion.div>
            ) : null}
          </div>
        </div>

        <div className={styles.rulePanel}>
          <div className={styles.sideTitle}>
            <strong>{isZh ? "剪枝规则" : "Pruning rules"}</strong>
          </div>

          <div className={styles.ruleList}>
            <div className={phase === "reject" ? styles.activeRule : ""}>
              <span>1</span>
              <p>{isZh ? "越界直接失败" : "Out of bounds fails"}</p>
            </div>
            <div className={phase === "reject" ? styles.activeRule : ""}>
              <span>2</span>
              <p>{isZh ? "visited=true 不能重复使用" : "visited=true cannot be reused"}</p>
            </div>
            <div className={phase === "reject" ? styles.activeRule : ""}>
              <span>3</span>
              <p>{isZh ? "字符不匹配直接返回 false" : "Character mismatch returns false"}</p>
            </div>
            <div className={phase === "done" ? styles.activeRule : ""}>
              <span>4</span>
              <p>{isZh ? "最后一个字符匹配则返回 true" : "Last character matched returns true"}</p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
