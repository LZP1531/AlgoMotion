import type { AnimationSceneProps } from "../../shared/AnimationSceneProps";
import styles from "./InorderTraversalScene.module.css";

const treeNodes = [
  { value: 1, x: 34, y: 32 },
  { value: 2, x: 62, y: 62 },
  { value: 3, x: 45, y: 82 },
];

export function InorderTraversalScene({ step }: AnimationSceneProps) {
  return (
    <div className={styles.treeScene}>
      <svg viewBox="0 0 100 100" role="img" aria-label="Binary tree">
        <line x1="34" y1="32" x2="62" y2="62" />
        <line x1="62" y1="62" x2="45" y2="82" />
        {treeNodes.map((node, index) => (
          <g key={node.value}>
            <circle className={step.highlight.includes(index) ? styles.active : ""} cx={node.x} cy={node.y} r="8" />
            <text x={node.x} y={node.y + 1.8}>
              {node.value}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

