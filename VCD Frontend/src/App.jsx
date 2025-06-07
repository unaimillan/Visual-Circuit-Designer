import { useState } from 'react'
import './App.css'

function App() {
  const [panelState, setPanelState] = useState(false)



  return (
    <div>
      <button
          className="panelButton"
          onClick={() => setPanelState(!panelState)}
      >
          {panelState ? "Закрыть" : "Открыть"} меню.
      </button>

      <div className={`panel ${panelState ? 'open' : ''}`}>

        <p className={"menuText menuContent"}>
          Меню!
        </p>

        <button className={`panelInnerButton menuContent ${panelState ? 'showed' : ''}`}>

          Я перви кнопишка! 👻
        </button>

        <button className={`panelInnerButton menuContent ${panelState ? 'showed' : ''}`}>
          А я вторая кнопишка! ☺️
        </button>

        <button className={`panelInnerButton menuContent ${panelState ? 'showed' : ''}`}>
          Окак! Я трети кнопишка! 💕🎶
        </button>

      </div>


    </div>
  )
}

export default App
