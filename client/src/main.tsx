import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { startYellowColorElimination } from "./lib/yellowColorEliminator";

// Start yellow color elimination system immediately
startYellowColorElimination();

createRoot(document.getElementById("root")!).render(<App />);
