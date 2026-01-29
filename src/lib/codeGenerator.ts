import { CircuitComponent, Wire } from "@/types/circuit";

export function generateArduinoCode(components: CircuitComponent[], wires: Wire[]): string {
    // 1. Identify connected pins
    let ledPin = '10'; // Default
    let btnPin = '2';  // Default

    // Find LED connection
    const led = components.find(c => c.type === 'LED');
    if (led) {
        // Find wire connected to LED Anode
        const wire = wires.find(w => w.toCompId === led.id && w.toPinId === 'ANODE');
        if (wire) {
            // Extract pin number "D10" -> "10"
            ledPin = wire.fromPinId.replace('D', '');
        }
    }

    // Find Button connection
    const btn = components.find(c => c.type === 'PUSH_BUTTON');
    if (btn) {
        // Find wire connected to Arduino from Button
        const wire = wires.find(w => w.fromCompId === btn.id && w.fromPinId === 'OUT');
        if (wire) {
            btnPin = wire.toPinId.replace('D', '');
        }
    }

    return `// Auto-generated Arduino Code
const int ledPin = ${ledPin};
const int buttonPin = ${btnPin};

void setup() {
  pinMode(ledPin, OUTPUT);
  pinMode(buttonPin, INPUT);
}

void loop() {
  // Read the state of the push button value:
  int buttonState = digitalRead(buttonPin);

  // Check if the push button is pressed.
  // If it is, the buttonState is HIGH:
  if (buttonState == HIGH) {
    // Turn LED on:
    digitalWrite(ledPin, HIGH);
  } else {
    // Turn LED off:
    digitalWrite(ledPin, LOW);
  }
}`;
}
