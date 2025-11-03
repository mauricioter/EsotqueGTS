import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";  // Importação global dos estilos

// Ensure theme from previous sessions is applied immediately before React mounts.
try {
	const stored = localStorage.getItem("theme");
	if (stored === "dark") {
		document.documentElement.classList.add("theme-dark");
		console.log('[main] Applied stored theme: dark');
	} else {
		document.documentElement.classList.remove("theme-dark");
		console.log('[main] Applied stored theme: light');
	}
} catch (e) {
	// ignore
}

createRoot(document.getElementById("root")!).render(<App />);
