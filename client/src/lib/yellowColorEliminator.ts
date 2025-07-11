/**
 * Targeted Yellow Color Eliminator
 * Surgical script to detect and eliminate ONLY problematic yellow colors
 * while preserving all legitimate UI elements
 */

let isRunning = false;
let eliminatorInterval: NodeJS.Timeout | null = null;

// Only target pure yellow colors and known problematic values
const PURE_YELLOW_PATTERNS = [
  /^yellow$/i,
  /^gold$/i,
  /^#ffff00$/i,
  /^#ffd700$/i,
  /^rgb\(\s*255,\s*255,\s*0\s*\)$/i,
  /^rgb\(\s*255,\s*215,\s*0\s*\)$/i,
];

/**
 * Check if a color value is pure yellow (very strict)
 */
function isPureYellow(color: string): boolean {
  if (!color) return false;
  
  const cleanColor = color.trim();
  
  // Only check against pure yellow patterns
  for (const pattern of PURE_YELLOW_PATTERNS) {
    if (pattern.test(cleanColor)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Fix only pure yellow colors on specific element
 */
function fixPureYellowColors(element: HTMLElement): void {
  const computedStyle = window.getComputedStyle(element);
  
  // Only fix if background is pure yellow
  const backgroundColor = computedStyle.backgroundColor;
  if (isPureYellow(backgroundColor)) {
    element.style.setProperty('background-color', '#ffffff', 'important');
  }
  
  // Only fix if text color is pure yellow
  const textColor = computedStyle.color;
  if (isPureYellow(textColor)) {
    element.style.setProperty('color', '#1e293b', 'important');
  }
  
  // Check inline styles only for pure yellow
  const inlineStyle = element.getAttribute('style');
  if (inlineStyle) {
    for (const pattern of PURE_YELLOW_PATTERNS) {
      if (pattern.test(inlineStyle)) {
        element.style.setProperty('background-color', '#ffffff', 'important');
        element.style.setProperty('color', '#1e293b', 'important');
        break;
      }
    }
  }
}

/**
 * Very limited scan for pure yellow colors only
 */
function eliminatePureYellowColors(): void {
  if (isRunning) return;
  
  isRunning = true;
  
  try {
    // Only target specific known problematic components
    const potentialYellowElements = document.querySelectorAll(
      '.thumbnail-editor, .feature-access-guard, [style*="yellow"], [style*="gold"], [style*="#ffff00"], [style*="#ffd700"]'
    );
    
    potentialYellowElements.forEach(element => {
      if (element instanceof HTMLElement) {
        fixPureYellowColors(element);
      }
    });
    
  } catch (error) {
    console.error('Error in pure yellow color elimination:', error);
  } finally {
    isRunning = false;
  }
}

/**
 * Start the targeted yellow color elimination system
 */
export function startYellowColorElimination(): void {
  // Run immediately
  eliminatePureYellowColors();
  
  // Run less frequently to avoid performance issues
  eliminatorInterval = setInterval(() => {
    eliminatePureYellowColors();
  }, 2000); // Every 2 seconds instead of 500ms
  
  console.log('Targeted yellow color elimination system started');
}

/**
 * Stop the yellow color elimination system
 */
export function stopYellowColorElimination(): void {
  if (eliminatorInterval) {
    clearInterval(eliminatorInterval);
    eliminatorInterval = null;
  }
  
  console.log('Targeted yellow color elimination system stopped');
}

/**
 * Force run yellow color elimination
 */
export function forceEliminateYellowColors(): void {
  eliminatePureYellowColors();
}