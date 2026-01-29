"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { CircuitComponent, ComponentType, Wire, CircuitState } from '@/types/circuit';
import { v4 as uuidv4 } from 'uuid';

interface CircuitContextType extends CircuitState {
    addComponent: (type: ComponentType, x: number, y: number) => void;
    updateComponentPos: (id: string, x: number, y: number) => void;
    removeComponent: (id: string) => void;
    toggleSimulation: () => void;
    setPinState: (pinId: string, value: number) => void;
}

const CircuitContext = createContext<CircuitContextType | undefined>(undefined);

export function CircuitProvider({ children }: { children: ReactNode }) {
    const [components, setComponents] = useState<CircuitComponent[]>([]);
    const [wires, setWires] = useState<Wire[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [pinStates, setPinStates] = useState<Record<string, number>>({});

    // Auto-wiring logic helper
    const tryAutoWire = (newComp: CircuitComponent, currentComps: CircuitComponent[]) => {
        // If adding LED, try connecting to Arduino D10
        if (newComp.type === 'LED') {
            const arduino = currentComps.find(c => c.type === 'ARDUINO_UNO');
            if (arduino) {
                const newWire: Wire = {
                    id: uuidv4(),
                    fromCompId: arduino.id,
                    fromPinId: 'D10',
                    toCompId: newComp.id,
                    toPinId: 'ANODE',
                    color: 'red'
                };
                setWires(prev => [...prev, newWire]);
            }
        }
        // If adding Button, try connecting to Arduino D2
        if (newComp.type === 'PUSH_BUTTON') {
            const arduino = currentComps.find(c => c.type === 'ARDUINO_UNO');
            if (arduino) {
                const newWire: Wire = {
                    id: uuidv4(),
                    fromCompId: newComp.id,
                    fromPinId: 'OUT',
                    toCompId: arduino.id,
                    toPinId: 'D2',
                    color: 'green'
                };
                setWires(prev => [...prev, newWire]);
            }
        }

        // If adding Potentiometer, try connecting to Arduino A0
        if (newComp.type === 'POTENTIOMETER') {
            const arduino = currentComps.find(c => c.type === 'ARDUINO_UNO');
            if (arduino) {
                const newWire: Wire = {
                    id: uuidv4(),
                    fromCompId: newComp.id,
                    fromPinId: 'SIG',
                    toCompId: arduino.id,
                    toPinId: 'A0',
                    color: 'orange'
                };
                setWires(prev => [...prev, newWire]);
            }
        }

        // If adding Arduino, try connecting to existing components
        if (newComp.type === 'ARDUINO_UNO') {
            // Check for existing LED
            const led = currentComps.find(c => c.type === 'LED');
            if (led) {
                const newWire: Wire = {
                    id: uuidv4(),
                    fromCompId: newComp.id,
                    fromPinId: 'D10',
                    toCompId: led.id,
                    toPinId: 'ANODE',
                    color: 'red'
                };
                setWires(prev => {
                    // dedupe? For now just push. Prototyping.
                    return [...prev, newWire];
                });
            }
            // Check for existing Button
            const btn = currentComps.find(c => c.type === 'PUSH_BUTTON');
            if (btn) {
                const newWire: Wire = {
                    id: uuidv4(),
                    fromCompId: btn.id,
                    fromPinId: 'OUT',
                    toCompId: newComp.id,
                    toPinId: 'D2',
                    color: 'green'
                };
                setWires(prev => [...prev, newWire]);
            }
            // Check for existing Potentiometer
            const pot = currentComps.find(c => c.type === 'POTENTIOMETER');
            if (pot) {
                const newWire: Wire = {
                    id: uuidv4(),
                    fromCompId: pot.id,
                    fromPinId: 'SIG',
                    toCompId: newComp.id,
                    toPinId: 'A0',
                    color: 'orange'
                };
                setWires(prev => [...prev, newWire]);
            }
        }
    };

    const addComponent = useCallback((type: ComponentType, x: number, y: number) => {
        const newComp: CircuitComponent = {
            id: uuidv4(),
            type,
            x,
            y,
            rotation: 0,
            data: {}
        };

        setComponents(prev => {
            const updated = [...prev, newComp];
            // Attempt auto-wiring after state update (using current prev for check)
            tryAutoWire(newComp, prev);
            return updated;
        });
    }, []);

    const updateComponentPos = useCallback((id: string, x: number, y: number) => {
        setComponents(prev => prev.map(c => c.id === id ? { ...c, x, y } : c));
    }, []);

    const removeComponent = useCallback((id: string) => {
        setComponents(prev => prev.filter(c => c.id !== id));
        setWires(prev => prev.filter(w => w.fromCompId !== id && w.toCompId !== id));
    }, []);

    const toggleSimulation = useCallback(() => {
        setIsRunning(prev => !prev);
        if (isRunning) {
            // Reset pin states on stop
            setPinStates({});
        }
    }, [isRunning]);

    // Refs for simulation loop to access latest state without restarting interval
    const componentsRef = React.useRef(components);
    const pinStatesRef = React.useRef(pinStates);

    useEffect(() => {
        componentsRef.current = components;
    }, [components]);

    useEffect(() => {
        pinStatesRef.current = pinStates;
    }, [pinStates]);

    const setPinState = useCallback((pinId: string, value: number) => {
        setPinStates(prev => {
            if (prev[pinId] === value) return prev;
            return { ...prev, [pinId]: value };
        });
    }, []);

    // SIMULATION LOOP
    useEffect(() => {
        if (!isRunning) return;

        const interval = setInterval(() => {
            // Use refs to access latest state
            const currentComponents = componentsRef.current;
            const currentPinStates = pinStatesRef.current;
            const newUpdates: Record<string, number> = {};
            let hasUpdates = false;

            // Simple Logic:
            // 1. Check A0 (Potentiometer). If it has value > 0 (or just connected), use it to drive D10 (PWM led).
            // 2. Else check D2 (Button). If HIGH, turn D10 HIGH.

            const a0Val = currentPinStates['A0'];

            // If we have an analog input (simulating Potentiometer taking precedence)
            if (a0Val !== undefined) {
                // Map 0-1023 to 0-255 (PWM) - We simulate PWM by just passing the raw value 
                // and letting the LED component decide brightness, or we normalize it here.
                // For now, let's just pass 1 (HIGH) if > 500 for digital, but for true analog 
                // we need the LED to support brightness.
                // Let's stick to simple logic: If Analog > 512 -> ON, else OFF (ADC Threshold)
                // OR better: If A0 is active, ignore Button.
                const isHigh = a0Val > 512 ? 1 : 0;
                if (currentPinStates['D10'] !== isHigh) {
                    setPinState('D10', isHigh);
                }
            } else {
                // Fallback to Digital Logic: D2 -> D10
                const d2State = currentPinStates['D2'] || 0;

                if (d2State === 1 && currentPinStates['D10'] !== 1) {
                    setPinState('D10', 1);
                } else if (d2State === 0 && currentPinStates['D10'] !== 0) {
                    setPinState('D10', 0);
                }
            }

        }, 50); // 20Hz tick for smoother feel

        return () => clearInterval(interval);
    }, [isRunning, setPinState]);

    return (
        <CircuitContext.Provider value={{
            components,
            wires,
            isRunning,
            pinStates,
            addComponent,
            updateComponentPos,
            removeComponent,
            toggleSimulation,
            setPinState
        }}>
            {children}
        </CircuitContext.Provider>
    );
}

export function useCircuit() {
    const context = useContext(CircuitContext);
    if (!context) throw new Error("useCircuit must be used within a CircuitProvider");
    return context;
}
