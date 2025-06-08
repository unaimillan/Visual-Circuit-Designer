import React, {useState, useRef} from 'react'
import {
    ReactInfiniteCanvas,
    COMPONENT_POSITIONS,
} from 'react-infinite-canvas';
import {Controls} from './components/controls/index.tsx';

import './App.css'

function App() {
    const canvasRef = useRef(null);
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
                        src="../assets/circuitsMenu/AND.svg"
                        alt={"and"}
                    />
                    <span className="buttonText">AND</span>
                </button>,

                <button className={`panelInnerButton`}>
                    <img className={'buttonPicture'}
                         draggable="false"
                         src="../assets/circuitsMenu/OR.svg"
                         alt={"or"}
                    />
                    <span className="buttonText">OR</span>
                </button>,

                <button className={`panelInnerButton`}>
                    <img
                        className={'buttonPicture'}
                        draggable="false"
                        src="../assets/circuitsMenu/NOT.svg"
                        alt={"not"}
                    />
                    <span className="buttonText">NOT</span>
                </button>,

                <button className={`panelInnerButton`}>
                    <img
                        className={'buttonPicture'}
                        draggable="false"
                        src="../assets/circuitsMenu/NAND.svg"
                        alt={"nand"}
                    />
                    <span className="buttonText">NAND</span>
                </button>,

                <button className={`panelInnerButton`}>
                    <img
                        className={'buttonPicture'}
                        draggable="false"
                        src="../assets/circuitsMenu/NOR.svg"
                        alt={"nor"}
                    />
                    <span className="buttonText">NOR</span>
                </button>,

                <button className={`panelInnerButton`}>
                    <img
                        className={'buttonPicture'}
                        draggable="false"
                        src="../assets/circuitsMenu/XOR.svg"
                        alt={"xor"}
                    />
                    <span className="buttonText">XOR</span>
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
                        src="../assets/circuitsMenu/AND.svg"
                        alt={"and"}
                    />
                    <span className="buttonText">AND</span>
                </button>,

                <button className={`panelInnerButton`}>
                    <img className={'buttonPicture'}
                         draggable="false"
                         src="../assets/circuitsMenu/OR.svg"
                         alt={"or"}
                    />
                    <span className="buttonText">OR</span>
                </button>,
            ]
        },
        {
            question: "3. Pins",
            answer: [
                <button className={`panelInnerButton`}>
                    <img
                        className={'buttonPicture'}
                        draggable="false"
                        src="../assets/circuitsMenu/AND.svg"
                        alt={"and"}
                    />
                    <span className="buttonText">AND</span>
                </button>,

                <button className={`panelInnerButton`}>
                    <img className={'buttonPicture'}
                         draggable="false"
                         src="../assets/circuitsMenu/OR.svg"
                         alt={"or"}
                    />
                    <span className="buttonText">OR</span>
                </button>,
            ]
        },
        {
            question: "4. Custom Logic Elements",
            answer: [
                <button className={`panelInnerButton`}>
                    <img
                        className={'buttonPicture'}
                        draggable="false"
                        src="../assets/circuitsMenu/AND.svg"
                        alt={"and"}
                    />
                    <span className="buttonText">AND</span>
                </button>,

                <button className={`panelInnerButton`}>
                    <img className={'buttonPicture'}
                         draggable="false"
                         src="../assets/circuitsMenu/OR.svg"
                         alt={"or"}
                    />
                    <span className="buttonText">OR</span>
                </button>,
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

    // const toggleSettings = () => {
    //   console.log(openSettings)
    // }

    return (
        <div className="canvasContainer">
            <ReactInfiniteCanvas
                ref={canvasRef}
                onCanvasMount={(canvasFunc) => {
                    canvasFunc.fitContentToView({scale: 0.5});
                }}
                customComponents={[
                    {
                        component: (
                            <Controls
                                getCanvasState={() => {
                                    return canvasRef.current?.getCanvasState();
                                }}
                            />
                        ),
                        position: COMPONENT_POSITIONS.BOTTOM_LEFT,
                        offset: {x: 20, y: 20},
                    },
                ]}
            >
            </ReactInfiniteCanvas>
            <div>
                {/*<div className={`backdrop ${openSettings? toggleSettings() : ``}`}></div>*/}

                <button className="openMenuButton" onClick={() => setPanelState(!panelState)}>
                    <img
                        src="/assets/circuitsMenu/menu.svg"
                        alt="open/close menu"
                        className={"openMenuButtonIcon"}
                        draggable="false"
                    />
                </button>

                <button className="openSettingsButton" onClick={() => toggleSettings()}>
                    <img
                        src="/assets/settings/gear.svg"
                        alt="open/close settings"
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
                                            {item.answer.map((btn, btnIndex) =>
                                                React.cloneElement(btn, { key: `item-${index}-btn-${btnIndex}` })
                                            )}
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
        </div>
    );
}

export default App
