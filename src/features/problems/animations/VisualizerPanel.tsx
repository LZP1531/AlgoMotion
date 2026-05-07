import { motion } from "framer-motion";
import { Pause, Play, RotateCcw, Route, SkipBack, SkipForward } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { animationSteps } from "../../../data/problems";
import type { Language, Problem } from "../../../types/content";
import { getAnimationScene } from "./registry";

interface VisualizerPanelProps {
  problem: Problem;
  language: Language;
}

export function VisualizerPanel({ problem, language }: VisualizerPanelProps) {
  const steps = animationSteps[problem.animationKey] ?? animationSteps["two-sum"];
  const { Component: SceneComponent, frameClassName, intervalMs = 1500 } = getAnimationScene(problem.animationKey);
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
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [intervalMs, isPlaying, steps.length]);

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
          className={["visual-scene", frameClassName].filter(Boolean).join(" ")}
          layout
        >
          <SceneComponent step={step} language={language} />
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
