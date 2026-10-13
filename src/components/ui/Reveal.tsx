"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";

type RevealProps = HTMLMotionProps<"div"> & {
  delay?: number;
  y?: number;
  as?: "div" | "li" | "section" | "article";
};

/*
 * The element structure is identical on server and client (so hydration never
 * leaves content stuck invisible). With reduced motion the movement is removed
 * and the reveal becomes a quick, simple fade.
 */

/** Fade-and-rise on scroll. */
export function Reveal({ delay = 0, y = 28, as = "div", children, ...rest }: RevealProps) {
  const reduce = useReducedMotion();
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      initial={{ opacity: 0, y: reduce ? 0 : y, filter: reduce ? "blur(0px)" : "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={reduce ? { duration: 0.15 } : { duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </Comp>
  );
}

/** Image mask reveal: the frame wipes open from the bottom. */
export function MaskReveal({ delay = 0, children, ...rest }: HTMLMotionProps<"div"> & { delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ clipPath: "inset(8% 4% 0% 4% round 28px)", opacity: 0.5 }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0% round 0px)", opacity: 1 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={reduce ? { duration: 0 } : { duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
