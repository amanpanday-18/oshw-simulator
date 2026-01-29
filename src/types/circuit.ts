export type ComponentType = 'ARDUINO_UNO' | 'LED' | 'PUSH_BUTTON';

export interface Pin {
  id: string; // e.g., "D10", "GND", "ANODE"
  name: string;
  type: 'digital' | 'analog' | 'power' | 'gnd';
  x: number; // relative to component top-left
  y: number;
}

export interface ComponentData {
  pinOverrides?: Record<string, string>; // Maps logical pin (e.g., "ANODE") to Arduino pin (e.g., "D10")
}

export interface CircuitComponent {
  id: string;
  type: ComponentType;
  x: number;
  y: number;
  rotation: number;
  data: ComponentData;
}

export interface Wire {
  id: string;
  fromCompId: string;
  fromPinId: string;
  toCompId: string;
  toPinId: string;
  color: string;
}

export interface CircuitState {
  components: CircuitComponent[];
  wires: Wire[];
  isRunning: boolean;
  pinStates: Record<string, number>; // "D10": 1 (HIGH) | 0 (LOW)
}
