import {Link} from "react-router-dom";
import UserIcon from "../../../../assets/userIcon.png";

import {MinimapSwitch} from "./switch.jsx";
import {SelectCanvasBG, SelectLogLevel, SelectTheme} from "./select.jsx";
import {getCurrentLogLevel, setCurrentLogLevel} from "../../codeComponents/logger.jsx";
import React, {useState} from "react";
import {IconCloseCross, IconTabPalette, IconTabPerson, IconTabBell} from "../../../../assets/ui-icons.jsx";

export function Settings({
                           openSettings,
                           showMinimap,
                           setShowMinimap,
                           currentBG,
                           setCurrentBG,
                           theme,
                           setTheme,
                           closeSettings
                         }) {
  const [currentTab, setCurrentTab] = useState(0);


  return (
    <div className={`settingsMenu ${openSettings ? "showed" : ""}`}>
      <div className="tabs-menu">

        <div className={"upper-div"}>
          <button onClick={closeSettings}>
            <IconCloseCross SVGClassName={"close-setting-cross"}/>
          </button>
        </div>

        <button
          className={`settings-tab s-tab0 ${currentTab === 0 ? "active" : ""}`}
          onClick={() => setCurrentTab(0)}
        >
          <IconTabPerson SVGClassName={"settings-tab-icon"}/>
          <p>Account</p>
        </button>

        <button
          className={`settings-tab s-tab1 ${currentTab === 1 ? "active" : ""}`}
          onClick={() => setCurrentTab(1)}
        >
          <IconTabBell SVGClassName={"settings-tab-icon"}/>
          <p>Notifications</p>
        </button>

        <button
          className={`settings-tab s-tab2 ${currentTab === 2 ? "active" : ""}`}
          onClick={() => setCurrentTab(2)}
        >
          <IconTabPalette SVGClassName={"settings-tab-icon"}/>
          <p>Appearance</p>
        </button>
      </div>

      <div className="tab-content">
        <div className={"tab-content-upper"}>
          {currentTab === 0 && "Account"}
          {currentTab === 1 && "Notifications"}
          {currentTab === 2 && "Appearance"}
        </div>
        <TabContent
          currentTab={currentTab}
          showMinimap={showMinimap}
          setShowMinimap={setShowMinimap}
          currentBG={currentBG}
          setCurrentBG={setCurrentBG}
          theme={theme}
          setTheme={setTheme}
        />
      </div>
    </div>
  );
}



function TabContent({
                   currentTab,
                   showMinimap,
                   setShowMinimap,
                   currentBG,
                   setCurrentBG,
                   theme,
                   setTheme
                 }) {

  if (currentTab === 0) {
    return (
      <Link
        to="/profile"
        className="openProfileButton"
        style={{textDecoration: "none"}}
      >
        <img className="settingUserIcon" src={UserIcon} alt="User"/>
        <span className="settingUserName">UserName</span>
      </Link>
    );
  }

  if (currentTab === 1) {
    return (
      <div className="settingBlock">
        <p>Log verbosity</p>
        <SelectLogLevel
          currentLogLevel={getCurrentLogLevel()}
          setCurrentLogLevel={setCurrentLogLevel}
          className="selectTheme"
        />
      </div>
    );
  }

  if (currentTab === 2) {
    return (
      <div>
        <div className="settingBlock">
          <p>Show mini-map</p>
          <MinimapSwitch
            className="minimapSwitch"
            minimapState={showMinimap}
            minimapToggle={setShowMinimap}
          />
        </div>

        <div className="settingBlock">
          <p>Canvas background</p>
          <SelectCanvasBG
            currentBG={currentBG}
            setCurrentBG={setCurrentBG}
            className="selectBG"
          />
        </div>

        <div className="settingBlock">
          <p>Theme</p>
          <SelectTheme
            theme={theme}
            setTheme={setTheme}
            className="selectTheme"
          />
        </div>
      </div>
    );
  }

  return null;
}
