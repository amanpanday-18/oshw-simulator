"use client";

import React from 'react';
import { CircuitComponent } from '@/types/circuit';
import { useCircuit } from '@/context/CircuitContext';

const PINS = [
    { id: 'IOREF', x: 20, y: 10 },
    { id: 'RESET', x: 30, y: 10 },
    { id: '3.3V', x: 40, y: 10 },
    { id: '5V', x: 50, y: 10, type: 'power' },
    { id: 'GND1', x: 60, y: 10, type: 'gnd' },
    { id: 'GND2', x: 70, y: 10, type: 'gnd' },
    { id: 'Vin', x: 80, y: 10 },
    // Analog
    { id: 'A0', x: 95, y: 10 },
    { id: 'A1', x: 105, y: 10 },
    { id: 'A2', x: 115, y: 10 },
    { id: 'A3', x: 125, y: 10 },
    { id: 'A4', x: 135, y: 10 },
    { id: 'A5', x: 145, y: 10 },
    // Digital
    { id: 'D0', x: 160, y: 170 },
    { id: 'D1', x: 150, y: 170 },
    { id: 'D2', x: 140, y: 170 },
    { id: 'D3', x: 130, y: 170 },
    { id: 'D4', x: 120, y: 170 },
    { id: 'D5', x: 110, y: 170 },
    { id: 'D6', x: 100, y: 170 },
    { id: 'D7', x: 90, y: 170 },
    { id: 'D8', x: 75, y: 170 },
    { id: 'D9', x: 65, y: 170 },
    { id: 'D10', x: 55, y: 170 },
    { id: 'D11', x: 45, y: 170 },
    { id: 'D12', x: 35, y: 170 },
    { id: 'D13', x: 25, y: 170 },
    { id: 'GND3', x: 15, y: 170, type: 'gnd' },
    { id: 'AREF', x: 5, y: 170 },
];

export default function ArduinoNode({ component }: { component: CircuitComponent }) {
    const { wires } = useCircuit();

    return (
        <div className="arduino-node">
            {/* USB Port */}
            <div className="arduino-usb" />
            {/* Power Jack */}
            <div className="arduino-power" />

            <div className="arduino-label">ARDUINO</div>
            <div className="arduino-sublabel">UNO</div>

            {/* Chip */}
            <div className="arduino-chip">
                <div className="chip-dot" />
                <div className="chip-text">ATMEGA328P</div>
            </div>

            {/* Pins Render Only (Logic handled by wiring system later) */}
            {/* We represent pins as absolute positioned dots for visual reference */}
            {PINS.map(pin => {
                // Determine label text (clean up IDs)
                let label = pin.id;
                if (label.startsWith('GND')) label = 'GND';
                if (label.startsWith('D')) label = label; // Keep D0, D1 etc
                if (label === '3.3V') label = '3.3V';
                if (label === '5V') label = '5V';

                // Determine position
                // Top row (y=10) -> Label below
                // Bottom row (y=170) -> Label above
                const isTopRow = pin.y < 50;
                const labelY = isTopRow ? pin.y + 10 : pin.y - 10;

                return (
                    <React.Fragment key={pin.id}>
                        <div
                            title={pin.id}
                            className="pin-dot"
                            style={{ left: pin.x, top: pin.y }}
                        />
                        <div
                            className="pin-label-text"
                            style={{
                                left: pin.x + 4, // Center on the dot (dot is 8px wide, so center is +4)
                                top: labelY
                            }}
                        >
                            {label}
                        </div>
                    </React.Fragment>
                );
            })}



        </div>
    );
}
