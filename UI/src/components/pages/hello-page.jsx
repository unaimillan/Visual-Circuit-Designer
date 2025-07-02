import React, { useEffect, useState } from "react";
import "../../CSS/hello-page.css";
import {VantaFogBackground} from "../../../assets/animated-bg.jsx";
import { Link } from 'react-router-dom';

function App() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const clampedScroll = Math.min(scrollY, 300);
  const scale = 1 - clampedScroll / 1000;       // от 1 до 0.7
  const translateY = -clampedScroll / 4;        // немного вверх

  const progress = clampedScroll / 300;
  const easeOut = 1 - Math.pow(1 - progress, 2);
  const easeOutScale = 1 - easeOut * 0.3;
  const easeOutTranslate = -easeOut * 75;


  return (
    <div>
      <VantaFogBackground/>

      <header className={`hello-header ${scrollY > 50 ? "scrolled" : ""}`}>
        <div className="hello-logo-name">VCD</div>

        <div className={"header-left-buttons"}>
          <button className={"header-button"}>Sign Up</button>
          <Link to="/">
            <button className={"header-button"}>Get Started</button>
          </Link>
        </div>
      </header>

      <div className="hello-hero-wrapper">
        <div
          className="hello-hero-text"
          style={{
            transform: `scale(${easeOutScale}) translateY(${easeOutTranslate}px)`,
          }}
        >
          <h1 className="hello-hero-title">Design logic circuits in your browser.</h1>
          <p className="hello-hero-subtitle">Create, simulate and sync — instantly.</p>
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
