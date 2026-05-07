import { motion } from "framer-motion";
import type { AnimationSceneProps } from "../../shared/AnimationSceneProps";
import styles from "./TwoSumScene.module.css";

const arrayValues = [2, 7, 11, 15];

export function TwoSumScene({ step }: AnimationSceneProps) {
  return (
    <div className={styles.arrayScene}>
      {arrayValues.map((value, index) => (
        <motion.div
          layout
          key={value}
          className={[
            styles.arrayCell,
            step.highlight.includes(index) ? styles.active : "",
            step.pointer === index ? styles.pointer : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <span>{value}</span>
          <small>i={index}</small>
          {step.target === index && <em>need</em>}
        </motion.div>
      ))}
    </div>
  );
}

