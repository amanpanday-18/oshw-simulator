"use client";

import React, { useState } from 'react';
import Palette from './Palette';
import Canvas from './Canvas';
import { Code, Play, RefreshCcw } from 'lucide-react';
import { useCircuit } from '@/context/CircuitContext';
import { generateArduinoCode } from '@/lib/codeGenerator';

export default function Workbench() {
    const { components, wires, toggleSimulation, isRunning } = useCircuit();
    const [showCode, setShowCode] = useState(true);

    const code = generateArduinoCode(components, wires);

    return (
        <div className="workbench">
            {/* Left Sidebar: Palette */}
            <div className="sidebar">
                <Palette />
            </div>

            {/* Center: Canvas */}
            <div className="canvas-area">
                <Canvas />

                {/* Floating Toolbar */}
                <div className="floating-toolbar">
                    <button
                        onClick={toggleSimulation}
                        className={`btn-primary ${isRunning ? 'btn-stop' : 'btn-run'}`}
                    >
                        {isRunning ? <RefreshCcw size={16} /> : <Play size={16} />}
                        {isRunning ? 'Stop' : 'Run'}
                    </button>
                    <div className="separator" />
                    <button
                        onClick={() => setShowCode(!showCode)}
                        className={`btn-icon-only ${showCode ? 'active' : ''}`}
                        title="Toggle Code View"
                    >
                        <Code size={20} />
                    </button>
                </div>
            </div>

            {/* Right Sidebar: Code Panel (Collapsible) */}
            <div className={`code-panel ${showCode ? 'open' : 'closed'}`}>
                <div className="code-header">
                    Generated Code
                </div>
                <div className="code-content custom-scrollbar">
                    {code}
                </div>
            </div>
        </div>
    );
}
