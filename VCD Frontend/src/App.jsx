import React, {useEffect, useState, useCallback} from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  addEdge,
  SelectionMode,
  useNodesState,
  useEdgesState,
  MiniMap,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import AndGate from '../assets/circuitsMenu/AND.svg';
import OrGate from '../assets/circuitsMenu/OR.svg';
import NotGate from '../assets/circuitsMenu/NOT.svg';
import NandGate from '../assets/circuitsMenu/NAND.svg';
import NorGate from '../assets/circuitsMenu/NOR.svg';
import XorGate from '../assets/circuitsMenu/XOR.svg';

import {initialNodes, nodeTypes} from './components/nodes';
import {initialEdges} from './components/edges';

import './App.css';

const GAP_SIZE = 10;

function App() {
  const [panelState, setPanelState] = useState(false)
  const [openSettings, setOpenSettings] = useState(false)
  const [activeButton, setActiveButton] = useState("cursor")

  /* React Flow */
  const [reactFlowInstance, setReactFlowInstance] = React.useState(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const [panOnDrag, setPanOnDrag] = useState([1, 2]);

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDrop = (event) => {
    event.preventDefault();

    const type = event.dataTransfer.getData('application/reactflow');
    if (!type || !reactFlowInstance) return;

    // Get drop position relative to canvas
    const position = reactFlowInstance.screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    // Create new node
    const newNode = {
      id: `${type}-${Date.now()}`,
      type, // Your custom node type
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
        { id: 'andNode', label: 'AND', icon: AndGate },
        { id: 'orNode', label: 'OR', icon: OrGate },
      ]
    },
    {
      header: "Pins",
      gates: [
        { id: 'andNode', label: 'AND', icon: AndGate },
        { id: 'notNode', label: 'NOT', icon: NotGate },
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
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
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
        fitView fitViewOptions={{ padding: 0.2 }}
      >
        <Background
          offset={[10.5, 5.5]}
          gap={GAP_SIZE}
          size={0.8}
        />
        <Controls/>
        <MiniMap
          position="top-right"
        />
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

        <button onClick={saveCircuit}>Save Circuit</button>
        <input
          type="file"
          accept=".json"
          onChange={loadCircuit}
          style={{ marginTop: '10px' }}
        />

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
                      {item.gates.map((node) => (
                        <div
                          key={node.id}
                          className="dndnode"
                          draggable
                          onDragStart={(e) => onDragStart(e, node.id)}
                        >
                          <img
                            src={node.icon}
                            alt={node.label}
                            style={{ width: '50px', height: 'auto' }}
                          />
                          <span>{node.label}</span>
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
