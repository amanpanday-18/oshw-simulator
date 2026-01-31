"use client";

import React, { useState, useEffect, useRef } from 'react';
import { CircuitComponent } from '@/types/circuit';
import { useCircuit } from '@/context/CircuitContext';

export default function PotentiometerNode({ component }: { component: CircuitComponent }) {
    const { setPinState, isRunning, wires } = useCircuit();
    const [value, setValue] = useState(0); // 0 to 1023
    const knobRef = useRef<HTMLDivElement>(null);

    // Calculate rotation based on value (0-1023 -> -135deg to +135deg)
    const rotation = (value / 1023) * 270 - 135;

    const handleWheel = (e: React.WheelEvent) => {
        // Prevent page scroll
        // e.preventDefault(); // React synthetic event can't always prevent default passive on wheel

        const delta = e.deltaY > 0 ? -50 : 50; // Scroll down = decrease, Up = increase
        let newValue = value + delta;
        if (newValue < 0) newValue = 0;
        if (newValue > 1023) newValue = 1023;

        setValue(newValue);
        updateCircuit(newValue);
    };

    const updateCircuit = (val: number) => {
        if (isRunning) {
            const wire = wires.find(w => w.fromCompId === component.id && w.fromPinId === 'SIG');
            if (wire) {
                // Analog write to the specific pin (e.g., A0)
                setPinState(wire.toPinId, val);
            }
        }
    };

    const lastY = useRef<number | null>(null);

    const handleTouchStart = (e: React.TouchEvent) => {
        e.stopPropagation(); // Prevent component drag
        lastY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        e.stopPropagation(); // Prevent component drag
        if (lastY.current !== null) {
            const currentY = e.touches[0].clientY;
            const deltaY = lastY.current - currentY; // Up = active/increase, Down = decrease

            // Sensitivity: 5 units per pixel moved
            const change = deltaY * 5;

            let newValue = value + change;
            if (newValue < 0) newValue = 0;
            if (newValue > 1023) newValue = 1023;

            setValue(newValue);
            updateCircuit(newValue);
            lastY.current = currentY;
        }
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        e.stopPropagation();
        lastY.current = null;
    };

    return (
        <div
            className="pot-node"
            onWheel={handleWheel}
        >
            {/* Label */}
            <div className="pot-label">POT (10K)</div>

            {/* Knob Body */}
            <div
                ref={knobRef}
                className="pot-knob"
                style={{ transform: `rotate(${rotation}deg)` }}
                title="Scroll or Drag to rotate"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {/* Indicator Marker */}
                <div className="pot-marker" />
            </div>

            {/* Legs */}
            <div className="pot-legs">
                <div className="pot-leg" title="GND" />
                <div className="pot-leg" title="SIG" />
                <div className="pot-leg" title="VCC" />
            </div>

            {/* Value Tooltip on Hover */}
            <div className="pot-value">
                Val: {Math.round(value)}
            </div>
        </div>
    );
}
