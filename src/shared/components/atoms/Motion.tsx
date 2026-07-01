"use client";

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { fadeUp, fadeIn, scaleIn, slideLeft, slideRight, staggerContainer } from '../../lib/motion';

type MotionVariant = 'fadeUp' | 'fadeIn' | 'scaleIn' | 'slideLeft' | 'slideRight' | 'staggerContainer';

interface AnimatedDivProps extends HTMLMotionProps<"div"> {
  variant?: MotionVariant;
}

const variantMap = {
  fadeUp,
  fadeIn,
  scaleIn,
  slideLeft,
  slideRight,
  staggerContainer
};

export function AnimatedDiv({ variant = 'fadeUp', children, ...props }: AnimatedDivProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={variantMap[variant]}
      {...props}
    >
      {children}
    </motion.div>
  );
}
