import { useState } from 'react'
import './App.css'

function App() {
  const [panelState, setPanelState] = useState(false)
  const [activeButton, setActiveButton] = useState("cursor");


  return (
    <div>
      <button className="openMenuButton" onClick={() => setPanelState(!panelState)}>
        <img className={"openMenuButtonIcon"} src="/assets/Circuits%20Menu/menu.svg" alt="open/close menu"/>
      </button>

      <div className={`panel ${panelState ? 'open' : ''}`}>
        <p className={"panelText"}>
          Меню
        </p>

        <button className={`panelInnerButton`}>
          <img className={'buttonPicture'} src="/assets/Circuits%20Menu/AND.svg" alt={"and"}/>
        </button>

        <button className={`panelInnerButton`}>
          <img className={'buttonPicture'} src="../public/assets/Circuits%20Menu/OR.svg" alt={"or"}/>
        </button>

        <button className={`panelInnerButton`}>
          <img className={'buttonPicture'} src="../public/assets/Circuits%20Menu/NOT.svg" alt={"not"}/>
        </button>
      </div>

      <div className={"toolbar"}>
        <button
          className={`toolbarButton ${activeButton === "cursor"  ? 'activeButton' : ''}`}
          onClick={() => setActiveButton("cursor")}
        >
          <img src="/assets/toolBar/cursor.svg" alt="cursor" className={"toolbarButtonIcon"}/>
        </button>

        <button
          className={`toolbarButton ${activeButton === "hand"  ? 'activeButton' : ''}`}
          onClick={() => setActiveButton("hand")}
        >
          <img src="/assets/toolBar/hand.svg" alt="hand" className={"toolbarButtonIcon"}/>
        </button>

        <button
          className={`toolbarButton ${activeButton === "sqwire"  ? 'activeButton' : ''}`}
          onClick={() => setActiveButton("sqwire")}
        >
          <img src="/assets/toolBar/line.svg" alt="square wire" className={"toolbarButtonIcon"}/>
        </button>

        <button
          className={`toolbarButton ${activeButton === "dwire"  ? 'activeButton' : ''}`}
          onClick={() => setActiveButton("dwire")}
        >
          <img src="/assets/toolBar/line2.svg" alt="diagonal wire" className={"toolbarButtonIcon"}/>
        </button>

        <button
          className={`toolbarButton ${activeButton === "eraser"  ? 'activeButton' : ''}`}
          onClick={() => setActiveButton("eraser")}
        >
          <img src="/assets/toolBar/eraser.svg" alt="eraser" className={"toolbarButtonIcon"}/>
        </button>

        <button
          className={`toolbarButton ${activeButton === "text" ? 'activeButton' : ''}`}
          onClick={() => setActiveButton("text")}
        >
          <img src="/assets/toolBar/text.svg" alt="text tool" className={"toolbarButtonIcon"}/>
        </button>
      </div>


    </div>
  )
}

export default App
