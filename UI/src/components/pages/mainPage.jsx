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

//Importing components
import CircuitsMenu from "./mainPage/circuitsMenu.jsx";
import Toolbar from "./mainPage/toolbar.jsx";
import Settings from "./mainPage/settings.jsx";

import NodeContextMenu from "../codeComponents/NodeContextMenu.jsx";
import EdgeContextMenu from "../codeComponents/EdgeContextMenu.jsx";
import { nodeTypes } from "../codeComponents/nodes.js";

import { IconSettings, IconMenu } from "../../../assets/ui-icons.jsx";
import { useHotkeys } from "./mainPage/useHotkeys.js";
import { Toaster } from "react-hot-toast";

import { handleSimulateClick } from "./mainPage/runnerHandler.jsx";
import { updateInputState } from "./mainPage/runnerHandler.jsx";
import { LOG_LEVELS } from "../codeComponents/logger.jsx";
import { nanoid } from "nanoid";
import {Link} from "react-router-dom";

import { copyElements as copyElementsUtil } from "../utils/copyElements.js";
import { cutElements as cutElementsUtil } from "../utils/cutElements.js";
import { pasteElements as pasteElementsUtil } from "../utils/pasteElements.js";
import { deleteSelectedElements as deleteSelectedUtil } from "../utils/deleteSelectedElements.js";
import { deselectAll as deselectAllUtil } from "../utils/deselectAll.js";
import { getSelectedElements as getSelectedUtil } from "../utils/getSelectedElements.js";
import { isValidConnection as isValidConnectionUtil } from "../utils/isValidConnection.js";
import { selectAll as selectAllUtil } from "../utils/selectAll.js";
import TabsContainer from "./mainPage/tabs.jsx";
import { saveCircuit as saveCircuitUtil } from "../utils/saveCircuit.js";
import { loadCircuit as loadCircuitUtil } from "../utils/loadCircuit.js";
import { spawnCircuit as spawnCircuitUtil } from "../utils/spawnCircuit.js";
import { calculateContextMenuPosition } from "../utils/calculateContextMenuPosition.js";
import { onDrop as onDropUtil } from "../utils/onDrop.js";
import { onNodeDragStop as onNodeDragStopUtil } from "../utils/onNodeDragStop.js";
import { loadLocalStorage } from "../utils/loadLocalStorage.js";

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
const STORAGE_KEY = "myCircuits";

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

  // Хуки React Flow
  const [nodes, setNodes, onNodesChangeFromHook] = useNodesState([]);
  const [edges, setEdges, onEdgesChangeFromHook] = useEdgesState([]);

  const [tabs, setTabs] = useState([]);
  const [activeTabId, setActiveTabId] = useState(null);

  // Если где-то нужен доступ через рефы — поддерживаем их
  const nodesRef = useRef(nodes);
  const edgesRef = useRef(edges);

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

  // 1) Загрузка списка вкладок и сохранённого activeTabId из localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const { tabs: savedTabs, activeTabId: savedActive } =
          JSON.parse(stored);
        if (Array.isArray(savedTabs) && savedActive != null) {
          setTabs(savedTabs);
          setActiveTabId(savedActive);
          return;
        }
      } catch {}
    }
    // Если в хранилище ничего нет — создаём одну начальную вкладку
    const initial = [{ id: newId(), title: "New Tab", nodes: [], edges: [] }];
    setTabs(initial);
    setActiveTabId(initial[0].id);
  }, []);

  // 2) Получение текущей активной вкладки по её id
  const activeTab = tabs.find((t) => t.id === activeTabId) || {
    nodes: [],
    edges: [],
  };

  // 3) При смене вкладки: проставляем её nodes/edges в локальный стейт ReactFlow
  useEffect(() => {
    setNodes(activeTab.nodes);
    setEdges(activeTab.edges);
  }, [activeTabId]);

  // 4) Обновляем внешние рефы, если они используются в другой логике вне ReactFlow
  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  useEffect(() => {
    edgesRef.current = edges;
  }, [edges]);

  // 5) Синхронизация изменений из ReactFlow обратно в массив tabs:
  //    5a) при любом обновлении nodes сохраняем их в текущей вкладке
  useEffect(() => {
    setTabs((prev) =>
      prev.map((tab) => (tab.id === activeTabId ? { ...tab, nodes } : tab)),
    );
  }, [nodes, activeTabId]);

  //    5b) при любом обновлении edges сохраняем их в текущей вкладке
  useEffect(() => {
    setTabs((prev) =>
      prev.map((tab) => (tab.id === activeTabId ? { ...tab, edges } : tab)),
    );
  }, [edges, activeTabId]);

  useEffect(() => {
    if (activeTabId == null) return; // если ещё не инициализировались — пропускаем
    const toStore = { tabs, activeTabId }; // вся структура
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  }, [tabs, activeTabId]);

  const [clipboard, setClipboard] = useState({ nodes: [], edges: [] });
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const newId = () => nanoid();

  // Update the ref in a window mousemove listener
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
  }, [nodes]); // Runs when node selection changes

  // Update getSelectedElements
  const getSelectedElements = useCallback(() => {
    return getSelectedUtil(nodes, edges);
  });

  const isValidConnection = useCallback(
    (connection) => isValidConnectionUtil(connection, edgesRef.current),
    [edgesRef],
  );

  const selectAll = useCallback(() => {
    const { nodes: newNodes, edges: newEdges } = selectAllUtil(nodes, edges);
    setNodes(newNodes);
    setEdges(newEdges);
  }, [nodes, edges, setNodes, setEdges]);

  const deselectAll = useCallback(() => {
    const { nodes: newNodes, edges: newEdges } = deselectAllUtil(nodes, edges);
    setNodes(newNodes);
    setEdges(newEdges);
  }, [nodes, edges, setNodes, setEdges]);

  const deleteSelectedElements = useCallback(() => {
    const selected = getSelectedElements();
    const { newNodes, newEdges } = deleteSelectedUtil(nodes, edges, selected);
    setNodes(newNodes);
    setEdges(newEdges);
  }, [nodes, edges, clipboard]);

  const copyElements = useCallback(() => {
    copyElementsUtil({
      getSelectedElements,
      setClipboard,
    });
  }, [nodes, edges, getSelectedElements]);

  const cutElements = useCallback(() => {
    cutElementsUtil({
      getSelectedElements,
      setClipboard,
      deleteSelectedElements,
    });
  }, [getSelectedElements]);

  const pasteElements = useCallback(() => {
    pasteElementsUtil({
      clipboard,
      mousePosition: mousePositionRef.current,
      reactFlowInstance,
      setNodes,
      setEdges,
      newId,
    });
  }, [clipboard, reactFlowInstance]);

  useEffect(() => {
    loadLocalStorage({
      setCurrentBG,
      setShowMinimap,
      setTheme,
      setActiveAction,
      setActiveWire,
      setOpenSettings,
      setCircuitsMenuState,
      setLogLevel,
      setToastPosition,
    });
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

  //Sets current theme to the whole document
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  //Create new node after dragAndDrop
  const onDrop = useCallback(
    (event) => {
      deselectAll();
      onDropUtil(event, reactFlowInstance, () => newId(), setNodes);
    },
    [reactFlowInstance, setNodes, deselectAll],
  );

  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  );

  const onNodeContextMenu = useCallback((event, node) => {
    event.preventDefault();
    const pane = ref.current.getBoundingClientRect();
    setMenu(calculateContextMenuPosition(event, node, pane));
  }, []);

  const onEdgeContextMenu = useCallback((event, edge) => {
    event.preventDefault();
    const pane = ref.current.getBoundingClientRect();
    setMenu(calculateContextMenuPosition(event, edge, pane));
  }, []);

  const onPaneClick = useCallback(() => setMenu(null), []);

  //Allows user to download circuit JSON
  const saveCircuit = () => saveCircuitUtil(nodes, edges);

  const loadCircuit = useCallback(
    (event) => {
      loadCircuitUtil(event, setNodes, setEdges);
    },
    [setNodes, setEdges],
  );

  const spawnCircuit = useCallback(
    (type) => {
      deselectAll();
      spawnCircuitUtil(type, reactFlowInstance, setNodes, () => newId());
    },
    [reactFlowInstance, setNodes, deselectAll],
  );

  const onNodeDragStop = useCallback(
    onNodeDragStopUtil({
      nodes,
      setEdges,
      getInternalNode,
      store,
      addEdge,
    }),
    [nodes, setEdges, getInternalNode, store],
  );

  const variant =
    currentBG === "dots"
      ? BackgroundVariant.Dots
      : currentBG === "cross"
        ? BackgroundVariant.Cross
        : BackgroundVariant.Lines;

  //Hotkeys handler
  useHotkeys(
    {
      saveCircuit,
      nodes,
      edges,
      openSettings,
      setOpenSettings,
      copyElements,
      cutElements,
      pasteElements,
      selectAll,
      deselectAll,
      handleSimulateClick,
      simulateState,
      setSimulateState,
      setActiveAction,
      setPanOnDrag,
      setActiveWire,
      socketRef,
      handleOpenClick,
    },
    [
      saveCircuit,
      nodes,
      edges,
      openSettings,
      setOpenSettings,
      copyElements,
      cutElements,
      pasteElements,
      selectAll,
      deselectAll,
      handleSimulateClick,
      simulateState,
      setSimulateState,
      setActiveAction,
      setPanOnDrag,
      setActiveWire,
      socketRef,
      handleOpenClick,
    ],
  );

  return (
    <NotificationsLevelContext.Provider value={{ logLevel, setLogLevel }}>
      <SimulateStateContext.Provider
        value={{ simulateState, setSimulateState, updateInputState }}
      >
        <div className={"main-tabs-wrapper"}>
          <TabsContainer
            tabs={tabs}
            activeTabId={activeTabId}
            onTabsChange={setTabs}
            onActiveTabIdChange={setActiveTabId}
          />
        </div>

        <>
          <ReactFlow
            style={{ backgroundColor: "var(--main-2)" }}
            ref={ref}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChangeFromHook}
            onEdgesChange={onEdgesChangeFromHook}
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
            isValidConnection={isValidConnection}
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
            onDelete={deleteSelectedElements}
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

          <Link
            to="/auth"
            className="login-button"
            style={{ textDecoration: "none" }}
          >
            <span className="login-button-text">Log in</span>
          </Link>

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
