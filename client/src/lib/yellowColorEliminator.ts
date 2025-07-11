/**
 * Comprehensive Yellow Color Eliminator
 * Runtime script to detect and eliminate ALL yellow colors from the DOM
 * This runs continuously to prevent any yellow contamination
 */

let isRunning = false;
let eliminatorInterval: NodeJS.Timeout | null = null;

// List of yellow-like color patterns to detect
const YELLOW_PATTERNS = [
  // RGB patterns
  /rgb\(\s*255,\s*255,\s*0\)/gi,
  /rgb\(\s*255,\s*247,\s*0\)/gi,
  /rgb\(\s*255,\s*235,\s*0\)/gi,
  /rgb\(\s*255,\s*223,\s*0\)/gi,
  /rgb\(\s*255,\s*215,\s*0\)/gi,
  /rgb\(\s*255,\s*207,\s*0\)/gi,
  /rgb\(\s*255,\s*193,\s*7\)/gi,
  /rgb\(\s*255,\s*185,\s*0\)/gi,
  /rgb\(\s*255,\s*165,\s*0\)/gi,
  /rgb\(\s*255,\s*140,\s*0\)/gi,
  /rgb\(\s*255,\s*127,\s*0\)/gi,
  /rgb\(\s*255,\s*69,\s*0\)/gi,
  /rgb\(\s*255,\s*255,\s*224\)/gi,
  /rgb\(\s*255,\s*255,\s*240\)/gi,
  /rgb\(\s*255,\s*250,\s*205\)/gi,
  /rgb\(\s*255,\s*248,\s*220\)/gi,
  /rgb\(\s*255,\s*245,\s*238\)/gi,
  /rgb\(\s*254,\s*252,\s*191\)/gi,
  /rgb\(\s*254,\s*249,\s*195\)/gi,
  /rgb\(\s*254,\s*240,\s*138\)/gi,
  /rgb\(\s*253,\s*230,\s*138\)/gi,
  /rgb\(\s*252,\s*211,\s*77\)/gi,
  /rgb\(\s*251,\s*191,\s*36\)/gi,
  /rgb\(\s*245,\s*158,\s*11\)/gi,
  /rgb\(\s*217,\s*119,\s*6\)/gi,
  /rgb\(\s*180,\s*83,\s*9\)/gi,
  /rgb\(\s*146,\s*64,\s*14\)/gi,
  /rgb\(\s*120,\s*53,\s*15\)/gi,
  /rgb\(\s*69,\s*26,\s*3\)/gi,
  
  // Hex patterns
  /#ffff00/gi,
  /#fff000/gi,
  /#ffe000/gi,
  /#ffd000/gi,
  /#ffc000/gi,
  /#ffb000/gi,
  /#ffa000/gi,
  /#ff9000/gi,
  /#ff8000/gi,
  /#ff7000/gi,
  /#ff6000/gi,
  /#ff5000/gi,
  /#ff4000/gi,
  /#ff3000/gi,
  /#ff2000/gi,
  /#ff1000/gi,
  /#fef3c7/gi,
  /#fde68a/gi,
  /#fcd34d/gi,
  /#f59e0b/gi,
  /#d97706/gi,
  /#b45309/gi,
  /#92400e/gi,
  /#78350f/gi,
  /#451a03/gi,
  /#fffbeb/gi,
  
  // HSL patterns
  /hsl\(\s*60,\s*100%,\s*50%\)/gi,
  /hsl\(\s*55,\s*100%,\s*50%\)/gi,
  /hsl\(\s*50,\s*100%,\s*50%\)/gi,
  /hsl\(\s*45,\s*100%,\s*50%\)/gi,
  /hsl\(\s*40,\s*100%,\s*50%\)/gi,
  /hsl\(\s*35,\s*100%,\s*50%\)/gi,
  /hsl\(\s*30,\s*100%,\s*50%\)/gi,
  /hsl\(\s*25,\s*100%,\s*50%\)/gi,
  /hsl\(\s*20,\s*100%,\s*50%\)/gi,
  /hsl\(\s*15,\s*100%,\s*50%\)/gi,
  /hsl\(\s*10,\s*100%,\s*50%\)/gi,
  
  // Color name patterns
  /yellow/gi,
  /gold/gi,
  /amber/gi,
  /orange/gi,
];

/**
 * Check if a color value is yellow-like
 */
function isYellowColor(color: string): boolean {
  if (!color) return false;
  
  // Check against patterns
  for (const pattern of YELLOW_PATTERNS) {
    if (pattern.test(color)) {
      return true;
    }
  }
  
  // Check RGB values directly
  const rgbMatch = color.match(/rgb\(\s*(\d+),\s*(\d+),\s*(\d+)\)/);
  if (rgbMatch) {
    const [, r, g, b] = rgbMatch.map(Number);
    // Check if it's yellow-like (high red and green, low blue)
    if (r > 200 && g > 200 && b < 150) {
      return true;
    }
    // Check if it's amber-like (high red, medium-high green, low blue)
    if (r > 200 && g > 150 && b < 100) {
      return true;
    }
  }
  
  // Check HSL values
  const hslMatch = color.match(/hsl\(\s*(\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (hslMatch) {
    const [, h, s, l] = hslMatch.map(Number);
    // Check if hue is in yellow range (45-75 degrees)
    if (h >= 45 && h <= 75 && s > 50 && l > 30) {
      return true;
    }
  }
  
  return false;
}

/**
 * Fix yellow colors on a specific element
 */
function fixElementColors(element: HTMLElement): void {
  const computedStyle = window.getComputedStyle(element);
  
  // Check background color
  const backgroundColor = computedStyle.backgroundColor;
  if (isYellowColor(backgroundColor)) {
    element.style.setProperty('background-color', '#ffffff', 'important');
    element.style.setProperty('background', '#ffffff', 'important');
  }
  
  // Check color (text color)
  const textColor = computedStyle.color;
  if (isYellowColor(textColor)) {
    element.style.setProperty('color', '#1e293b', 'important');
  }
  
  // Check border color
  const borderColor = computedStyle.borderColor;
  if (isYellowColor(borderColor)) {
    element.style.setProperty('border-color', '#e2e8f0', 'important');
  }
  
  // Check inline styles
  const inlineStyle = element.getAttribute('style');
  if (inlineStyle) {
    let hasYellow = false;
    for (const pattern of YELLOW_PATTERNS) {
      if (pattern.test(inlineStyle)) {
        hasYellow = true;
        break;
      }
    }
    
    if (hasYellow) {
      element.style.setProperty('background-color', '#ffffff', 'important');
      element.style.setProperty('background', '#ffffff', 'important');
      element.style.setProperty('color', '#1e293b', 'important');
      element.style.setProperty('border-color', '#e2e8f0', 'important');
    }
  }
}

/**
 * Fix yellow colors on specific UI component types
 */
function fixSpecificComponents(): void {
  // Fix switches/toggles
  const switches = document.querySelectorAll('[role="switch"], [data-state], .switch, .toggle');
  switches.forEach(element => {
    if (element instanceof HTMLElement) {
      const computedStyle = window.getComputedStyle(element);
      if (isYellowColor(computedStyle.backgroundColor)) {
        element.style.setProperty('background-color', '#2563eb', 'important');
      }
    }
  });
  
  // Fix sliders
  const sliders = document.querySelectorAll('[role="slider"], .slider, [data-radix-slider-thumb], [data-radix-slider-range]');
  sliders.forEach(element => {
    if (element instanceof HTMLElement) {
      const computedStyle = window.getComputedStyle(element);
      if (isYellowColor(computedStyle.backgroundColor)) {
        element.style.setProperty('background-color', '#e2e8f0', 'important');
      }
    }
  });
  
  // Fix progress bars
  const progressBars = document.querySelectorAll('[role="progressbar"], .progress-bar, .progress');
  progressBars.forEach(element => {
    if (element instanceof HTMLElement) {
      const computedStyle = window.getComputedStyle(element);
      if (isYellowColor(computedStyle.backgroundColor)) {
        element.style.setProperty('background-color', '#e2e8f0', 'important');
      }
    }
  });
  
  // Fix buttons
  const buttons = document.querySelectorAll('button, [role="button"], .btn');
  buttons.forEach(element => {
    if (element instanceof HTMLElement) {
      const computedStyle = window.getComputedStyle(element);
      if (isYellowColor(computedStyle.backgroundColor)) {
        element.style.setProperty('background-color', '#ffffff', 'important');
        element.style.setProperty('border-color', '#e2e8f0', 'important');
        element.style.setProperty('color', '#1e293b', 'important');
      }
    }
  });
  
  // Fix cards
  const cards = document.querySelectorAll('.card, [class*="card"], .content-card');
  cards.forEach(element => {
    if (element instanceof HTMLElement) {
      const computedStyle = window.getComputedStyle(element);
      if (isYellowColor(computedStyle.backgroundColor)) {
        element.style.setProperty('background-color', '#ffffff', 'important');
        element.style.setProperty('border-color', '#e2e8f0', 'important');
      }
    }
  });
}

/**
 * Scan and fix all yellow colors in the DOM
 */
function eliminateYellowColors(): void {
  if (isRunning) return;
  
  isRunning = true;
  
  try {
    // Get all elements in the DOM
    const allElements = document.querySelectorAll('*');
    
    allElements.forEach(element => {
      if (element instanceof HTMLElement) {
        fixElementColors(element);
      }
    });
    
    // Fix specific component types
    fixSpecificComponents();
    
    // Fix any dynamically added elements
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            fixElementColors(node);
            
            // Also check child elements
            const childElements = node.querySelectorAll('*');
            childElements.forEach(child => {
              if (child instanceof HTMLElement) {
                fixElementColors(child);
              }
            });
          }
        });
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });
    
    // Store observer for cleanup
    (window as any).yellowColorObserver = observer;
    
  } catch (error) {
    console.error('Error in yellow color elimination:', error);
  } finally {
    isRunning = false;
  }
}

/**
 * Start the yellow color elimination system
 */
export function startYellowColorElimination(): void {
  // Run immediately
  eliminateYellowColors();
  
  // Run every 500ms to catch any new yellow colors
  eliminatorInterval = setInterval(() => {
    eliminateYellowColors();
  }, 500);
  
  // Also run on DOM changes
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', eliminateYellowColors);
  } else {
    eliminateYellowColors();
  }
  
  // Run on window load
  window.addEventListener('load', eliminateYellowColors);
  
  // Run on route changes (for SPAs)
  window.addEventListener('popstate', eliminateYellowColors);
  
  console.log('Yellow color elimination system started');
}

/**
 * Stop the yellow color elimination system
 */
export function stopYellowColorElimination(): void {
  if (eliminatorInterval) {
    clearInterval(eliminatorInterval);
    eliminatorInterval = null;
  }
  
  if ((window as any).yellowColorObserver) {
    (window as any).yellowColorObserver.disconnect();
    delete (window as any).yellowColorObserver;
  }
  
  console.log('Yellow color elimination system stopped');
}

/**
 * Force run yellow color elimination
 */
export function forceEliminateYellowColors(): void {
  eliminateYellowColors();
}