import { memo, useMemo } from 'react';
import { motion, useReducedMotion, MotionProps } from 'framer-motion';

interface LazyMotionProps extends MotionProps {
  children: React.ReactNode;
  className?: string;
  as?: keyof typeof motion;
}

// Optimized motion component that respects reduced motion preferences
export const LazyMotion = memo(({ 
  children, 
  className, 
  as = 'div',
  initial,
  animate,
  whileHover,
  whileTap,
  transition,
  ...props 
}: LazyMotionProps) => {
  const shouldReduceMotion = useReducedMotion();
  const MotionComponent = motion[as];

  const optimizedProps = useMemo(() => ({
    initial: shouldReduceMotion ? false : initial,
    animate: shouldReduceMotion ? false : animate,
    whileHover: shouldReduceMotion ? false : whileHover,
    whileTap: shouldReduceMotion ? false : whileTap,
    transition: shouldReduceMotion ? { duration: 0 } : transition,
    className: `${className || ''} ${shouldReduceMotion ? '' : 'motion-element'}`.trim(),
    ...props
  }), [shouldReduceMotion, initial, animate, whileHover, whileTap, transition, className, props]);

  return (
    <MotionComponent {...optimizedProps}>
      {children}
    </MotionComponent>
  );
});

LazyMotion.displayName = 'LazyMotion';