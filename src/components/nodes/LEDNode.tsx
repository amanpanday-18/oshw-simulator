"use client";

import React from 'react';
import { CircuitComponent } from '@/types/circuit';
import { useCircuit } from '@/context/CircuitContext';

// Pins on the LED component itself
const LED_PINS = [
    { id: 'ANODE', label: '+', x: 10, y: 70 }, // Long leg
    { id: 'CATHODE', label: '-', x: 30, y: 70 } // Short leg
];

export default function LEDNode({ component }: { component: CircuitComponent }) {
    const { pinStates, wires } = useCircuit();

    // Find which wire connects to the Anode
    const anodeWire = wires.find(w => w.toCompId === component.id && w.toPinId === 'ANODE');
    // Check that connected pin's state from Arduino
    const isOn = anodeWire ? pinStates[anodeWire.fromPinId] === 1 : false;

    return (
        <div className="led-node group">
            {/* Bulb */}
            <div className={`led-bulb ${isOn ? 'on' : 'off'}`}>
                <div className="led-reflection" />
            </div>

            {/* Legs */}
            <div className="led-legs">
                <div className="led-leg long" /> {/* Long */}
                <div className="led-leg short" /> {/* Short */}
            </div>

            {/* Pin Connection Label - Only show if connected */}
            {anodeWire && (
                <div className="led-label">
                    Anode &larr; {anodeWire.fromPinId}
                </div>
            )}
        </div>
    );
}
