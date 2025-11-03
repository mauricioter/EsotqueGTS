import React, { useState, useEffect } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("theme") || "light";
    } catch {
      return "light";
    }
  });

  useEffect(() => {
    // Apply theme when mounted or changed
    const root = document.documentElement;
    const body = document.body;

    if (theme === "dark") {
      root.classList.add("theme-dark");
      body.classList.add("theme-dark");
    } else {
      root.classList.remove("theme-dark");
      body.classList.remove("theme-dark");
    }
    
    // Force CSS variables update
    const vars = theme === "dark" ? {
      "--bg": "#0f1724",
      "--card": "#0b1220",
      "--text": "#e6eef8",
      "--primary": "#7c5cff",
      "--muted": "#64748b"
    } : {
      "--bg": "#f3f4f6",
      "--card": "#ffffff", 
      "--text": "#0f172a",
      "--primary": "#4f46e5",
      "--muted": "#64748b"
    };

    Object.entries(vars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    
    try {
      localStorage.setItem("theme", theme);
    } catch (e) {
      console.error("Failed to save theme", e);
    }
  }, [theme]);

  function toggle() {
    setTheme(current => current === "dark" ? "light" : "dark");
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <label className="theme-toggle" title="Alternar tema">
        <input 
          type="checkbox" 
          aria-label="Alternar tema"
          checked={theme === "dark"}
          onChange={toggle}
        />
        <span className="track">
          <span className="knob" />
        </span>
      </label>
      <span style={{ fontSize: 13, color: 'var(--muted)' }}>
        {theme === 'dark' ? 'Modo escuro' : 'Modo claro'}
      </span>
    </div>
  );
}
