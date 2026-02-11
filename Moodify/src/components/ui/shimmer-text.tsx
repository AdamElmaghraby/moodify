"use client";

import { motion } from "motion/react";

export function ShiningText({
  text,
  className,
  tag = "span",
}: {
  text: string;
  className?: string;
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span" | "div" | "p";
}) {
  const MotionComponent = motion[tag as keyof typeof motion] as any;

  return (
    <MotionComponent
      className={`bg-[linear-gradient(110deg,#404040,35%,#fff,50%,#404040,75%,#404040)] bg-[length:200%_100%] bg-clip-text text-base font-regular text-transparent ${
        className || ""
      }`}
      initial={{ backgroundPosition: "200% 0" }}
      animate={{ backgroundPosition: "-200% 0" }}
      transition={{
        repeat: Infinity,
        duration: 2,
        ease: "linear",
      }}
    >
      {text}
    </MotionComponent>
  );
}
