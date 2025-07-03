import React, {useEffect, useState} from "react";
import StickyBox from "react-sticky-box";
import "../../CSS/hello-page.css";
import {VantaFogBackground} from "../../../assets/animated-bg.jsx";
import {Link} from 'react-router-dom';

import {IconBulb, IconThunder, IconSettings, IconStar} from "../../../assets/ui-icons.jsx";

function App() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  const scrollProgress = Math.min(scrollY, 300) / 300;
  const easeOut = 1 - Math.pow(1 - scrollProgress, 2);
  const easeOutScale = 1 - easeOut * 0.3;
  const easeOutTranslate = -easeOut * 75;

  const [showBlock1, setShowBlock1] = useState(false);
  const [showBlock2, setShowBlock2] = useState(false);
  const [showBlock3, setShowBlock3] = useState(false);
  const [showBlock4, setShowBlock4] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;

      if (y >= 500 && !showBlock1) setShowBlock1(true);
      if (y >= 700 && !showBlock3) setShowBlock3(true);
      if (y >= 900 && !showBlock2) setShowBlock2(true);
      if (y >= 1100 && !showBlock4) setShowBlock4(true);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showBlock1, showBlock2, showBlock3, showBlock4]);

  return (
    <div className={"whole-page"}>

      <VantaFogBackground/>
      <div>
        <header className={`hello-header ${scrollY > 50 ? "scrolled" : ""}`}>
          <div className="hello-logo-name">VCD</div>

          <div style={{
            position: "fixed",
            top: "10px",
            color: "#fff",
            background: "rgba(0,0,0,0.6)",
            padding: "6px 12px",
            borderRadius: "8px",
            fontFamily: "monospace",
            zIndex: 10000
          }}>
            ScrollY: {scrollY}
          </div>

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
            style={{transform: `scale(${easeOutScale}) translateY(${easeOutTranslate}px)`}}
          >
            <h1 className="hello-hero-title">Design logic circuits in your browser.</h1>
            <p className="hello-hero-subtitle">Create, simulate and sync — instantly.</p>
          </div>
        </div>

        <div style={{height: "1600px", position: "relative"}}>
          <StickyBox offsetTop={window.innerHeight *0.2}>
            <div className={"sticky-container"}>

              <div className="side-text left">
                <div className={`sticky-upper-block appear-animate-left ${showBlock1 ? "visible" : ""}`}>
                  <div className={"appear-block-title sticky-color-1"}>
                    <IconThunder SVGClassName={"sticky-icon"}/>
                    Instant Access
                  </div>
                  <p className={"appear-block-description sticky-color-1"}>No installation or setup required. Just open the website and start designing your circuits instantly — from any device.</p>
                </div>

                <div className={`sticky-upper-block appear-animate-left ${showBlock2 ? "visible" : ""}`}>
                  <div className={"appear-block-title sticky-color-2"}>
                    <IconBulb SVGClassName={"sticky-icon"}/>
                    Simple & Intuitive
                  </div>
                  <p className={"appear-block-description sticky-color-2"}>An easy-to-use interface makes circuit design accessible even to beginners. Everything is clear and intuitive.</p>
                </div>
              </div>

              <div className="hello-image-placeholder">
                <img className="demo-picture" src="../../../assets/demo-screenshot.png" alt="app screenshot"/>
              </div>

              <div className="side-text right">
                <div className={`sticky-upper-block appear-animate-right ${showBlock3 ? "visible" : ""}`}>
                  <div className={"appear-block-title sticky-color-3"}>
                    <IconSettings SVGClassName={"sticky-icon "}/>
                    Real-Time Simulation</div>
                  <p className={"appear-block-description sticky-color-3"}>Simulate your circuits instantly, test ideas quickly, and catch mistakes early — no extra tools needed.</p>
                </div>

                <div className={"sticky-lower-block"}>
                  <div className={`sticky-upper-block appear-animate-right ${showBlock4 ? "visible" : ""}`}>
                    <div className={"appear-block-title sticky-color-4"}>
                      <IconStar SVGClassName={"sticky-icon"}/>
                      Modern & Fast UI
                    </div>

                    <p className={"appear-block-description sticky-color-4"}>A sleek, responsive interface built for speed and clarity — making your experience smooth and enjoyable every day.</p>
                  </div>
                  </div>
              </div>

            </div>
          </StickyBox>
        </div>

        <section className="hello-section">
          <h2>What's inside</h2>
          <p>Other block</p>
          <p>With love from Team39 💙</p>
        </section>
      </div>
    </div>
  );
}

export default App;