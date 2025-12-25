// =============================================================================
// ANIMATION UTILITIES
// CSS-based animation classes and utilities for micro-interactions.
// =============================================================================

/**
 * Animation delay utilities for staggered animations
 */
export const staggerDelay = (index: number, baseDelay: number = 50): string => {
  return `${index * baseDelay}ms`
}

/**
 * Animation variant classes
 */
export const animations = {
  // Fade animations
  fadeIn: 'animate-fade-in',
  fadeInUp: 'animate-fade-in-up',
  fadeInDown: 'animate-fade-in-down',
  fadeInLeft: 'animate-fade-in-left',
  fadeInRight: 'animate-fade-in-right',

  // Scale animations
  scaleIn: 'animate-scale-in',
  scaleInBounce: 'animate-scale-in-bounce',

  // Slide animations
  slideInUp: 'animate-slide-in-up',
  slideInDown: 'animate-slide-in-down',
  slideInLeft: 'animate-slide-in-left',
  slideInRight: 'animate-slide-in-right',

  // Special animations
  pulse: 'animate-pulse-soft',
  shimmer: 'animate-shimmer',
  bounce: 'animate-bounce-soft',
  wiggle: 'animate-wiggle',
  spin: 'animate-spin',
} as const

/**
 * Hover animation classes
 */
export const hoverAnimations = {
  lift: 'hover-lift',
  scale: 'hover-scale',
  glow: 'hover-glow',
  brighten: 'hover-brighten',
} as const

/**
 * Transition presets
 */
export const transitions = {
  fast: 'transition-all duration-150 ease-out',
  default: 'transition-all duration-200 ease-out',
  slow: 'transition-all duration-300 ease-out',
  smooth: 'transition-all duration-300 ease-in-out',
  spring: 'transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const
