/**
 * Comprehensive Yellow Color Eliminator
 * Aggressive script to detect and eliminate ALL yellow colors from the DOM
 * This runs continuously to prevent any yellow contamination
 */

let isRunning = false;
let eliminatorInterval: NodeJS.Timeout | null = null;
let observer: MutationObserver | null = null;

// Precise yellow patterns - only target pure yellow colors
const YELLOW_PATTERNS = [
  // Color names - only pure yellow
  /^yellow$/gi,
  /^gold$/gi,
  
  // Hex patterns - only pure yellow
  /#ffff00/gi, /#ff0$/gi, /#ffd700/gi,
  
  // RGB patterns - only pure yellow
  /rgb\(\s*255,\s*255,\s*0\s*\)/gi, /rgb\(\s*255,\s*215,\s*0\s*\)/gi,
  
  // HSL patterns - only yellow hues (60 degrees)
  /hsl\(\s*60,\s*[5-9][0-9]%,\s*[3-9][0-9]%\s*\)/gi,
];

/**
 * Check if a color value contains yellow
 */
function isYellowColor(color: string): boolean {
  if (!color) return false;
  
  const cleanColor = color.trim().toLowerCase();
  
  // Check against all yellow patterns
  for (const pattern of YELLOW_PATTERNS) {
    if (pattern.test(cleanColor)) {
      return true;
    }
  }
  
  // Check RGB values directly for pure yellow colors only
  const rgbMatch = cleanColor.match(/rgb\(\s*(\d+),\s*(\d+),\s*(\d+)\s*\)/);
  if (rgbMatch) {
    const [, r, g, b] = rgbMatch.map(Number);
    // Only detect pure yellow colors (not orange, amber, etc.)
    if ((r === 255 && g === 255 && b === 0) || // Pure yellow
        (r === 255 && g === 215 && b === 0)) { // Gold
      return true;
    }
  }
  
  // Check HSL values for pure yellow hues only
  const hslMatch = cleanColor.match(/hsl\(\s*(\d+),\s*(\d+)%,\s*(\d+)%\s*\)/);
  if (hslMatch) {
    const [, h, s, l] = hslMatch.map(Number);
    // Only detect pure yellow hue (60 degrees) with high saturation
    if (h === 60 && s >= 50 && l >= 30) {
      return true;
    }
  }
  
  return false;
}

/**
 * Fix yellow colors on a specific element
 */
function fixElementColors(element: HTMLElement): void {
  try {
    const computedStyle = window.getComputedStyle(element);
    
    // Check and fix background color
    const backgroundColor = computedStyle.backgroundColor;
    if (isYellowColor(backgroundColor)) {
      element.style.setProperty('background-color', '#ffffff', 'important');
      element.style.setProperty('background', '#ffffff', 'important');
    }
    
    // Check and fix text color
    const textColor = computedStyle.color;
    if (isYellowColor(textColor)) {
      element.style.setProperty('color', '#1e293b', 'important');
    }
    
    // Check and fix border color
    const borderColor = computedStyle.borderColor;
    if (isYellowColor(borderColor)) {
      element.style.setProperty('border-color', '#e2e8f0', 'important');
    }
    
    // Check inline styles
    const inlineStyle = element.getAttribute('style');
    if (inlineStyle) {
      for (const pattern of YELLOW_PATTERNS) {
        if (pattern.test(inlineStyle)) {
          element.style.setProperty('background-color', '#ffffff', 'important');
          element.style.setProperty('background', '#ffffff', 'important');
          element.style.setProperty('color', '#1e293b', 'important');
          element.style.setProperty('border-color', '#e2e8f0', 'important');
          break;
        }
      }
    }
    
    // Check class names for yellow-related classes
    const className = element.className;
    if (className && /yellow|amber|orange|warning|gold/i.test(className)) {
      element.style.setProperty('background-color', '#ffffff', 'important');
      element.style.setProperty('background', '#ffffff', 'important');
      element.style.setProperty('color', '#1e293b', 'important');
      element.style.setProperty('border-color', '#e2e8f0', 'important');
    }
    
  } catch (error) {
    // Silently ignore errors to avoid console spam
  }
}

/**
 * Comprehensive scan and fix of all yellow colors
 */
function eliminateAllYellowColors(): void {
  if (isRunning) return;
  
  isRunning = true;
  
  try {
    // Target ALL elements in the DOM
    const allElements = document.querySelectorAll('*');
    
    allElements.forEach(element => {
      if (element instanceof HTMLElement) {
        fixElementColors(element);
      }
    });
    
    // Also specifically target known problematic selectors
    const specificSelectors = [
      '[class*="yellow"]', '[class*="amber"]', '[class*="orange"]', '[class*="warning"]',
      '[class*="alert"]', '[class*="danger"]', '[class*="error"]', '[class*="404"]',
      '[style*="yellow"]', '[style*="gold"]', '[style*="amber"]', '[style*="orange"]',
      '[style*="#ff"]', '[style*="rgb(255"]', '.alert', '.warning', '.error', '.not-found'
    ];
    
    specificSelectors.forEach(selector => {
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
          if (element instanceof HTMLElement) {
            fixElementColors(element);
          }
        });
      } catch (error) {
        // Ignore invalid selectors
      }
    });
    
  } catch (error) {
    console.error('Error in yellow color elimination:', error);
  } finally {
    isRunning = false;
  }
}

/**
 * Start the comprehensive yellow color elimination system
 */
export function startYellowColorElimination(): void {
  // Run immediately
  eliminateAllYellowColors();
  
  // Run every 500ms for ultra-aggressive monitoring (reduced from 1 second)
  eliminatorInterval = setInterval(() => {
    eliminateAllYellowColors();
  }, 500);
  
  // Set up mutation observer for real-time monitoring
  observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      // Check added nodes
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLElement) {
          fixElementColors(node);
          // Also check all child elements
          const childElements = node.querySelectorAll('*');
          childElements.forEach(child => {
            if (child instanceof HTMLElement) {
              fixElementColors(child);
            }
          });
        }
      });
      
      // Check attribute changes
      if (mutation.type === 'attributes' && mutation.target instanceof HTMLElement) {
        fixElementColors(mutation.target);
      }
    });
  });
  
  // Start observing with enhanced options
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style', 'class', 'data-state', 'aria-selected', 'role']
  });
  
  // Run on DOM content loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', eliminateAllYellowColors);
  }
  
  // Run on window load
  window.addEventListener('load', eliminateAllYellowColors);
  
  // Enhanced tab change detection
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target && (target.matches('[role="tab"]') || target.closest('[role="tab"]'))) {
      // Immediate yellow elimination on tab clicks
      setTimeout(() => eliminateAllYellowColors(), 0);
      setTimeout(() => eliminateAllYellowColors(), 50);
      setTimeout(() => eliminateAllYellowColors(), 100);
    }
  });
  
  // Enhanced state change detection
  document.addEventListener('DOMNodeInserted', eliminateAllYellowColors);
  
  // Run on route changes
  window.addEventListener('popstate', eliminateAllYellowColors);
  
  console.log('Comprehensive yellow color elimination system started');
}

/**
 * Stop the yellow color elimination system
 */
export function stopYellowColorElimination(): void {
  if (eliminatorInterval) {
    clearInterval(eliminatorInterval);
    eliminatorInterval = null;
  }
  
  if (observer) {
    observer.disconnect();
    observer = null;
  }
  
  console.log('Yellow color elimination system stopped');
}

/**
 * Force run yellow color elimination
 */
export function forceEliminateYellowColors(): void {
  eliminateAllYellowColors();
}