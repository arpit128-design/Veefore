import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Lightweight initialization
console.log("VeeFore app started");

createRoot(document.getElementById("root")!).render(<App />);
