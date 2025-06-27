import toast from "react-hot-toast";

export const LOG_LEVELS = {
  ERROR: 0,
  IMPORTANT: 1,
  DEBUG: 2,
};

// Уровень логирования по умолчанию
let currentLogLevel = LOG_LEVELS.DEBUG;

export const setLogLevel = (level) => {
  currentLogLevel = level;
};

export const logMessage = (msg, level = LOG_LEVELS.IMPORTANT) => {
  if (level <= currentLogLevel) {
    const levelLabel = Object.keys(LOG_LEVELS).find((k) => LOG_LEVELS[k] === level);
    console.log(`[${levelLabel}]:`, msg);
  }
};

export const showToast = (msg, icon = "ℹ️", level = LOG_LEVELS.IMPORTANT) => {
  if (level <= currentLogLevel) {
    toast(msg, { icon });
  }
};

export const showToastError = (msg, id = null) => {
  toast.error((t) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
        width: "100%",
        maxWidth: "400px",
      }}
    >
      <div style={{ flex: 1, wordBreak: "break-word" }}>{msg}</div>
      <button
        onClick={() => toast.dismiss(id || t.id)}
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "4px",
          fontSize: "20px",
          flexShrink: 0,
        }}
      >
        ✖️
      </button>
    </div>
  ));
};
