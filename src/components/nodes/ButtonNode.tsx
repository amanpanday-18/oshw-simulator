"use client";

import React, { useState } from 'react';
import { CircuitComponent } from '@/types/circuit';
import { useCircuit } from '@/context/CircuitContext';

export default function ButtonNode({ component }: { component: CircuitComponent }) {
    const { setPinState, isRunning, wires } = useCircuit();
    const [isPressed, setIsPressed] = useState(false);

    const getConnectedPin = () => {
        // Find wire connected to this button's OUT pin
        const wire = wires.find(w => w.fromCompId === component.id && w.fromPinId === 'OUT');
        return wire ? wire.toPinId : null; // returns e.g. "D2"
    };

    const handleMouseDown = () => {
        setIsPressed(true);
        if (isRunning) {
            const targetPin = getConnectedPin();
            if (targetPin) {
                setPinState(targetPin, 1);
            }
        }
    };

    const handleMouseUp = () => {
        setIsPressed(false);
        if (isRunning) {
            const targetPin = getConnectedPin();
            if (targetPin) {
                setPinState(targetPin, 0); // Reset to LOW
            }
        }
    };

    return (
        <div
            className="button-node"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            {/* Housing */}
            <div className="button-housing">
                {/* Plunger */}
                <div className={`button-plunger ${isPressed ? 'pressed' : 'released'}`} />
            </div>

            {/* Legs (Decorative) */}
            <div className="button-leg leg-left" />
            <div className="button-leg leg-right" />
            <div className="button-leg leg-top" />
            <div className="button-leg leg-bottom" />

            {/* Debug Label (Optional) */}
            {/* <div className="absolute -bottom-4 text-[8px] text-white/50 w-20 text-center">
          btn to {getConnectedPin() || 'nc'}
      </div> */}
        </div>
    );
}
