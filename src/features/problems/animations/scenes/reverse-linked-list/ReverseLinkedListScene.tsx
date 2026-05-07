import { motion } from "framer-motion";
import type { AnimationSceneProps } from "../../shared/AnimationSceneProps";
import styles from "./ReverseLinkedListScene.module.css";

const listValues = [1, 2, 3, 4];

export function ReverseLinkedListScene({ step }: AnimationSceneProps) {
  const visibleValues = step.pointer && step.pointer > 1 ? [...listValues].reverse() : listValues;
  const isReversed = Boolean(step.pointer && step.pointer > 1);

  return (
    <div className={styles.listScene}>
      {visibleValues.map((value, index) => (
        <div className={styles.nodeWrap} key={`${value}-${index}`}>
          <motion.div
            className={[styles.listNode, step.highlight.includes(index) ? styles.active : ""].filter(Boolean).join(" ")}
            layout
          >
            {value}
          </motion.div>
          {index < visibleValues.length - 1 && (
            <span className={[styles.arrow, isReversed ? styles.reversed : ""].filter(Boolean).join(" ")} />
          )}
        </div>
      ))}
    </div>
  );
}

