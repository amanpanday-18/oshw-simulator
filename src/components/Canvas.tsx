"use client";

import React, { useRef, useState } from 'react';
import { useCircuit } from '@/context/CircuitContext';
import { CircuitComponent, ComponentType } from '@/types/circuit';
import ArduinoNode from './nodes/ArduinoNode';
import LEDNode from './nodes/LEDNode';
import ButtonNode from './nodes/ButtonNode';

// Map component types to their React component
const COMPONENT_MAP: Record<ComponentType, React.FC<{ component: CircuitComponent }>> = {
    ARDUINO_UNO: ArduinoNode,
    LED: LEDNode,
    PUSH_BUTTON: ButtonNode,
};

// Helper to get pin absolute position (Simplified hardcoded offsets for prototype)
// In a real app, components would register their pin positions
const getPinPosition = (comp: CircuitComponent, pinId: string) => {
    // Default center
    let x = comp.x + 20;
    let y = comp.y + 20;

    if (comp.type === 'ARDUINO_UNO') {
        // We know pin positions relative to top-left of Arduino
        // This MUST match the PINS array in ArduinoNode.tsx
        // D13 = x:25, y:170; D10 = x:55, y:170; D2 = x:140, y:170
        // Power: 5V = x:50, y:10; GND(power) = x:60, y:10
        const offsets: Record<string, { x: number, y: number }> = {
            'D13': { x: 25, y: 170 }, 'D12': { x: 35, y: 170 }, 'D11': { x: 45, y: 170 },
            'D10': { x: 55, y: 170 }, 'D9': { x: 65, y: 170 }, 'D8': { x: 75, y: 170 },
            'D7': { x: 90, y: 170 }, 'D6': { x: 100, y: 170 }, 'D5': { x: 110, y: 170 },
            'D4': { x: 120, y: 170 }, 'D3': { x: 130, y: 170 }, 'D2': { x: 140, y: 170 },
            'GND1': { x: 60, y: 10 }, 'GND2': { x: 70, y: 10 }, 'GND3': { x: 15, y: 170 },
            '5V': { x: 50, y: 10 }
        };
        const offset = offsets[pinId];
        if (offset) {
            return { x: comp.x + offset.x + 4, y: comp.y + offset.y + 4 }; // +4 for pin center (size-2/2)
        }
    }

    if (comp.type === 'LED') {
        // ANODE: x:10, y:70; CATHODE: x:30, y:70
        if (pinId === 'ANODE') return { x: comp.x + 10 + 2, y: comp.y + 70 + 2 };
        if (pinId === 'CATHODE') return { x: comp.x + 30 + 2, y: comp.y + 70 + 2 };
    }

    if (comp.type === 'PUSH_BUTTON') {
        // Just say OUT is on the right side
        // Center x=24, y=24
        if (pinId === 'OUT') return { x: comp.x + 48, y: comp.y + 24 }; // Right edge
        if (pinId === 'IN') return { x: comp.x, y: comp.y + 24 }; // Left edge
    }

    return { x, y };
};

export default function Canvas() {
    const { components, wires, addComponent, updateComponentPos } = useCircuit();
    const canvasRef = useRef<HTMLDivElement>(null);
    const [draggingId, setDraggingId] = useState<string | null>(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const type = e.dataTransfer.getData('componentType') as ComponentType;
        if (type && canvasRef.current) {
            const rect = canvasRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left - 50; // Center drop
            const y = e.clientY - rect.top - 50;
            addComponent(type, x, y);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    // Component Dragging Logic
    const startDrag = (e: React.MouseEvent, id: string, curX: number, curY: number) => {
        e.stopPropagation(); // Prevent canvas drag if we implemented panning
        setDraggingId(id);
        setOffset({
            x: e.clientX - curX,
            y: e.clientY - curY
        });
    };

    const onMouseMove = (e: React.MouseEvent) => {
        if (draggingId) {
            updateComponentPos(draggingId, e.clientX - offset.x, e.clientY - offset.y);
        }
    };

    const stopDrag = () => {
        setDraggingId(null);
    };

    return (
        <div
            ref={canvasRef}
            className="canvas-container"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onMouseMove={onMouseMove}
            onMouseUp={stopDrag}
            onMouseLeave={stopDrag}
        >
            {/* Wires Layer (SVG) */}
            <svg className="wires-layer">
                {wires.map(wire => {
                    const fromComp = components.find(c => c.id === wire.fromCompId);
                    const toComp = components.find(c => c.id === wire.toCompId);
                    if (!fromComp || !toComp) return null;

                    const start = getPinPosition(fromComp, wire.fromPinId);
                    const end = getPinPosition(toComp, wire.toPinId);

                    // Simple bezier curve
                    const dx = Math.abs(end.x - start.x);
                    const controlPointOffset = Math.max(dx * 0.5, 50);
                    const path = `M ${start.x} ${start.y} C ${start.x} ${start.y + controlPointOffset}, ${end.x} ${end.y + controlPointOffset}, ${end.x} ${end.y}`;

                    return (
                        <g key={wire.id}>
                            <path
                                d={path}
                                stroke={wire.color}
                                strokeWidth="3"
                                fill="none"
                                strokeLinecap="round"
                                className="wire-path"
                            />
                            {/* Wire ends dots */}
                            <circle cx={start.x} cy={start.y} r="3" fill={wire.color} />
                            <circle cx={end.x} cy={end.y} r="3" fill={wire.color} />
                        </g>
                    );
                })}
            </svg>

            {/* Components Layer */}
            {components.map(comp => {
                const Component = COMPONENT_MAP[comp.type];
                return (
                    <div
                        key={comp.id}
                        className="component-node"
                        style={{
                            left: comp.x,
                            top: comp.y,
                        }}
                        onMouseDown={(e) => startDrag(e, comp.id, comp.x, comp.y)}
                    >
                        <Component component={comp} />
                    </div>
                );
            })}
        </div>
    );
}
