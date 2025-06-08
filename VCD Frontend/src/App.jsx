import {useState} from 'react'
import './App.css'

function App() {
    const [panelState, setPanelState] = useState(false)
    const [openSettings, setOpenSettings] = useState(false)
    const [activeButton, setActiveButton] = useState("cursor");

    const [openIndexes, setOpenIndexes] = useState([]);
    const menuItems = [
        {
            question: "1. Basic Logic Elements",
            answer: [
                <button className={`panelInnerButton`}>
                    <img
                        className={'buttonPicture'}
                        draggable="false"
                        src="../public/assets/Circuits%20Menu/AND.svg"
                        alt={"and"}
                    />
                </button>,

                <button className={`panelInnerButton`}>
                    <img className={'buttonPicture'}
                         draggable="false"
                         src="../public/assets/Circuits%20Menu/OR.svg"
                         alt={"or"}
                    />
                </button>,

                <button className={`panelInnerButton`}>
                    <img
                        className={'buttonPicture'}
                        draggable="false"
                        src="../public/assets/Circuits%20Menu/NOT.svg"
                        alt={"not"}
                    />
                </button>,

                <button className={`panelInnerButton`}>
                    <img
                        className={'buttonPicture'}
                        draggable="false"
                        src="../public/assets/Circuits%20Menu/NAND.svg"
                        alt={"nand"}
                    />
                </button>
            ]
        },
        {
            question: "2. Advanced Logic Elements",
            answer: [
                <button className={`panelInnerButton`}>
                    <img
                        className={'buttonPicture'}
                        draggable="false"
                        src="../public/assets/Circuits%20Menu/OR.svg"
                        alt={"or"}
                    />
                </button>
            ]
        },
        {
            question: "3. Pins",
            answer: [
                <button className={`panelInnerButton`}>
                    <img
                      className={'buttonPicture'}
                      draggable="false"
                      src="../public/assets/Circuits%20Menu/NOT.svg"
                      alt={"not"}
                    />
                </button>
            ]
        },
        {
            question: "4. Custom Logic Elements",
            answer: [
                <button className={`panelInnerButton`}>
                    <img
                        className={'buttonPicture'}
                        draggable="false"
                        src="../public/assets/Circuits%20Menu/NAND.svg"
                        alt={"nand"}
                    />
                </button>
            ]
        }
    ];

    const toggleItem = (index) => {
        setOpenIndexes(prevIndexes =>
            prevIndexes.includes(index)
                ? prevIndexes.filter(i => i !== index)
                : [...prevIndexes, index]
        );
    };

    const toggleSettings = () => {
      console.log(openSettings)
    }

    return (
        <div>
            <div className={`backdrop ${openSettings? 'cover' : ``}`} onClick={() => setOpenSettings(false)}></div>

            <button className="openMenuButton" onClick={() => setPanelState(!panelState)}>
                <img
                    src="/assets/Circuits%20Menu/menu.svg"
                    alt="open/close menu"
                    className={"openMenuButtonIcon"}
                    draggable="false"
                />
            </button>

            <button onClick={() => setOpenSettings(true)} className="openSettingsButton">
                <img
                    src="/assets/Settings/gear.svg"
                    alt="open settings"
                    className={"openSettingsButtonIcon"}
                    draggable="false"
                />
            </button>

            <div className={`panel ${panelState ? 'open' : ''}`}>

                <div className="menu-container">
                    <div className="menu-header">
                        <p className={"panelTitle"}>
                            Menu
                        </p>
                        <div className="divider"></div>
                    </div>

                    <ul className="menu-items">
                        {menuItems.map((item, index) => (
                            <li
                                key={index}
                                className={`menu-item ${openIndexes.includes(index) ? 'active' : ''}`}
                            >
                                <div className="question" onClick={() => toggleItem(index)}>
                                    {item.question}
                                    <span className="arrow">
                                        ▼
                                    </span>
                                </div>

                                {openIndexes.includes(index) && (
                                    <div className="answer-grid">
                                        {item.answer}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className={"toolbar"}>
                <button
                    className={`toolbarButton ${activeButton === "cursor" ? 'active' : ''}`}
                    onClick={() => setActiveButton("cursor")}
                >
                    <img
                        src="/assets/toolBar/cursor.svg"
                        alt="cursor"
                        className={"toolbarButtonIcon"}
                        draggable="false"
                    />
                </button>

                <button
                    className={`toolbarButton ${activeButton === "hand" ? 'active' : ''}`}
                    onClick={() => setActiveButton("hand")}
                >
                    <img
                        src="/assets/toolBar/hand.svg"
                        alt="hand"
                        className={"toolbarButtonIcon"}
                        draggable="false"
                    />
                </button>

                <button
                    className={`toolbarButton ${activeButton === "sqwire" ? 'active' : ''}`}
                    onClick={() => setActiveButton("sqwire")}
                >
                    <img
                        src="/assets/toolBar/line.svg"
                        alt="square wire"
                        className={"toolbarButtonIcon"}
                        draggable="false"
                    />
                </button>

                <button
                    className={`toolbarButton ${activeButton === "dwire" ? 'active' : ''}`}
                    onClick={() => setActiveButton("dwire")}
                >
                    <img
                        src="/assets/toolBar/line2.svg"
                        alt="diagonal wire"
                        draggable="false"
                        className={"toolbarButtonIcon"}
                    />
                </button>

                <button
                    className={`toolbarButton ${activeButton === "eraser" ? 'active' : ''}`}
                    onClick={() => setActiveButton("eraser")}
                >
                    <img
                        src="/assets/toolBar/eraser.svg"
                        alt="eraser"
                        draggable="false"
                        className={"toolbarButtonIcon"}
                    />
                </button>

                <button
                    className={`toolbarButton ${activeButton === "text" ? 'active' : ''}`}
                    onClick={() => setActiveButton("text")}
                >
                    <img
                        src="/assets/toolBar/text.svg"
                        alt="text tool"
                        className={"toolbarButtonIcon"}
                        draggable="false"
                    />
                </button>
            </div>

        </div>
    )
}

export default App
