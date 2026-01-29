import Link from 'next/link';
import { ArrowRight, Cpu, Zap, Code } from 'lucide-react';

export default function Home() {
    return (
        <div className="landing-container">
            {/* Hero Section */}
            <header className="hero-section">
                <div className="hero-content">
                    <div className="badge">FOSSEE Semester Internship 2026</div>
                    <h1>
                        OSHW <span className="gradient-text">Simulator</span>
                    </h1>
                    <p className="hero-subtitle">
                        Build and simulate Arduino circuits directly in your browser.
                        Drag, drop, wire, and generate code instantly.
                    </p>
                    <div className="cta-group">
                        <Link href="/simulator" className="cta-primary">
                            Start Simulator <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section className="features-section">
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon"><Cpu size={32} /></div>
                        <h3>Smart Components</h3>
                        <p>Drag and drop Arduino Uno, LEDs, and Buttons. Visual feedback simulates real-world behavior.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon"><Zap size={32} /></div>
                        <h3>Auto-Wiring Logic</h3>
                        <p>Intelligent system automatically connects components to default pins, saving you setup time.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon"><Code size={32} /></div>
                        <h3>Real-time Coding</h3>
                        <p>Generates production-ready Arduino C++ code instantly as you build your circuit.</p>
                    </div>
                </div>
            </section>

            <footer className="landing-footer">
                <p>Built for FOSSEE Screening Task • 2026</p>
            </footer>
        </div>
    );
}
