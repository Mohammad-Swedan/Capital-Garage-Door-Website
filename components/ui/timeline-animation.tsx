"use client";

import React from "react";
import { m, useInView, Variants } from "framer-motion";

interface TimelineContentProps {
  children: React.ReactNode;
  as?: string;
  animationNum?: number;
  timelineRef: React.RefObject<Element>;
  customVariants: Variants;
  className?: string;
  [key: string]: any;
}

export function TimelineContent({
  children,
  as = "div",
  animationNum = 0,
  timelineRef,
  customVariants,
  className,
  ...props
}: TimelineContentProps) {
  const isInView = useInView(timelineRef, { once: true, margin: "-10% 0px" });
  
  // Create a motion component dynamically based on the 'as' prop
  const MotionComponent = (m[as as keyof typeof m] || m.div) as any;

  return (
    <MotionComponent
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={customVariants}
      custom={animationNum}
      className={className}
      {...props}
    >
      {children}
    </MotionComponent>
  );
}
