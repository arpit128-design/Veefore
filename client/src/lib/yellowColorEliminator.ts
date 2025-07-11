/**
 * Comprehensive Yellow Color Eliminator
 * Aggressive script to detect and eliminate ALL yellow colors from the DOM
 * This runs continuously to prevent any yellow contamination
 */

let isRunning = false;
let eliminatorInterval: NodeJS.Timeout | null = null;
let observer: MutationObserver | null = null;

// Comprehensive list of ALL yellow-like color patterns
const YELLOW_PATTERNS = [
  // Color names
  /yellow/gi,
  /gold/gi,
  /amber/gi,
  /orange/gi,
  /warning/gi,
  
  // Hex patterns - all yellow variants
  /#ffff00/gi, /#fff000/gi, /#ffe000/gi, /#ffd000/gi, /#ffc000/gi, /#ffb000/gi,
  /#ffa000/gi, /#ff9000/gi, /#ff8000/gi, /#ff7000/gi, /#ff6000/gi, /#ff5000/gi,
  /#ff4000/gi, /#ff3000/gi, /#ff2000/gi, /#ff1000/gi, /#ff0/gi, /#ffd700/gi,
  /#ffc107/gi, /#ffeb3b/gi, /#fff3cd/gi, /#ffeaa7/gi, /#fdcb6e/gi, /#f39c12/gi,
  /#e67e22/gi, /#d35400/gi, /#fffbeb/gi, /#fef3c7/gi, /#fde68a/gi, /#fcd34d/gi,
  /#f59e0b/gi, /#d97706/gi, /#b45309/gi, /#92400e/gi, /#78350f/gi, /#451a03/gi,
  
  // RGB patterns - all yellow variants
  /rgb\(\s*255,\s*255,\s*0\s*\)/gi, /rgb\(\s*255,\s*215,\s*0\s*\)/gi,
  /rgb\(\s*255,\s*193,\s*7\s*\)/gi, /rgb\(\s*255,\s*235,\s*59\s*\)/gi,
  /rgb\(\s*255,\s*243,\s*205\s*\)/gi, /rgb\(\s*255,\s*234,\s*167\s*\)/gi,
  /rgb\(\s*253,\s*203,\s*110\s*\)/gi, /rgb\(\s*243,\s*156,\s*18\s*\)/gi,
  /rgb\(\s*230,\s*126,\s*34\s*\)/gi, /rgb\(\s*211,\s*84,\s*0\s*\)/gi,
  
  // HSL patterns - yellow hues
  /hsl\(\s*[4-7][0-9],\s*[5-9][0-9]%,\s*[3-9][0-9]%\s*\)/gi,
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
  
  // Check RGB values directly for yellow-like colors
  const rgbMatch = cleanColor.match(/rgb\(\s*(\d+),\s*(\d+),\s*(\d+)\s*\)/);
  if (rgbMatch) {
    const [, r, g, b] = rgbMatch.map(Number);
    // Detect yellow-like colors (high red and green, low blue)
    if (r > 200 && g > 150 && b < 150) {
      return true;
    }
  }
  
  // Check HSL values for yellow hues
  const hslMatch = cleanColor.match(/hsl\(\s*(\d+),\s*(\d+)%,\s*(\d+)%\s*\)/);
  if (hslMatch) {
    const [, h, s, l] = hslMatch.map(Number);
    // Yellow hue range: 45-75 degrees
    if (h >= 45 && h <= 75 && s > 30 && l > 20) {
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