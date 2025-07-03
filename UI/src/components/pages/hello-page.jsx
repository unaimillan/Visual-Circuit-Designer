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

  const getBlockProgress = (start, end, scrollY) => {
    if (scrollY < start) return 1;
    if (scrollY > end) return 0;
    const progress = (scrollY - start) / (end - start);
    return 1 - progress;
  };

  const block1Progress = getBlockProgress(500, 700, scrollY);
  const block3Progress = getBlockProgress(700, 900, scrollY);
  const block2Progress = getBlockProgress(900, 1100, scrollY);
  const block4Progress = getBlockProgress(1100, 1300, scrollY);

  return (
    <div className={"whole-page"}>

      <VantaFogBackground/>
      <div>
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
                <div className={"sticky-upper-block"} style={{transform: `translateX(${-block1Progress*30}vw)`}}>
                  <div className={"appear-block-title sticky-color-1"}>
                    <IconThunder SVGClassName={"sticky-icon sticky-color-1"}/>
                    Instant Access
                  </div>
                  <p className={"appear-block-description sticky-color-1"}>No installation or setup required. Just open the website and start designing your circuits instantly — from any device.</p>
                </div>

                <div className={"sticky-lower-block"} style={{transform: `translateX(${-block2Progress*30}vw)`}}>
                  <div className={"appear-block-title sticky-color-2"}>
                    <IconBulb SVGClassName={"sticky-icon sticky-color-2"}/>
                    Simple & Intuitive
                  </div>
                  <p className={"appear-block-description sticky-color-2"}>An easy-to-use interface makes circuit design accessible even to beginners. Everything is clear and intuitive.</p>
                </div>
              </div>

              <div className="hello-image-placeholder">
                <img className="demo-picture" src="../../../assets/demo-screenshot.png" alt="app screenshot"/>
              </div>

              <div className="side-text right">
                <div className={"sticky-upper-block"} style={{transform: `translateX(${block3Progress*30}vw)`}}>
                  <div className={"appear-block-title sticky-color-3"}>
                    <IconSettings SVGClassName={"sticky-icon sticky-color-3"}/>
                    Real-Time Simulation</div>
                  <p className={"appear-block-description sticky-color-3"}>Simulate your circuits instantly, test ideas quickly, and catch mistakes early — no extra tools needed.</p>
                </div>

                <div className={"sticky-lower-block"}>
                  <div className={"appear-block-title sticky-color-4"} style={{transform: `translateX(${block4Progress*30}vw)`}}>
                    <IconStar SVGClassName={"sticky-icon sticky-color-4"}/>
                     Modern & Fast UI
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