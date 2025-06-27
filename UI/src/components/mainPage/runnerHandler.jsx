import { io } from "socket.io-client";
import { updateOutputStates } from "../codeComponents/outputStateManager.js";
import toast from "react-hot-toast";
import {IconCloseCross} from "../../../assets/ui-icons.jsx";

let allInputStates = {};
let sendInputStates = null;
let debugMessages = 0; //0-только error, 1 - error + connect + disconnect, 2 - all
// let hoverMessage = "Start simulation"
// { out_output1: 1, out_output2: 0 }

export const handleSimulateClick = ({
  simulateState,
  setSimulateState,
  socketRef,
  nodes,
  edges,
}) => {
  if (simulateState === "awaiting") {
    if (debugMessages === 2) toast('Cancelled connecting', {icon: '🟡',});
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      console.log("[handler]: Socket manually disconnected ❌");
    }

    setSimulateState("idle");
    return;
  }

  if (simulateState === "error") {
    if (debugMessages === 2) toast('Ignored error', {icon: '⚠️',});

    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      console.log("[handler]: Socket manually disconnected ❌");
    }

    setSimulateState("idle");
    return;
  }

  if (simulateState === "idle") {
    setSimulateState("awaiting");
    const inputNodes = nodes.filter((node) => node.type === "inputNode");
    allInputStates = {};
    inputNodes.forEach((node) => {
      const val = node.data.value;
      allInputStates[node.id] = val === 1 || val === "1" ? 1 : 0;
    });

    // Инициализация сокета
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:8000", {
        transports: ["websocket"],
        path: "/socket.io",
      });

      sendInputStates = (changedInputs) => {
        if (!socketRef.current) {
          if (debugMessages === 2) toast('Сannot send input states, socket not connected', {icon: '⚠️',});
          return;
        }
        if (debugMessages === 2) toast('Sending changed input states', {icon: '📤',});
        console.log(
          "📤[handler]: Sending changed input states:",
          changedInputs,
        );
        socketRef.current.emit("set_inputs", { inputs: changedInputs });
      };

      socketRef.current.on("ready", () => {
        if (debugMessages === 2) toast('Connected to the runner', {icon: '✅',});
        setSimulateState("running");

        // Отправляем начальные состояния после подключения
        const initialStates = {};
        for (const nodeId in allInputStates) {
          initialStates[`in_${nodeId}`] = allInputStates[nodeId];
        }
      });

      socketRef.current.on("status", (data) => {
        if (data.msg === "Simulation started") {
          if (debugMessages > 0) toast('Simulation is started', {icon: '✅',});
          setSimulateState("running");

          const initialStates = {};
          for (const nodeId in allInputStates) {
            initialStates[`in_${nodeId}`] = allInputStates[nodeId];
          }

          if (sendInputStates) {
            sendInputStates(initialStates);
          }
        } else {
          console.log("[runner]: Simulation status:", data);
        }
      });

      socketRef.current.on("simulation_outputs", (data) => {
        console.log("[runner]: Simulation data received 📨:", data);
        updateOutputStates(data);
      });

      socketRef.current.on("error", (data) => {
        toast.error((t) => (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              width: '100%',
              maxWidth: '400px', // или ширину, подходящую под твой toast
            }}
          >
            <div style={{ flex: 1, wordBreak: 'break-word' }}>
              Simulation error: {data.msg}
            </div>

            <button
              onClick={() => toast.dismiss(t.id)}
              className={"close-cross"}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px',
                fontSize: '20px', // размер крестика
                flexShrink: 0, // чтобы кнопка не сжималась
              }}
            >
              <IconCloseCross SVGClassName="" />
            </button>
          </div>
        ));


        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
        }
        setSimulateState("error");
        sendInputStates = null;
      });

      socketRef.current.on("disconnect", () => {
        if (debugMessages === 2)
          toast(`Socket disconnected`, {icon: '🔌',});

        if (simulateState !== "running") {
          setSimulateState("idle");
        }
        sendInputStates = null;
      });
    }

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

    if (debugMessages === 2) toast('Sending circuit data', {icon: '📋',});
    console.log("[simulation]: Sending circuit data :", flowData);
    socketRef.current.emit("run_simulation", flowData);
  }

  if (simulateState === "running") {
    toast('Stopping simulation', {icon: '🛑' ,});
    socketRef.current.emit("simulation:stop");
    setSimulateState("idle");
    socketRef.current.disconnect();
    socketRef.current = null;
    sendInputStates = null;
    allInputStates = {};
  }
};

export const updateInputState = (nodeId, value) => {
  if (!sendInputStates && debugMessages === 2) {
    toast('Cannot update input state: simulation not running', {
      icon: '⚠️',
    });
    return;
  }

  // 1. Обновляем локальное состояние только для измененного узла
  allInputStates[nodeId] = value;

  // 2. Формируем полный набор состояний для отправки
  const fullStatesToSend = {};
  for (const [id, val] of Object.entries(allInputStates)) {
    let valToSend;
    if (val) valToSend = 1;
    if (!val) valToSend = 0;
    fullStatesToSend[`in_${id}`] = valToSend;
  }

  // 3. Отправляем ВСЕ состояния
  sendInputStates(fullStatesToSend);
};
