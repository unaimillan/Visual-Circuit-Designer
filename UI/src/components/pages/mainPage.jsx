import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useContext,
  createContext,
} from "react";

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
} from "@xyflow/react";

import { nanoid } from "nanoid";

//Importing components
import CircuitsMenu from "./mainPage/circuitsMenu.jsx";
import Toolbar from "./mainPage/toolbar.jsx";
import NodeContextMenu from "../codeComponents/NodeContextMenu.jsx";
import EdgeContextMenu from "../codeComponents/EdgeContextMenu.jsx";

import { initialNodes, nodeTypes } from "../codeComponents/nodes.js";
import { initialEdges } from "../codeComponents/edges.js";

import { IconSettings, IconMenu } from "../../../assets/ui-icons.jsx";

import { handleSimulateClick } from "./mainPage/runnerHandler.jsx";

import { updateInputState } from "./mainPage/runnerHandler.jsx";
import { Toaster } from "react-hot-toast";
import { Settings } from "./mainPage/settings.jsx";
import { LOG_LEVELS } from "../codeComponents/logger.jsx";

import {
  getSelectedElements,
  isValidConnection,
  selectAll,
  deselectAll,
} from "../utils/flowHelpers";

export const SimulateStateContext = createContext({
  simulateState: "idle",
  setSimulateState: () => {},
  updateInputState: () => {},
});

export const NotificationsLevelContext = createContext({
  logLevel: "idle",
  setLogLevel: () => {},
});

export function useSimulateState() {
  const context = useContext(SimulateStateContext);
  if (!context)
    throw new Error(
      "useSimulateState must be used within SimulateStateProvider",
    );
  return context;
}

export function useNotificationsLevel() {
  const context = useContext(NotificationsLevelContext);
  if (!context)
    throw new Error(
      "useNotificationsLevel must be used within NotificationsLevelProvider",
    );
  return context;
}

const GAP_SIZE = 10;
const MIN_DISTANCE = 1;

export default function Main() {
  const [circuitsMenuState, setCircuitsMenuState] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [activeAction, setActiveAction] = useState("cursor");
  const [activeWire, setActiveWire] = useState("default");
  const [currentBG, setCurrentBG] = useState("dots");
  const [showMinimap, setShowMinimap] = useState(true);
  const [simulateState, setSimulateState] = useState("idle");
  const [theme, setTheme] = useState("light");
  const [toastPosition, setToastPosition] = useState("top-center");
  const [logLevel, setLogLevel] = useState(LOG_LEVELS.ERROR);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [menu, setMenu] = useState(null);

  const ref = useRef(null);
  const store = useStoreApi();
  const { getInternalNode } = useReactFlow();
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [panOnDrag, setPanOnDrag] = useState([2]);

  const socketRef = useRef(null);

  const fileInputRef = useRef(null);

  const handleOpenClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  //Load saved settings from localStorage
  const nodesRef = useRef(nodes);
  const edgesRef = useRef(edges);

  const [clipboard, setClipboard] = useState({ nodes: [], edges: [] });
  const [cutMode, setCutMode] = useState(false);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const newId = () => nanoid();

  useEffect(() => {
    const handleMouseMove = (event) => {
      mousePositionRef.current = {
        x: event.clientX,
        y: event.clientY,
      };
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const selectedNodeIds = new Set(
      nodes.filter((node) => node.selected).map((node) => node.id),
    );

    setEdges((edges) =>
      edges.map((edge) => {
        const isBetweenSelected =
          selectedNodeIds.has(edge.source) && selectedNodeIds.has(edge.target);

        return isBetweenSelected ? { ...edge, selected: true } : edge;
      }),
    );
  }, [nodes]);

  const handleGetSelectedElements = useCallback(() => {
    return getSelectedElements(nodes, edges);
  });

  const validateConnection = useCallback(
    (connection) => isValidConnection(connection, edgesRef.current),
    [edgesRef],
  );

  const handleSelectAll = useCallback(() => {
    const { nodes: newNodes, edges: newEdges } = selectAll(nodes, edges);
    setNodes(newNodes);
    setEdges(newEdges);
  }, [nodes, edges, setNodes, setEdges]);

  const handleDeselectAll = useCallback(() => {
    const { nodes: newNodes, edges: newEdges } = deselectAll(nodes, edges);
    setNodes(newNodes);
    setEdges(newEdges);
  }, [nodes, edges, setNodes, setEdges]);

  const copyElements = useCallback(() => {
    const selected = handleGetSelectedElements();
    if (selected.nodes.length === 0) return;

    setClipboard(selected);
    setCutMode(false);
    console.log(
      "Copied:",
      selected.nodes.length,
      "nodes and",
      selected.edges.length,
      "edges",
    );
  }, [nodes, edges, handleGetSelectedElements]);

  const cutElements = useCallback(() => {
    const selected = handleGetSelectedElements();
    if (selected.nodes.length === 0 && selected.edges.length === 0) return;

    setClipboard(selected);
    setCutMode(true);

    const selectedNodeIds = new Set(selected.nodes.map((n) => n.id));
    const selectedEdgeIds = new Set(selected.edges.map((e) => e.id));

    setNodes((nodes) => nodes.filter((node) => !selectedNodeIds.has(node.id)));
    setEdges((edges) => edges.filter((edge) => !selectedEdgeIds.has(edge.id)));

    console.log(
      "Cut:",
      selected.nodes.length,
      "nodes and",
      selected.edges.length,
      "edges",
    );
  }, [nodes, edges, handleGetSelectedElements]);

  const pasteElements = useCallback(() => {
    if (!reactFlowInstance) {
      console.error("React Flow instance not available");
      return;
    }

    setNodes((prevNodes) =>
      prevNodes.map((node) => ({ ...node, selected: false })),
    );
    setEdges((prevEdges) =>
      prevEdges.map((edge) => ({ ...edge, selected: false })),
    );

    if (clipboard.nodes.length === 0) return;

    const flowPosition = reactFlowInstance.screenToFlowPosition({
      x: mousePositionRef.current.x,
      y: mousePositionRef.current.y,
    });

    const offset = {
      x: flowPosition.x - clipboard.nodes[0].position.x,
      y: flowPosition.y - clipboard.nodes[0].position.y,
    };

    const nodeIdMap = {};
    const newNodes = clipboard.nodes.map((node) => {
      const id = newId();
      nodeIdMap[node.id] = id;

      return {
        ...node,
        id: id,
        position: {
          x: node.position.x + offset.x,
          y: node.position.y + offset.y,
        },
        selected: true,
        data: {
          ...node.data,
          customId: newId,
        },
      };
    });

    const newEdges = clipboard.edges.map((edge) => ({
      ...edge,
      id: newId(),
      source: nodeIdMap[edge.source] || edge.source,
      target: nodeIdMap[edge.target] || edge.target,
    }));

    setNodes((nds) => nds.concat(newNodes));
    setEdges((eds) => eds.concat(newEdges));

    if (cutMode) {
      setClipboard({ nodes: [], edges: [] });
      setCutMode(false);
    }
  }, [clipboard, cutMode, reactFlowInstance]);

  const deleteSelected = useCallback(() => {
    const selected = handleGetSelectedElements();
    if (selected.nodes.length === 0 && selected.edges.length === 0) return;

    const selectedNodeIds = new Set(selected.nodes.map((n) => n.id));
    const selectedEdgeIds = new Set(selected.edges.map((e) => e.id));

    setNodes((nodes) => nodes.filter((node) => !selectedNodeIds.has(node.id)));
    setEdges((edges) => edges.filter((edge) => !selectedEdgeIds.has(edge.id)));

    console.log(
      "Deleted:",
      selected.nodes.length,
      "nodes and",
      selected.edges.length,
      "edges",
    );
  }, [nodes, edges, handleGetSelectedElements]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case "c":
          case "с":
            event.preventDefault();
            copyElements();
            break;
          case "x":
          case "ч":
            event.preventDefault();
            cutElements();
            break;
          case "v":
          case "м":
            pasteElements();
            event.preventDefault();
            break;
          case "a":
          case "ф":
            event.preventDefault();
            handleSelectAll();
            break;
          case "d":
          case "в":
            event.preventDefault();
            handleDeselectAll();
            break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    copyElements,
    cutElements,
    pasteElements,
    handleSelectAll,
    handleDeselectAll,
    deleteSelected,
  ]);

  useEffect(() => {
    const savedCircuit = localStorage.getItem("savedCircuit");
    if (savedCircuit) {
      try {
        const circuitData = JSON.parse(savedCircuit);
        setNodes(circuitData.nodes || []);
        setEdges(circuitData.edges || []);
      } catch (e) {
        setNodes(initialNodes);
        setEdges(initialEdges);
      }
    } else {
      setNodes(initialNodes);
      setEdges(initialEdges);
    }
  }, []);

  useEffect(() => {
    const circuitData = JSON.stringify({ nodes, edges });
    localStorage.setItem("savedCircuit", circuitData);
  }, [nodes, edges]);

  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  useEffect(() => {
    edgesRef.current = edges;
  }, [edges]);

  useEffect(() => {
    const saved = localStorage.getItem("userSettings");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.currentBG) setCurrentBG(parsed.currentBG);
      if (typeof parsed.showMinimap === "boolean")
        setShowMinimap(parsed.showMinimap);
      if (parsed.theme) setTheme(parsed.theme);
      if (parsed.activeAction) setActiveAction(parsed.activeAction);
      if (parsed.activeWire) setActiveWire(parsed.activeWire);
      if (typeof parsed.openSettings === "boolean")
        setOpenSettings(parsed.openSettings);
      if (typeof parsed.circuitsMenuState === "boolean")
        setCircuitsMenuState(parsed.circuitsMenuState);
      if (parsed.logLevel) setLogLevel(parsed.logLevel);
      if (parsed.toastPosition) setToastPosition(parsed.toastPosition);
    }
  }, []);

  //Saves user setting to localStorage
  useEffect(() => {
    const settings = {
      currentBG,
      showMinimap,
      theme,
      activeAction,
      activeWire,
      openSettings,
      circuitsMenuState,
      logLevel,
      toastPosition,
    };
    localStorage.setItem("userSettings", JSON.stringify(settings));
  }, [
    currentBG,
    showMinimap,
    theme,
    activeAction,
    activeWire,
    openSettings,
    circuitsMenuState,
    logLevel,
    toastPosition,
  ]);

  //Hotkeys handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;

      //Ctrl + Shift + S - Open/close settings
      if (isCtrlOrCmd && e.shiftKey && e.key.toLowerCase() === "s") {
        e.preventDefault();
        setOpenSettings((prev) => !prev);
        return;
      }

      //Ctrl + S - Save circuit.json
      if (isCtrlOrCmd && e.key.toLowerCase() === "s") {
        e.preventDefault();
        saveCircuit();
        return;
      }

      //Ctrl + Shift + R - Start/stop simulation
      if (isCtrlOrCmd && e.shiftKey && e.key.toLowerCase() === "r") {
        e.preventDefault();
        handleSimulateClick({
          simulateState,
          setSimulateState,
          socketRef,
          nodes,
          edges,
        });
        return;
      }

      //Ctrl + Shift + O - Load file
      if (isCtrlOrCmd && e.key.toLowerCase() === "o") {
        e.preventDefault();

        handleOpenClick();

        return;
      }

      //1...6 - Change selected tool
      const hotkeys = {
        1: () => {
          setActiveAction("cursor");
          setPanOnDrag([2]);
        },
        2: () => {
          setActiveAction("hand");
          setPanOnDrag(true);
        },
        3: () => setActiveAction("eraser"),
        4: () => setActiveAction("text"),
        5: () => setActiveWire("default"),
        6: () => setActiveWire("step"),
        7: () => setActiveWire("straight"),

      };
      if (hotkeys[e.key]) {
        e.preventDefault();
        hotkeys[e.key]();
      }

      //Escape to close Settings
      if (e.key === "Escape" && openSettings) {
        setOpenSettings(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openSettings]);

  //Sets current theme to the whole document (наверное)
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  //Create new node after dragAndDrop
  const onDrop = (event) => {
    event.preventDefault();
    const type = event.dataTransfer.getData("application/reactflow");
    if (!type || !reactFlowInstance) return;

    const position = reactFlowInstance.screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    const newNode = {
      id: `${type}_${Date.now()}`,
      type,
      position,
      data: { customId: `${type}_${Date.now()}` },
    };

    setNodes((nds) => nds.concat(newNode));
  };

  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  );

  const onNodeContextMenu = useCallback((event, node) => {
    event.preventDefault();
    const pane = ref.current.getBoundingClientRect();
    setMenu({
      id: node.id,
      name: node.type,
      type: "node",
      top: event.clientY < pane.height - 200 && event.clientY,
      left: event.clientX < pane.width - 200 && event.clientX,
      right: event.clientX >= pane.width - 200 && pane.width - event.clientX,
      bottom: event.clientY >= pane.height - 200 && pane.height - event.clientY,
    });
  }, []);

  const onEdgeContextMenu = useCallback((event, edge) => {
    event.preventDefault();
    const pane = ref.current.getBoundingClientRect();
    setMenu({
      id: edge.id,
      name: edge.type,
      type: "edge",
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
      nodes: nodes.map((n) => ({
        id: n.id,
        type: n.type,
        position: n.position,
        data: n.data,
      })),
      edges: edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        sourceHandle: e.sourceHandle,
        targetHandle: e.targetHandle,
      })),
    };

    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(flowData, null, 2));
    const downloadAnchorNode = document.createElement("a");
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
      id: `${type}_${Date.now()}`,
      type,
      position,
      data: {
        customId: `${type}_${Date.now()}`,
        simState: simulateState,
        value: false,
      },
    };

    setNodes((nds) => nds.concat(newNode));
  };

  const getClosestEdge = useCallback(
    (draggedNode) => {
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
              y: draggedPos.y + srcHandle.y + srcHandle.height / 2,
            };

            if (nodeHandles.target) {
              nodeHandles.target.forEach((tgtHandle) => {
                const alreadyUsed = edgesRef.current.some(
                  (e) =>
                    e.target === node.id && e.targetHandle === tgtHandle.id,
                );
                if (alreadyUsed) return;

                const tgtHandlePos = {
                  x: nodePos.x + tgtHandle.x + tgtHandle.width / 2,
                  y: nodePos.y + tgtHandle.y + tgtHandle.height / 2,
                };

                const dx = srcHandlePos.x - tgtHandlePos.x;
                const dy = srcHandlePos.y - tgtHandlePos.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < minDistance) {
                  minDistance = distance;
                  closestEdge = {
                    id: `temp_${internalNode.id}_${srcHandle.id}_to_${node.id}_${tgtHandle.id}`,
                    source: internalNode.id,
                    sourceHandle: srcHandle.id,
                    target: node.id,
                    targetHandle: tgtHandle.id,
                    className: "temp",
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
              y: draggedPos.y + tgtHandle.y + tgtHandle.height / 2,
            };

            if (nodeHandles.source) {
              nodeHandles.source.forEach((srcHandle) => {
                const alreadyUsed = edgesRef.current.some(
                  (e) =>
                    e.target === internalNode.id &&
                    e.targetHandle === tgtHandle.id,
                );
                if (alreadyUsed) return;

                const srcHandlePos = {
                  x: nodePos.x + srcHandle.x + srcHandle.width / 2,
                  y: nodePos.y + srcHandle.y + srcHandle.height / 2,
                };

                const dx = tgtHandlePos.x - srcHandlePos.x;
                const dy = tgtHandlePos.y - srcHandlePos.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < minDistance) {
                  minDistance = distance;
                  closestEdge = {
                    id: `temp_${node.id}_${srcHandle.id}_to_${internalNode.id}_${tgtHandle.id}`,
                    source: node.id,
                    sourceHandle: srcHandle.id,
                    target: internalNode.id,
                    targetHandle: tgtHandle.id,
                    className: "temp",
                  };
                }
              });
            }
          });
        }
      });

      return closestEdge;
    },
    [store, getInternalNode],
  );

  const onNodeDragStop = useCallback(
    (_, node) => {
      setEdges((es) => {
        const nextEdges = es.filter((e) => e.className !== "temp");
        const closeEdge = getClosestEdge(node);
        if (closeEdge) {
          return addEdge(
            {
              type: "straight",
              source: closeEdge.source,
              sourceHandle: closeEdge.sourceHandle,
              target: closeEdge.target,
              targetHandle: closeEdge.targetHandle,
            },
            nextEdges,
          );
        }
        return nextEdges;
      });
    },
    [getClosestEdge, setEdges],
  );

  const variant =
    currentBG === "dots"
      ? BackgroundVariant.Dots
      : currentBG === "cross"
        ? BackgroundVariant.Cross
        : BackgroundVariant.Lines;

  return (
    <NotificationsLevelContext.Provider value={{ logLevel, setLogLevel }}>
      <SimulateStateContext.Provider
        value={{ simulateState, setSimulateState, updateInputState }}
      >
        <>
          <ReactFlow
            style={{ backgroundColor: "var(--main-2)" }}
            ref={ref}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            defaultEdgeOptions={{
              type: activeWire,
            }}
            onNodeContextMenu={onNodeContextMenu}
            onEdgeContextMenu={onEdgeContextMenu}
            onPaneClick={onPaneClick}
            onConnect={onConnect}
            onNodeDragStop={onNodeDragStop}
            onDrop={onDrop}
            onDragOver={(e) => e.preventDefault()}
            onInit={setReactFlowInstance}
            isValidConnection={validateConnection}
            nodeTypes={nodeTypes}
            panOnDrag={panOnDrag}
            selectionOnDrag
            panOnScroll
            snapToGrid
            snapGrid={[GAP_SIZE, GAP_SIZE]}
            selectionMode={SelectionMode.Partial}
            minZoom={0.2}
            maxZoom={10}
            deleteKeyCode={["Delete", "Backspace"]}
            onDelete={deleteSelected}
            // onlyRenderVisibleElements={true}
          >
            <Background
              offset={[10.5, 5]}
              bgColor="var(--main-1)"
              color="var(--main-4)"
              gap={GAP_SIZE}
              size={1.6}
              variant={variant}
              style={{ transition: "var(--ttime)" }}
            />
            <Controls
              className="controls"
              style={{ transition: "var(--ttime)" }}
            />
            {showMinimap && (
              <MiniMap
                className="miniMap"
                bgColor="var(--main-3)"
                maskColor="var(--mask)"
                nodeColor="var(--main-4)"
                position="top-right"
                style={{
                  borderRadius: "0.5rem",
                  overflow: "hidden",
                  transition:
                    "background-color var(--ttime),border var(--ttime)",
                }}
              />
            )}
          </ReactFlow>

          {menu && menu.type === "node" && (
            <NodeContextMenu onClick={onPaneClick} {...menu} />
          )}

          {menu && menu.type === "edge" && (
            <EdgeContextMenu onClick={onPaneClick} {...menu} />
          )}

          <Toaster
            position={toastPosition}
            toastOptions={{
              style: {
                backgroundColor: "var(--main-2)",
                color: "var(--main-0)",
                fontSize: "12px",
                borderRadius: "0.5rem",
                padding: "10px 25px 10px 10px",
                border: "0.05rem solid var(--main-5)",
                fontFamily: "Montserrat, serif",
              },
              duration: 2000,
              error: {
                duration: 10000,
              },
            }}
          />

          <button
            className="openCircuitsMenuButton"
            onClick={() => setCircuitsMenuState(!circuitsMenuState)}
          >
            <IconMenu
              SVGClassName="openCircuitsMenuButtonIcon"
              draggable="false"
            />
          </button>

          <button
            className="openSettingsButton"
            onClick={() => setOpenSettings(true)}
          >
            <IconSettings
              SVGClassName="openSettingsButtonIcon"
              draggable="false"
            />
          </button>

          <div
            className={`backdrop ${openSettings ? "cover" : ""}${menu ? "show" : ""}`}
            onClick={() => {
              setMenu(null);
              setOpenSettings(false);
            }}
          />
          <Settings
            openSettings={openSettings}
            showMinimap={showMinimap}
            setShowMinimap={setShowMinimap}
            currentBG={currentBG}
            setCurrentBG={setCurrentBG}
            theme={theme}
            setTheme={setTheme}
            toastPosition={toastPosition}
            setToastPosition={setToastPosition}
            currentLogLevel={logLevel}
            setLogLevel={setLogLevel}
            closeSettings={() => {
              setMenu(null);
              setOpenSettings(false);
            }}
          />

          <CircuitsMenu
            circuitsMenuState={circuitsMenuState}
            onDragStart={onDragStart}
            spawnCircuit={spawnCircuit}
          />

          <Toolbar
            simulateState={simulateState}
            setSimulateState={setSimulateState}
            activeAction={activeAction}
            setActiveAction={setActiveAction}
            activeWire={activeWire}
            setActiveWire={setActiveWire}
            setPanOnDrag={setPanOnDrag}
            saveCircuit={saveCircuit}
            loadCircuit={loadCircuit}
            fileInputRef={fileInputRef}
            handleOpenClick={handleOpenClick}
            setMenu={setMenu}
            onSimulateClick={() =>
              handleSimulateClick({
                simulateState,
                setSimulateState,
                socketRef,
                nodes,
                edges,
              })
            }
          />
        </>
      </SimulateStateContext.Provider>
    </NotificationsLevelContext.Provider>
  );
}
