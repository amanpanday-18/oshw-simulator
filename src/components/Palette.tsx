"use client";

import React from 'react';
import { Cpu, Lightbulb, ToggleLeft, Gauge } from 'lucide-react';
import { ComponentType } from '@/types/circuit';
import { useCircuit } from '@/context/CircuitContext';

export default function Palette() {
    const { addComponent } = useCircuit();

    const onDragStart = (e: React.DragEvent, type: ComponentType) => {
        e.dataTransfer.setData('componentType', type);
        e.dataTransfer.effectAllowed = 'copy';
    };

    const handleClick = (type: ComponentType) => {
        // Add to safer position for mobile (top-left ish)
        addComponent(type, 100, 50);
    };

    const PaletteItem = ({ type, icon: Icon, label }: { type: ComponentType, icon: any, label: string }) => (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, type)}
            onClick={() => handleClick(type)}
            className="palette-item group active:scale-95 transition-transform"
        >
            <div className="item-icon">
                <Icon size={20} />
            </div>
            <div className="flex flex-col">
                <span className="item-label">{label}</span>
                <span className="text-[10px] text-gray-500 md:hidden">(Tap to add)</span>
            </div>
        </div>
    );

    return (
        <div className="p-4">
            <h2 className="palette-header">Components</h2>

            <div className="space-y-1">
                <PaletteItem type="ARDUINO_UNO" icon={Cpu} label="Arduino Uno" />
                <PaletteItem type="LED" icon={Lightbulb} label="LED (Red)" />
                <PaletteItem type="PUSH_BUTTON" icon={ToggleLeft} label="Push Button" />
                <PaletteItem type="POTENTIOMETER" icon={Gauge} label="Potentiometer" />
            </div>

            <div className="instructions">
                <strong className="block mb-2" style={{ color: '#60a5fa' }}>Instructions:</strong>
                <ol style={{ paddingLeft: '1rem', listStyleType: 'decimal' }}>
                    <li>Drag (Desktop) or <strong>Tap</strong> (Mobile) components.</li>
                    <li>Click <span style={{ color: '#4ade80', fontFamily: 'monospace' }}>Run</span>.</li>
                    <li><strong>Interact</strong> with components on canvas.</li>
                </ol>
            </div>
        </div>
    );
}
