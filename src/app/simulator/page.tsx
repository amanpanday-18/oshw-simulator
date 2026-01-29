"use client";

import { CircuitProvider } from "@/context/CircuitContext";
import Workbench from "@/components/Workbench";

export default function Home() {
  return (
    <CircuitProvider>
      <main className="app-container">
        <header className="app-header">
          <div className="header-brand">
            <div className="logo">
              <div className="logo-dot" />
            </div>
            <h1>OSHW Simulator <span className="version">v0.1.0</span></h1>
          </div>
          <div className="header-meta">FOSSEE Semester Internship 2026 Screening Task</div>
        </header>

        <Workbench />
      </main>
    </CircuitProvider>
  );
}
