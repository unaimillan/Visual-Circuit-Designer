import React, {
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';

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

import CircuitsMenu from '../components/mainPage/circuitsMenu.jsx';
import Toolbar from '../components/mainPage/toolbar.jsx';
import ContextMenu from '../components/codeComponents/ContextMenu';

import { initialNodes, nodeTypes } from '../components/codeComponents/nodes';
import { initialEdges } from '../components/codeComponents/edges';
import { MinimapSwitch } from "../components/mainPage/switch.jsx";
import { SelectCanvasBG, SelectTheme } from "../components/mainPage/select.jsx";

import { IconSettings, IconMenu } from '../../assets/ui-icons';
import UserIcon from '../../assets/userIcon.png';

import { Link } from "react-router-dom";

const GAP_SIZE = 10;
const MIN_DISTANCE = 10;

export default function Main() {
  const [circuitsMenuState, setCircuitsMenuState] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [activeButton, setActiveButton] = useState("cursor");
  const [currentBG, setCurrentBG] = useState("dots");
  const [showMinimap, setShowMinimap] = useState(true);
  const [simulateState, setSimulateState] = useState("idle");
  const [theme, setTheme] = useState("light");

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [menu, setMenu] = useState(null);

  const ref = useRef(null);
  const store = useStoreApi();
  const { getInternalNode } = useReactFlow();
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [panOnDrag, setPanOnDrag] = useState([1, 2]);

  //Load saved settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('userSettings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.currentBG) setCurrentBG(parsed.currentBG);
        if (typeof parsed.showMinimap === 'boolean') setShowMinimap(parsed.showMinimap);
        if (parsed.theme) setTheme(parsed.theme);
        if (parsed.activeButton) setActiveButton(parsed.activeButton);
        if (typeof parsed.openSettings === 'boolean') setOpenSettings(parsed.openSettings);
        if (typeof parsed.circuitsMenuState === 'boolean') setCircuitsMenuState(parsed.circuitsMenuState);
      } catch (e) {
        console.error("Ошибка при загрузке настроек из localStorage", e);
      }
    }
  }, []);

  //Saves user setting to localStorage
  useEffect(() => {
    const settings = {
      currentBG,
      showMinimap,
      theme,
      activeButton,
      openSettings,
      circuitsMenuState,
    };
    localStorage.setItem('userSettings', JSON.stringify(settings));
  }, [currentBG, showMinimap, theme, activeButton, openSettings, circuitsMenuState]);



  //Hotkeys handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;

      //Ctrl + Shift + S - Open/close settings
      if (isCtrlOrCmd && e.shiftKey && e.key.toLowerCase() === "s") {
        e.preventDefault();
        setOpenSettings(prev => !prev);
        return;
      }

      //Ctrl + S - Save circuit.json
      if (isCtrlOrCmd && e.key.toLowerCase() === "s") {
        e.preventDefault();
        saveCircuit()
        return;
      }

      //Ctrl + 1...6 - Change selected tool
      const hotkeys = {
        "1": () => { setActiveButton("cursor"); setPanOnDrag([1, 2]); },
        "2": () => { setActiveButton("hand"); setPanOnDrag(true); },
        "3": () => setActiveButton("sqwire"),
        "4": () => setActiveButton("dwire"),
        "5": () => setActiveButton("eraser"),
        "6": () => setActiveButton("text"),
      };
      if ( hotkeys[e.key]) {
        e.preventDefault();
        hotkeys[e.key]();
      }

      //Escape to close Settings
      if (e.key === 'Escape' && openSettings) {
        setOpenSettings(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openSettings]);



  //Sets current theme to the whole document (наверное)
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);


  // const validateConnection = useCallback((connection) => {
  //   return connection.source !== connection.target;
  // }, []);

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
      data: { customId: `${type}-${Date.now()}` }
    };

    setNodes((nds) => nds.concat(newNode));
  };

  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const onNodeContextMenu = useCallback((event, node) => {
    event.preventDefault();
    const pane = ref.current.getBoundingClientRect();
    setMenu({
      id: node.id,
      name: node.type,
      top: event.clientY < pane.height - 200 && event.clientY,
      left: event.clientX < pane.width - 200 && event.clientX,
      right: event.clientX >= pane.width - 200 && pane.width - event.clientX,
      bottom: event.clientY >= pane.height - 200 && pane.height - event.clientY,
    });
  }, []);

  const onPaneClick = useCallback(() => setMenu(null), []);

  //Allows user to download circuit JSON
  const saveCircuit = () => {
    const flowData = {
      nodes: nodes.map(n => ({ id: n.id, type: n.type, position: n.position, data: n.data })),
      edges: edges.map(e => ({ id: e.id, source: e.source, target: e.target }))
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(flowData, null, 2));
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
      setNodes([]);
      setEdges([]);
      setTimeout(() => {
        setNodes(circuitData.nodes || []);
        setEdges(circuitData.edges || []);
      }, 100);
    };
  };

  const spawnCircuit = (type) => {
    const position = reactFlowInstance.screenToFlowPosition({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });

    const newNode = {
      id: `${type}-${Date.now()}`,
      type,
      position,
      data: { customId: `${type}-${Date.now()}` }
    };

    setNodes((nds) => nds.concat(newNode));
  };
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

      const compare = (src, tgt, srcPos, tgtPos) => {
        const dx = srcPos.x - tgtPos.x;
        const dy = srcPos.y - tgtPos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < minDistance) {
          minDistance = distance;
          closestEdge = {
            id: `temp-${src}-${tgt}`,
            source: src,
            sourceHandle: 'a',
            target: tgt,
            targetHandle: 'a',
            className: 'temp'
          };
        }
      };

      if (draggedHandles.source && nodeHandles.target) {
        draggedHandles.source.forEach(src => {
          const srcPos = {
            x: draggedPos.x + src.x + src.width / 2,
            y: draggedPos.y + src.y + src.height / 2,
          };
          nodeHandles.target.forEach(tgt => {
            const tgtPos = {
              x: nodePos.x + tgt.x + tgt.width / 2,
              y: nodePos.y + tgt.y + tgt.height / 2,
            };
            compare(draggedNode.id, node.id, srcPos, tgtPos);
          });
        });
      }

      if (draggedHandles.target && nodeHandles.source) {
        draggedHandles.target.forEach(tgt => {
          const tgtPos = {
            x: draggedPos.x + tgt.x + tgt.width / 2,
            y: draggedPos.y + tgt.y + tgt.height / 2,
          };
          nodeHandles.source.forEach(src => {
            const srcPos = {
              x: nodePos.x + src.x + src.width / 2,
              y: nodePos.y + src.y + src.height / 2,
            };
            compare(node.id, draggedNode.id, srcPos, tgtPos);
          });
        });
      }
    });

    return closestEdge;
  }, [store, getInternalNode]);

  const onNodeDrag = useCallback((_, node) => {
    const closeEdge = getClosestEdge(node);
    setEdges((es) => {
      const nextEdges = es.filter((e) => e.className !== 'temp');
      if (closeEdge !== null) nextEdges.push(closeEdge);
      return nextEdges;
    });
  }, [getClosestEdge, setEdges]);

  const onNodeDragStop = useCallback((_, node) => {
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
  }, [getClosestEdge, setEdges]);

  const variant =
    currentBG === "dots" ? BackgroundVariant.Dots :
      currentBG === "cross" ? BackgroundVariant.Cross :
        BackgroundVariant.Lines;

  return (
    <>
      <ReactFlow
        ref={ref}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeContextMenu={onNodeContextMenu}
        onPaneClick={onPaneClick}
        onConnect={onConnect}
        onNodeDrag={onNodeDrag}
        onNodeDragStop={onNodeDragStop}
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        panOnDrag={panOnDrag}
        panOnScroll
        snapToGrid
        snapGrid={[GAP_SIZE, GAP_SIZE]}
        selectionMode={SelectionMode.Partial}
        minZoom={0.2}
        maxZoom={10}
      >
        <Background
          offset={[10.5, 5.5]}
          bgColor="var(--canvas-bg-color)"
          color="var(--canvas-color)"
          gap={GAP_SIZE}
          size={0.8}
          variant={variant}
        />
        <Controls className="controls" />
        {showMinimap && (
          <MiniMap
            className="miniMap"
            bgColor="var(--canvas-bg-color)"
            maskColor="var(--minimap-mask-color)"
            nodeColor="var(--minimap-node-color)"
            position="top-right"
            style={{ borderRadius: "0.5rem" }}
          />
        )}
        {menu && <ContextMenu onClick={onPaneClick} {...menu} />}
      </ReactFlow>

      <button className="openCircuitsMenuButton" onClick={() => setCircuitsMenuState(!circuitsMenuState)}>
        <IconMenu SVGClassName="openCircuitsMenuButtonIcon" draggable="false" />
      </button>

      <button onClick={() => setOpenSettings(true)} className="openSettingsButton">
        <IconSettings SVGClassName="openSettingsButtonIcon" draggable="false" />
      </button>

      <div className={`backdrop ${openSettings ? "cover" : ""}`} onClick={() => setOpenSettings(false)} />
      <div className={`settingsMenu ${openSettings ? "showed" : ""}`}>
        <p className="settingsMenuTitle">Settings</p>
        <Link to="/profile" className="openProfileButton" style={{ textDecoration: "none" }}>
          <img className="settingUserIcon" src={UserIcon} alt="User" />
          <span className="settingUserName">UserName</span>
        </Link>
        <div className="minimapSwitchBlock">
          <p className="minimapSwitchLabel">Show mini-map</p>
          <MinimapSwitch className="minimapSwitch" minimapState={showMinimap} minimapToggle={setShowMinimap} />
        </div>
        <div className="backgroundVariantBlock">
          <p className="selectCanvasBG">Canvas background</p>
          <SelectCanvasBG currentBG={currentBG} setCurrentBG={setCurrentBG} className="selectBG" />
        </div>
        <div className="backgroundVariantBlock">
          <p className="minimapSwitchLabel">Theme</p>
          <SelectTheme theme={theme} setTheme={setTheme} className="selectTheme" />
        </div>
        <button onClick={saveCircuit}>Save Circuit</button>
        <input type="file" accept=".json" onChange={loadCircuit} style={{ marginTop: "10px" }} />
      </div>

      <CircuitsMenu
        circuitsMenuState={circuitsMenuState}
        onDragStart={onDragStart}
        spawnCircuit={spawnCircuit}
      />

      <Toolbar
        simulateState={simulateState}
        setSimulateState={setSimulateState}
        activeButton={activeButton}
        setActiveButton={setActiveButton}
        setPanOnDrag={setPanOnDrag}
      />
    </>
  );
}
