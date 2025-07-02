import React, {useEffect, useRef, useState} from "react";
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
  const progress = clampedScroll / 300;
  const easeOut = 1 - Math.pow(1 - progress, 2);
  const easeOutScale = 1 - easeOut * 0.3;
  const easeOutTranslate = -easeOut * 75;

  const stickyStart = 1000;
  const stickyDuration = 600;
  const stickyEnd = stickyStart + stickyDuration;




  return (
    <div>
      <VantaFogBackground/>

      <header className={`hello-header ${scrollY > 50 ? "scrolled" : ""}`}>
        <div className="hello-logo-name">VCD</div>

        <div className={"header-left-buttons"}>
          <button className={"header-button"}>Sign Up</button>
          <Link to="/" style={{textDecoration: 'none'}}>
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
      </div>

      {/*<StickyImageWithText />*/}

      <div className={"hello-hero-wrapper sticky-container"}>
        <div className="hello-image-placeholder sticky-block">
          <img className={"demo-picture"} src="../../../assets/demo-screenshot.png" alt="app screenshot"/>
        </div>

        <p className={""}>Text 1</p>
        <p>Text 2</p>
        <p>Text 3</p>
        <p>Text 4</p>
      </div>

      <section className="hello-section">
        <h2>What's inside</h2>
        <p>Other block</p>
        <p>With love from Team39 💙</p>
      </section>
    </div>
  );
}


function StickyImageWithText() {
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef(null);

  const start = 1000;         // начало фиксации
  const duration = 600;       // сколько пикселей прилипает
  const end = start + duration;

  const textDelay = 100;      // задержка между текстами
  const totalTextCount = 4;

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isFixed = scrollY >= start && scrollY < end;
  const isAfter = scrollY >= end;

  const progress = Math.min(1, Math.max(0, (scrollY - start) / duration));

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        height: `${duration + 1000}px`,
        background: "transparent",
      }}
    >
      {/* Блок с картинкой */}
      <div
        className="hello-image-placeholder"
        style={{
          position: isFixed ? "fixed" : isAfter ? "absolute" : "static",
          top: isFixed ? "100px" : isAfter ? `${end}px` : "auto",
          left: "50%",
          transform: "translateX(-50%)",
          width: "60%",
          zIndex: 10,
        }}
      >
        <img
          className="demo-picture"
          src="../../../assets/demo-screenshot.png"
          alt="screenshot"
        />
      </div>

      {/* Вылетающие тексты */}
      {[...Array(totalTextCount)].map((_, i) => {
        const appearAt = start + duration + i * textDelay;
        const visible = scrollY > appearAt;
        const fromLeft = i % 2 === 0;

        return (
          <p
            key={i}
            style={{
              position: "relative",
              opacity: visible ? 1 : 0,
              transform: visible
                ? "translateX(0)"
                : `translateX(${fromLeft ? "-50vw" : "50vw"})`,
              transition: "all 0.6s ease",
              margin: "100px auto",
              maxWidth: "600px",
              textAlign: "center",
              color: "white",
              fontSize: "1.5rem",
            }}
          >
            Text {i + 1}
          </p>
        );
      })}
    </div>
  );
}

export default App;
