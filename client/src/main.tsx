import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { startYellowColorElimination } from "./lib/yellowColorEliminator";

// NUCLEAR YELLOW PREVENTION - INJECT BEFORE RENDER
const antiYellowStyles = `
/* IMMEDIATE YELLOW BLOCKING - HIGHEST PRIORITY */
* { 
  transition: none !important; 
  animation: none !important;
}
*[style*="yellow"], *[style*="rgb(255,255,0)"], *[style*="rgb(255, 255, 0)"],
*[style*="#ffff00"], *[style*="#ff0"], *[style*="gold"], *[style*="amber"],
.bg-yellow-50, .bg-yellow-100, .bg-yellow-200, .bg-yellow-300, .bg-yellow-400, .bg-yellow-500,
.bg-amber-50, .bg-amber-100, .bg-amber-200, .bg-amber-300, .bg-amber-400, .bg-amber-500,
[class*="yellow"], [class*="amber"], [class*="orange"], [class*="warning"] {
  background-color: #ffffff !important;
  background: #ffffff !important;
  color: #1e293b !important;
  border-color: #e2e8f0 !important;
  transition: none !important;
  animation: none !important;
}
[role="tab"], [role="tabpanel"], [data-state*="active"], [data-state*="inactive"],
[aria-selected="true"], [aria-selected="false"] {
  background-color: #ffffff !important;
  background: #ffffff !important;
  transition: none !important;
  animation: none !important;
}
/* FORCE OVERRIDE ANY COMPUTED YELLOW DURING RENDERING */
body, html { background-color: #ffffff !important; }
`;

// Inject styles BEFORE any rendering occurs
const styleElement = document.createElement('style');
styleElement.textContent = antiYellowStyles;
document.head.insertBefore(styleElement, document.head.firstChild);

// Start yellow color elimination system immediately
startYellowColorElimination();

createRoot(document.getElementById("root")!).render(<App />);
