import { useState } from 'react'
import './App.css'

function App() {
  const [panelState, setPanelState] = useState(false)



  return (
    <div>
      <div className></div>
      <button
          className="panelButton"
          onClick={() => setPanelState(!panelState)}
      >
          {panelState ? "Закрыть" : "Открыть"} меню.
      </button>

      <div className={`panel ${panelState ? 'open' : ''}`}>

        <p className={"menuText menuContent"}>
          Меню
        </p>

        <button className={`panelInnerButton menuContent ${panelState ? 'showed' : ''}`}>
          <img className={'buttonPicture'} src="/assets/AND.svg" alt={"and"}/>
        </button>

        <button className={`panelInnerButton menuContent ${panelState ? 'showed' : ''}`}>
          <img className={'buttonPicture'} src="../public/assets/OR.png" alt={"or"}/>
        </button>

        <button className={`panelInnerButton menuContent ${panelState ? 'showed' : ''}`}>
          <img className={'buttonPicture'} src="../public/assets/NOT.png" alt={"not"}/>
        </button>

      </div>


    </div>
  )
}

export default App
