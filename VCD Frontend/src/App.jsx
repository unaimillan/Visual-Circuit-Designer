import React, {useEffect, useState, useCallback} from 'react';
import {
    ReactFlow,
    Controls,
    Background,
    addEdge,
    SelectionMode,
    useNodesState,
    useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import {initialNodes} from './components/nodes';
import {initialEdges} from './components/edges';

import './App.css'

function App() {
    const [panelState, setPanelState] = useState(false)
    const [openSettings, setOpenSettings] = useState(false)
    const [activeButton, setActiveButton] = useState("cursor");

    /* React Flow */
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const [panOnDrag, setPanOnDrag] = useState(false);

    const onConnect = useCallback(
        (connection) => setEdges((eds) => addEdge(connection, eds)),
        [setEdges],
    );

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && openSettings) {
                setOpenSettings(false);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [openSettings]);

    const [openIndexes, setOpenIndexes] = useState([]);
    const menuItems = [
        {
            header: "Basic Logic Elements",
            gates: [
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
            header: "Advanced Logic Elements",
            gates: [
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
            header: "Pins",
            gates: [
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
            header: "Custom Logic Elements",
            gates: [
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

    return (
        <div style={{height: '100%'}}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                panOnScroll
                selectionOnDrag
                panOnDrag={panOnDrag}
                selectionMode={SelectionMode.Partial}
            >
                <Background/>
                <Controls/>
            </ReactFlow>
            <div>
                <button className="openMenuButton" onClick={() => setPanelState(!panelState)}>
                    <img
                        src="../assets/circuitsMenu/menu.svg"
                        alt="open/close menu"
                        className={"openMenuButtonIcon"}
                        draggable="false"
                    />
                </button>

                <button onClick={() => setOpenSettings(true)} className="openSettingsButton">
                    <img
                        src="../assets/settings/gear.svg"
                        alt="open/close settings"
                        className={"openSettingsButtonIcon"}
                        draggable="false"
                    />
                </button>

                <div className={`backdrop ${openSettings ? 'cover' : ''}`}
                     onClick={() => setOpenSettings(false)}>
                </div>

                <div className={`settingsMenu ${openSettings ? 'showed' : ''}`}>
                    <p className={'settingsMenuTitle'}>Settings</p>
                </div>

                <div className={`panel ${panelState ? 'open' : ''}`}>

                    <div className="menu-container">
                        <div className="menu-header">
                            <p className={"panelTitle"}>
                                Menu
                            </p>
                            <div className="divider"></div>
                        </div>

                        <ol className="menu-items">
                            {menuItems.map((item, index) => (
                                <li
                                    key={index}
                                    className={`menu-item ${openIndexes.includes(index) ? 'active' : ''}`}
                                >
                                    <div className="header" onClick={() => toggleItem(index)}>
                                        {item.header}
                                        <img
                                            className={'arrow'}
                                            src="../assets/circuitsMenu/hide-arrow.svg"
                                            alt="show/hide arrow"
                                        />
                                    </div>

                                    {openIndexes.includes(index) && (
                                        <div className="gates-grid">
                                            {item.gates.map((btn, btnIndex) =>
                                                React.cloneElement(btn, {key: `item-${index}-btn-${btnIndex}`})
                                            )}
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>

                <div className={"toolbar"}>
                    <button
                        className={`toolbarButton ${activeButton === "cursor" ? 'active' : ''}`}
                        onClick={() => {
                            setActiveButton("cursor")
                            setPanOnDrag(false)
                        }
                        }
                    >
                        <img
                            src="../assets/toolBar/cursor.svg"
                            alt="cursor"
                            className={"toolbarButtonIcon"}
                            draggable="false"
                        />
                    </button>

                    <button
                        className={`toolbarButton ${activeButton === "hand" ? 'active' : ''}`}
                        onClick={() => {
                            setActiveButton("hand")
                            setPanOnDrag(true)
                        }
                        }
                    >
                        <img
                            src="../assets/toolBar/hand.svg"
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
                            src="../assets/toolBar/line.svg"
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
                            src="../assets/toolBar/line2.svg"
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
                            src="../assets/toolBar/eraser.svg"
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
                            src="../assets/toolBar/text.svg"
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
