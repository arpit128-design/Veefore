import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { startYellowColorElimination } from "./lib/yellowColorEliminator";

// PRECISE YELLOW ELIMINATION - PRESERVE OTHER COLORS + HIDE DEBUG ELEMENTS
const antiYellowStyles = `
/* TARGETED YELLOW BLOCKING - PRESERVE BLUE, GREEN, PURPLE */
*[style*="background-color: yellow"], *[style*="background: yellow"],
*[style*="background-color: #ffff00"], *[style*="background: #ffff00"],
*[style*="background-color: rgb(255, 255, 0)"], *[style*="background: rgb(255, 255, 0)"],
*[style*="background-color: gold"], *[style*="background: gold"],
.bg-yellow-50, .bg-yellow-100, .bg-yellow-200, .bg-yellow-300, .bg-yellow-400, .bg-yellow-500,
.bg-amber-50, .bg-amber-100, .bg-amber-200, .bg-amber-300, .bg-amber-400, .bg-amber-500 {
  background-color: #ffffff !important;
  background: #ffffff !important;
  color: #1e293b !important;
  border-color: #e2e8f0 !important;
  transition: background-color 0ms !important;
}
/* PREVENT YELLOW TAB FLICKER ONLY */
[role="tab"][style*="yellow"], [role="tab"][style*="rgb(255,255,0)"], [role="tab"][style*="#ffff00"],
[role="tabpanel"][style*="yellow"], [role="tabpanel"][style*="rgb(255,255,0)"], [role="tabpanel"][style*="#ffff00"] {
  background-color: #ffffff !important;
  background: #ffffff !important;
  transition: none !important;
}

/* HIDE POTENTIAL DEBUG ELEMENTS - SAFE VERSION */
[data-testid*="debug"], [class*="debug"], [id*="debug"],
[data-testid*="inspector"], [class*="inspector"], [id*="inspector"],
[data-testid*="devtools"], [class*="devtools"], [id*="devtools"],
.__react-inspector, .__react-devtools, .__react-debug,
[data-react-devtools], [data-react-inspector] {
  display: none !important;
  opacity: 0 !important;
  visibility: hidden !important;
  pointer-events: none !important;
}

/* SPECIFICALLY TARGET GREY BOX ISSUE - HIDE DUPLICATE TEXT ELEMENTS */
.comment-to-dm-automation *:not(.InstagramDMPreview) div[style*="background-color: rgb(229, 231, 235)"]:not([class]),
.comment-to-dm-automation *:not(.InstagramDMPreview) div[style*="background-color: #e5e7eb"]:not([class]),
.comment-to-dm-automation *:not(.InstagramDMPreview) div[style*="background: rgb(229, 231, 235)"]:not([class]),
.comment-to-dm-automation *:not(.InstagramDMPreview) div[style*="background: #e5e7eb"]:not([class]),
/* Target any grey background div that might be duplicating text */
.comment-to-dm-automation div[style*="background-color: rgb(229, 231, 235)"][style*="border-radius"],
.comment-to-dm-automation div[style*="background-color: #e5e7eb"][style*="border-radius"],
.comment-to-dm-automation div[style*="background: rgb(229, 231, 235)"][style*="border-radius"],
.comment-to-dm-automation div[style*="background: #e5e7eb"][style*="border-radius"],
/* Target any div with grey background that contains only text */
.comment-to-dm-automation div[style*="background-color: rgb(229, 231, 235)"]:not([class]):not([id]):empty,
.comment-to-dm-automation div[style*="background-color: #e5e7eb"]:not([class]):not([id]):empty,
/* Target divs that might be appearing as state displays */
.comment-to-dm-automation div[style*="position: absolute"][style*="background"],
.comment-to-dm-automation div[style*="position: fixed"][style*="background"] {
  display: none !important;
  opacity: 0 !important;
  visibility: hidden !important;
}
`;

// Inject styles BEFORE any rendering occurs
const styleElement = document.createElement('style');
styleElement.textContent = antiYellowStyles;
document.head.insertBefore(styleElement, document.head.firstChild);

// Start yellow color elimination system immediately
startYellowColorElimination();

// Grey box eliminator specifically for DM automation page
const greyBoxEliminator = () => {
  const removeGreyBoxes = () => {
    const commentAutomationContainer = document.querySelector('.comment-to-dm-automation');
    if (commentAutomationContainer) {
      // Find all potential grey boxes
      const greyElements = commentAutomationContainer.querySelectorAll('*');
      
      greyElements.forEach(element => {
        const style = window.getComputedStyle(element);
        const backgroundColor = style.backgroundColor;
        
        // Check if it's a grey box (rgb(229, 231, 235) or similar)
        if (backgroundColor.includes('rgb(229, 231, 235)') || 
            backgroundColor.includes('#e5e7eb') ||
            backgroundColor.includes('229, 231, 235')) {
          
          // Skip if it's part of the legitimate DM preview
          if (element.closest('.InstagramDMPreview')) return;
          
          // Skip if it has important classes or roles
          if (element.classList.length > 0 || element.getAttribute('role')) return;
          
          // Check if this element might be duplicating text
          const text = element.textContent?.trim();
          if (text && text.length > 0 && text.length < 50) {
            // Check if there's a text input nearby with the same value
            const inputs = document.querySelectorAll('input[type="text"], textarea');
            const hasDuplicateInput = Array.from(inputs).some(input => 
              (input as HTMLInputElement).value === text
            );
            
            if (hasDuplicateInput) {
              console.log('Grey box eliminator: Hiding duplicate text element:', text);
              (element as HTMLElement).style.display = 'none';
              (element as HTMLElement).style.opacity = '0';
              (element as HTMLElement).style.visibility = 'hidden';
            }
          }
        }
      });
    }
  };

  // Run immediately and then every 100ms when on the DM automation page
  if (window.location.pathname.includes('comment-to-dm-automation')) {
    removeGreyBoxes();
    setInterval(removeGreyBoxes, 100);
    
    // Also run on input events
    document.addEventListener('input', removeGreyBoxes);
  }
};

// Start grey box elimination
setTimeout(greyBoxEliminator, 500);

createRoot(document.getElementById("root")!).render(<App />);
