import { loadLocalStorage } from "../../loadLocalStorage";

describe("loadLocalStorage", () => {
  const KEY = "userSettings";
  let setters;

  beforeEach(() => {
    localStorage.clear();
    setters = {
      setCurrentBG: jest.fn(),
      setShowMinimap: jest.fn(),
      setTheme: jest.fn(),
      setActiveAction: jest.fn(),
      setActiveWire: jest.fn(),
      setOpenSettings: jest.fn(),
      setCircuitsMenuState: jest.fn(),
      setLogLevel: jest.fn(),
      setToastPosition: jest.fn(),
    };
  });

  it("does nothing if no saved settings", () => {
    loadLocalStorage(setters);
    Object.values(setters).forEach((fn) => {
      expect(fn).not.toHaveBeenCalled();
    });
  });

  it("applies all fields when present", () => {
    const data = {
      currentBG: "cross",
      showMinimap: false,
      theme: "dark",
      activeAction: "hand",
      activeWire: "straight",
      openSettings: true,
      circuitsMenuState: false,
      logLevel: "INFO",
      toastPosition: "bottom-right",
    };
    localStorage.setItem(KEY, JSON.stringify(data));

    loadLocalStorage(setters);

    expect(setters.setCurrentBG).toHaveBeenCalledWith("cross");
    expect(setters.setShowMinimap).toHaveBeenCalledWith(false);
    expect(setters.setTheme).toHaveBeenCalledWith("dark");
    expect(setters.setActiveAction).toHaveBeenCalledWith("hand");
    expect(setters.setActiveWire).toHaveBeenCalledWith("straight");
    expect(setters.setOpenSettings).toHaveBeenCalledWith(true);
    expect(setters.setCircuitsMenuState).toHaveBeenCalledWith(false);
    expect(setters.setLogLevel).toHaveBeenCalledWith("INFO");
    expect(setters.setToastPosition).toHaveBeenCalledWith("bottom-right");
  });

  it("ignores invalid JSON", () => {
    localStorage.setItem(KEY, "{ not valid json");
    loadLocalStorage(setters);
    Object.values(setters).forEach((fn) => {
      expect(fn).not.toHaveBeenCalled();
    });
  });

  it("skips undefined fields", () => {
    const data = { currentBG: "dots", theme: "light" };
    localStorage.setItem(KEY, JSON.stringify(data));
    loadLocalStorage(setters);

    expect(setters.setCurrentBG).toHaveBeenCalledWith("dots");
    expect(setters.setTheme).toHaveBeenCalledWith("light");

    [
      "setShowMinimap",
      "setActiveAction",
      "setActiveWire",
      "setOpenSettings",
      "setCircuitsMenuState",
      "setLogLevel",
      "setToastPosition",
    ].forEach((key) => {
      expect(setters[key]).not.toHaveBeenCalled();
    });
  });
});
