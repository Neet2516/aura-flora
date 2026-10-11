import React from 'react';
import { motion } from 'framer-motion';

interface ScrollRevealTextProps {
  text: string;
  tag?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  stagger?: number;
}

export const ScrollRevealText: React.FC<ScrollRevealTextProps> = ({
  text,
  tag = 'h2',
  className = '',
  style = {},
  delay = 0,
  stagger = 0.035,
}) => {
  const words = text.split(' ');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const wordVariants = {
    hidden: {
      opacity: 0,
      y: 18,
      transition: { type: 'spring' as const, damping: 18, stiffness: 120 },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, damping: 18, stiffness: 120 },
    },
  };

  const Component = motion[tag] as any;

  return (
    <Component
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      className={className}
      style={{
        display: 'inline-flex',
        flexWrap: 'wrap',
        gap: '0.24em',
        ...style,
      }}
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          variants={wordVariants}
          style={{ display: 'inline-block', willChange: 'transform, opacity' }}
        >
          {word}
        </motion.span>
      ))}
    </Component>
  );
};
