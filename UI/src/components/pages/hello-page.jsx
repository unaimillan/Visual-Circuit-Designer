import React, {useEffect, useRef, useState} from "react";
import StickyBox from "react-sticky-box";
import "../../CSS/hello-page.css";
import {VantaFogBackground} from "../../../assets/animated-bg.jsx";
import {Link} from 'react-router-dom';

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
          <StickyBox offsetTop={200}>
            <div className={"sticky-container"}>
              <div className="hello-image-placeholder">
                <img className="demo-picture" src="../../../assets/demo-screenshot.png" alt="app screenshot"/>
              </div>
              {/*<p className={""}>Text 1</p>*/}
              {/*<p>Text 2</p>*/}
              {/*<p>Text 3</p>*/}
              {/*<p>Text 4</p>*/}
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