import React, { useEffect, useState } from "react";
import "../../CSS/hello-page.css";

function App() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Ограничим эффект до 300px скролла
  const clampedScroll = Math.min(scrollY, 300);
  const scale = 1 - clampedScroll / 1000;       // от 1 до 0.7
  const translateY = -clampedScroll / 4;        // немного вверх

  return (
    <div>
      <header className={`hello-header ${scrollY > 50 ? "hello-scrolled" : ""}`}>
        <div className="hello-logo">LOGICLAB</div>
        <nav className="hello-nav">
          <a href="#">Demo</a>
          <a href="#">Sign Up</a>
          <a href="#">Docs</a>
        </nav>
      </header>

      <div className="hello-hero-wrapper">
        <div
          className="hello-hero-text"
          style={{
            transform: `scale(${scale}) translateY(${translateY}px)`,
          }}
        >
          <h1 className="hello-hero-title">Design logic circuits in your browser</h1>
          <p className="hello-hero-subtitle">Simulate, sync, and share — instantly.</p>
        </div>

        <div className="hello-hero-image">
          {/* Замените на <canvas> или <img src="..." /> */}
          <div className="hello-image-placeholder">[ Your visual or canvas here ]</div>
        </div>
      </div>

      <section className="hello-section">
        <h2>What's inside</h2>
        <p>Here comes your full-width section content below the hero image.</p>
      </section>
    </div>
  );
}

export default App;
