
# OSHW Arduino Simulator 🚀

A web-based interactive Arduino Simulator built for the **FOSSEE Screening Task**. This application allows users to simulate basic Arduino circuits directly in the browser with a drag-and-drop interface, real-time wiring, and C++ code generation.

![OSHW Simulator Screenshot](https://raw.githubusercontent.com/amanpanday-18/oshw-simulator/main/public/demo.png)
*(Note: You can add a screenshot to the public folder and push it to have it show up here)*

## ✨ Features

- **Interactive Canvas**: Drag and drop components to build your circuit.
- **Components**:
  - **Arduino Uno**: The brain of the operation.
  - **LED (Red)**: Visual output with brightness states.
  - **Push Button**: Digital input triggering.
  - **Potentiometer (New!)** 🎛️: Analog input simulation with a rotatable knob (Scroll to rotate).
- **Auto-Wiring System**: Smart logic automatically connects compatible pins (e.g., Potentiometer → A0).
- **Real-Time Code Generator**: Instantly generates valid Arduino C++ code based on your circuit.
- **Live Simulation**: 
  - Click **Run** to power the circuit.
  - Interact with buttons and knobs to see real-time feedback.
  - Supports Digital I/O and Analog Input (PWM simulation).
- **Modern UI**: Built with a custom dark theme and glassmorphism design.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Vanilla CSS (CSS Modules & Global Styles)
- **Icons**: Lucide React
- **State Management**: React Context API

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/amanpanday-18/oshw-simulator.git
    cd oshw-simulator
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) with your browser.

## 📖 How to Use

1.  **Select a Component** from the left palette.
2.  **Drag it** onto the dark canvas area.
3.  **Connect** components (Wiring is handled automatically for this prototype).
4.  Click the **Run** button in the top toolbar.
    - **Button**: Click the blue button on the canvas to light up the LED.
    - **Potentiometer**: Hover over the knob and **scroll your mouse wheel** to adjust the value and control LED brightness.
5.  View the code by clicking the **< >** icon to see the generated `.ino` code.

## 🤝 Contribution

This is a submission for the FOSSEE Internship Screening Task.

---
Built with ❤️ using Next.js
