import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  BackgroundVariant,
  addEdge,
  SelectionMode,
  useNodesState,
  useEdgesState,
  MiniMap,
  useStoreApi,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import ContextMenu from './components/codeComponents/ContextMenu.jsx';

import AndGate from '../assets/circuitsMenu/AND.svg';
import OrGate from '../assets/circuitsMenu/OR.svg';
import NotGate from '../assets/circuitsMenu/NOT.svg';
import NandGate from '../assets/circuitsMenu/NAND.svg';
import NorGate from '../assets/circuitsMenu/NOR.svg';
import XorGate from '../assets/circuitsMenu/XOR.svg';
import InputGate from '../assets/circuitsMenu/input.svg';
import OutputGate from '../assets/circuitsMenu/output.svg';

import { initialNodes, nodeTypes } from './components/codeComponents/nodes.js';
import { initialEdges } from './components/codeComponents/edges.js';
import {MinimapSwitch} from "./components/codeComponents/switch.jsx";
// export default SelectDemo;

import './CSS/App.css';
import './CSS/settings.css';
import './CSS/toolbar.css';
import './CSS/dnd.css';
import './CSS/backdrop.css';
import './CSS/circuitsMenu.css';
import './CSS/contextMenu.css';
import SelectDemo from "./components/codeComponents/select.jsx";

import './components/codeComponents/switch.jsx';



let variant;





const GAP_SIZE = 10;
const MIN_DISTANCE = 10;

function App() {
  const [circuitsMenuState, setCircuitsMenuState] = useState(false)
  const [openSettings, setOpenSettings] = useState(false)
  const [activeButton, setActiveButton] = useState("cursor")
  const [currentBG, setCurrentBG] = useState("dots")

  const [showMinimap, setShowMinimap] = useState(true)

  if (currentBG === "dots") {
    variant = BackgroundVariant.Dots;
  } else if (currentBG === "cross") {
    variant = BackgroundVariant.Cross;
  } else {
    variant = BackgroundVariant.Lines;
  }


  /* React Flow */
  const [reactFlowInstance, setReactFlowInstance] = React.useState(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [menu, setMenu] = useState(null);
  const ref = useRef(null);
  const store = useStoreApi();
  const { getInternalNode } = useReactFlow();



  const [panOnDrag, setPanOnDrag] = useState([1, 2]);

  const validateConnection = useCallback((connection) => {
    return connection.source !== connection.target;
  });

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDrop = (event) => {
    event.preventDefault();

    const type = event.dataTransfer.getData('application/reactflow');
    if (!type || !reactFlowInstance) return;

    const position = reactFlowInstance.screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    const newNode = {
      id: `${type}-${Date.now()}`,
      type,
      position,
      data: {
        customId: `${type}-${Date.now()}`,
      }
    };

    setNodes((nds) => nds.concat(newNode));
  };

  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  );

  const onNodeContextMenu = useCallback(
    (event, node) => {
      // Prevent native context menu from showing
      event.preventDefault();

      // Calculate position of the context menu. We want to make sure it
      // doesn't get positioned off-screen.
      const pane = ref.current.getBoundingClientRect();
      setMenu({
        id: node.id,
        name: node.type,
        top: event.clientY < pane.height - 200 && event.clientY,
        left: event.clientX < pane.width - 200 && event.clientX,
        right: event.clientX >= pane.width - 200 && pane.width - event.clientX,
        bottom:
          event.clientY >= pane.height - 200 && pane.height - event.clientY,
      });
    },
    [setMenu],
  );


  // Close the context menu if it's open whenever the window is clicked.
  const onPaneClick = useCallback(() => setMenu(null), [setMenu]);

  const getClosestEdge = useCallback((draggedNode) => {
    const { nodeLookup } = store.getState();
    const internalNode = getInternalNode(draggedNode.id);
    if (!internalNode) return null;

    const draggedHandles = internalNode.internals.handleBounds;
    if (!draggedHandles) return null;

    const draggedPos = internalNode.internals.positionAbsolute;

    let closestEdge = null;
    let minDistance = MIN_DISTANCE;

    nodeLookup.forEach((node) => {
      if (node.id === draggedNode.id) return;

      const nodeHandles = node.internals.handleBounds;
      if (!nodeHandles) return;

      const nodePos = node.internals.positionAbsolute;

      // Check source->target connections
      if (draggedHandles.source) {
        draggedHandles.source.forEach((srcHandle) => {
          const srcHandlePos = {
            x: draggedPos.x + srcHandle.x + srcHandle.width / 2,
            y: draggedPos.y + srcHandle.y + srcHandle.height / 2
          };

          if (nodeHandles.target) {
            nodeHandles.target.forEach((tgtHandle) => {
              const tgtHandlePos = {
                x: nodePos.x + tgtHandle.x + tgtHandle.width / 2,
                y: nodePos.y + tgtHandle.y + tgtHandle.height / 2
              };

              const dx = srcHandlePos.x - tgtHandlePos.x;
              const dy = srcHandlePos.y - tgtHandlePos.y;
              const distance = Math.sqrt(dx * dx + dy * dy);

              if (distance < minDistance) {
                minDistance = distance;
                closestEdge = {
                  id: `temp-${internalNode.id}-${srcHandle.id}-to-${node.id}-${tgtHandle.id}`,
                  source: internalNode.id,
                  sourceHandle: srcHandle.id,
                  target: node.id,
                  targetHandle: tgtHandle.id,
                  className: 'temp'
                };
              }
            });
          }
        });
      }

      // Check target->source connections
      if (draggedHandles.target) {
        draggedHandles.target.forEach((tgtHandle) => {
          const tgtHandlePos = {
            x: draggedPos.x + tgtHandle.x + tgtHandle.width / 2,
            y: draggedPos.y + tgtHandle.y + tgtHandle.height / 2
          };

          if (nodeHandles.source) {
            nodeHandles.source.forEach((srcHandle) => {
              const srcHandlePos = {
                x: nodePos.x + srcHandle.x + srcHandle.width / 2,
                y: nodePos.y + srcHandle.y + srcHandle.height / 2
              };

              const dx = tgtHandlePos.x - srcHandlePos.x;
              const dy = tgtHandlePos.y - srcHandlePos.y;
              const distance = Math.sqrt(dx * dx + dy * dy);

              if (distance < minDistance) {
                minDistance = distance;
                closestEdge = {
                  id: `temp-${node.id}-${srcHandle.id}-to-${internalNode.id}-${tgtHandle.id}`,
                  source: node.id,
                  sourceHandle: srcHandle.id,
                  target: internalNode.id,
                  targetHandle: tgtHandle.id,
                  className: 'temp'
                };
              }
            });
          }
        });
      }
    });

    return closestEdge;
  }, [store, getInternalNode]);

  const onNodeDrag = useCallback(
    (_, node) => {
      const closeEdge = getClosestEdge(node);

      setEdges((es) => {
        const nextEdges = es.filter((e) => e.className !== 'temp');
        if (closeEdge !== null) {
          nextEdges.push(closeEdge);
        }
        return nextEdges;
      });
    },
    [getClosestEdge, setEdges],
  );

  const onNodeDragStop = useCallback(
    (_, node) => {
      setEdges((es) => {
        const nextEdges = es.filter((e) => e.className !== 'temp');
        const closeEdge = getClosestEdge(node);

        if (closeEdge) {
          return addEdge({
            source: closeEdge.source,
            sourceHandle: closeEdge.sourceHandle,
            target: closeEdge.target,
            targetHandle: closeEdge.targetHandle
          }, nextEdges);
        }

        return nextEdges;
      });
    },
    [getClosestEdge, setEdges],
  );

  const saveCircuit = () => {
    const flowData = {
      nodes: nodes.map(node => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: node.data,
        // Include any other necessary node properties
      })),
      edges: edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle,
        // Include any other necessary edge properties
      }))
    };

    // Create downloadable JSON file
    const dataStr = "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(flowData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "circuit.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const loadCircuit = (event) => {
    const fileReader = new FileReader();
    fileReader.readAsText(event.target.files[0]);
    fileReader.onload = (e) => {
      const circuitData = JSON.parse(e.target.result);

      // Reset existing flow
      setNodes([]);
      setEdges([]);

      // Add timeout to ensure reset completes
      setTimeout(() => {
        setNodes(circuitData.nodes || []);
        setEdges(circuitData.edges || []);
      }, 100);
    };
  };

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
        { id: 'andNode', label: 'AND', icon: AndGate },
        { id: 'orNode', label: 'OR', icon: OrGate },
        { id: 'notNode', label: 'NOT', icon: NotGate },
        { id: 'nandNode', label: 'NAND', icon: NandGate },
        { id: 'norNode', label: 'NOR', icon: NorGate },
        { id: 'xorNode', label: 'XOR', icon: XorGate },
      ]
    },
    {
      header: "Advanced Logic Elements",
      gates: [
        { id: 'inputNode', label: 'input', icon: InputGate },
        { id: 'outputNode', label: 'output', icon: OutputGate },
      ]
    },
    {
      header: "Pins",
      gates: [
        { id: 'inputNode', label: 'input', icon: InputGate },
        { id: 'outputNode', label: 'output', icon: OutputGate },
      ]
    },
    {
      header: "Custom Logic Elements",
      gates: [
        { id: 'notNode', label: 'NOT', icon: NotGate },
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
    <div style={{ height: '100%' }}>
      <ReactFlow
        ref={ref}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeDrag={onNodeDrag}
        onNodeDragStop={onNodeDragStop}
        onConnect={onConnect}
        onPaneClick={onPaneClick}
        onNodeContextMenu={onNodeContextMenu}
        isValidConnection={validateConnection}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        panOnScroll
        selectionOnDrag
        panOnDrag={panOnDrag}
        nodeTypes={nodeTypes}
        selectionMode={SelectionMode.Partial}
        snapToGrid={true}
        snapGrid={[GAP_SIZE, GAP_SIZE]}
        minZoom={0.1}
        maxZoom={10}
      >
        <Background
          offset={[10.5, 5.5]}

          gap={GAP_SIZE}
          size={0.8}
          variant={variant}
        />
        <Controls/>
        {showMinimap && (<MiniMap className='miniMap'
          position="top-right"
        />)}
        {menu && <ContextMenu onClick={onPaneClick} {...menu} />}
      </ReactFlow>
      <div>
        <button className="openCircuitsMenuButton" onClick={() => setCircuitsMenuState(!circuitsMenuState)}>
          <img
            src="../assets/circuitsMenu/menu.svg"
            alt="open/close menu"
            className={"openCircuitsMenuButtonIcon"}
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



        {/*<button*/}
        {/*    onClick={saveCircuit}*/}
        {/*    style={{*/}
        {/*        marginTop: '20px',*/}
        {/*        padding: '10px',*/}
        {/*        background: '#4CAF50',*/}
        {/*        color: 'white',*/}
        {/*        border: 'none',*/}
        {/*        borderRadius: '4px',*/}
        {/*        cursor: 'pointer'*/}
        {/*    }}*/}
        {/*>*/}
        {/*    Save Circuit*/}
        {/*</button>*/}

        <div className={`backdrop ${openSettings ? 'cover' : ''}`}
             onClick={() => setOpenSettings(false)}>
        </div>

        <div className={`settingsMenu ${openSettings ? 'showed' : ''}`}>
          <p className={'settingsMenuTitle'}>Settings</p>



          <div className="minimapSwitchBlock">
            <p className={'minimapSwitchLabel'}>Show mini-map</p>
            <MinimapSwitch
              className={'minimapSwitch'}
              minimapState={showMinimap}
              minimapToggle={setShowMinimap}
            />
          </div>

          <div className="backgroundVariantBlock">
            <p className={'minimapSwitchLabel'}>Canvas background</p>
            <label htmlFor="selectBackground"></label>
            <SelectDemo
              currentBG={currentBG}
              setCurrentBG={setCurrentBG}
              className={'selectBG'}
            />
          </div>

          <button className={""} onClick={saveCircuit}>Save Circuit</button>
          <input
            type="file"
            accept=".json"
            onChange={loadCircuit}
            style={{ marginTop: '10px' }}
          />
        </div>

        <div className={`circuitsMenu ${circuitsMenuState ? 'open' : ''}`}>

          <div className="menu-container">
            <div className="menu-header">
              <p className={"circuitsMenuTitle"}>
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
                      {item.gates.map((node) => (
                        <div
                          key={node.id}
                          className="dndnode"
                          draggable = {false}
                          onDragStart={(e) => onDragStart(e, node.id)}
                        >
                          <img
                            src={node.icon}
                            alt={node.label}
                            style={{ width: '50px', height: 'auto' }}
                            draggable = {true}
                          />
                          <span draggable = {false}>{node.label}</span>
                        </div>
                      ))}
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
              setPanOnDrag([1, 2])
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
