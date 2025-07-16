import * as React from "react";
import { Select } from "radix-ui";
import { LOG_LEVELS } from "../../codeComponents/logger.jsx";
import classnames from "classnames";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";
import "../../../CSS/select.css";

export const SelectCanvasBG = ({ currentBG, setCurrentBG }) => (
  <Select.Root value={currentBG} onValueChange={setCurrentBG}>
    <Select.Trigger className="SelectTrigger" aria-label="canvas-bg">
      <Select.Value placeholder="Select background" />
      <Select.Icon className="SelectIcon">
        <ChevronDownIcon />
      </Select.Icon>
    </Select.Trigger>
    <Select.Portal>
      <Select.Content className="SelectContent">
        <Select.ScrollUpButton className="SelectScrollButton">
          <ChevronUpIcon />
        </Select.ScrollUpButton>
        <Select.Viewport className="SelectViewport">
          <Select.Group>
            <SelectItem value="dots">Dots</SelectItem>
            <SelectItem value="lines">Lines</SelectItem>
            <SelectItem value="cross">Cross</SelectItem>
          </Select.Group>
        </Select.Viewport>
      </Select.Content>
    </Select.Portal>
  </Select.Root>
);

export const SelectTheme = ({ theme, setTheme }) => (
  <Select.Root value={theme} onValueChange={setTheme}>
    <Select.Trigger className="SelectTrigger" aria-label="Theme">
      <Select.Value placeholder="Select theme" />
      <Select.Icon className="SelectIcon">
        <ChevronDownIcon />
      </Select.Icon>
    </Select.Trigger>
    <Select.Portal>
      <Select.Content className="SelectContent">
        <Select.ScrollUpButton className="SelectScrollButton">
          <ChevronUpIcon />
        </Select.ScrollUpButton>
        <Select.Viewport className="SelectViewport">
          <Select.Group>
            <SelectItem value="light">Light☀️</SelectItem>
            <SelectItem value="dark">Dark🌙</SelectItem>
            <SelectItem value="pick-me">Pick-me!🎀</SelectItem>
            <SelectItem value="tokyo-night">Tokyo Night🌃</SelectItem>
            <SelectItem value="green-nature">Green Nature🍃</SelectItem>
            <SelectItem value="solar-red">Solar Red🔥</SelectItem>
          </Select.Group>
        </Select.Viewport>
      </Select.Content>
    </Select.Portal>
  </Select.Root>
);

export const SelectWireType = ({ wireType, setWireType }) => (
  <Select.Root value={wireType} onValueChange={setWireType}>
    <Select.Trigger className="SelectTriggerWire" aria-label="Wire Type">
      <div className="SelectValueWrapper">
        <Select.Value placeholder="Select type" />
      </div>
      <Select.Icon className="SelectIcon">
        <ChevronDownIcon />
      </Select.Icon>
    </Select.Trigger>
    <Select.Portal>
      <Select.Content className="SelectContent">
        <Select.ScrollUpButton className="SelectScrollButton">
          <ChevronUpIcon />
        </Select.ScrollUpButton>
        <Select.Viewport className="SelectViewport">
          <Select.Group>
            <SelectItem value="default">Bezier</SelectItem>
            <SelectItem value="step">Step</SelectItem>
            <SelectItem value="straight">Straight</SelectItem>
          </Select.Group>
        </Select.Viewport>
      </Select.Content>
    </Select.Portal>
  </Select.Root>
);

const SelectItem = React.forwardRef(
  ({ children, className, ...props }, forwardedRef) => {
    return (
      <Select.Item
        className={classnames("SelectItem", className)}
        {...props}
        ref={forwardedRef}
      >
        <Select.ItemText>{children}</Select.ItemText>
        <Select.ItemIndicator className="SelectItemIndicator">
          <CheckIcon />
        </Select.ItemIndicator>
      </Select.Item>
    );
  },
);

export const SelectLogLevel = ({ currentLogLevel, setCurrentLogLevel }) => (
  <Select.Root value={currentLogLevel} onValueChange={setCurrentLogLevel}>
    <Select.Trigger className="SelectTrigger" aria-label="Notification Level">
      <Select.Value placeholder="!!!!" />
      <Select.Icon className="SelectIcon">
        <ChevronDownIcon />
      </Select.Icon>
    </Select.Trigger>
    <Select.Portal>
      <Select.Content className="SelectContent">
        <Select.ScrollUpButton className="SelectScrollButton">
          <ChevronUpIcon />
        </Select.ScrollUpButton>
        <Select.Viewport className="SelectViewport">
          <Select.Group>
            <SelectItem value={LOG_LEVELS.ERROR}>Critical</SelectItem>
            <SelectItem value={LOG_LEVELS.IMPORTANT}>Info</SelectItem>
            <SelectItem value={LOG_LEVELS.DEBUG}>Debug</SelectItem>
          </Select.Group>
        </Select.Viewport>
      </Select.Content>
    </Select.Portal>
  </Select.Root>
);

export const SelectNotificationsPosition = ({
  toastPosition,
  setToastPosition,
}) => (
  <Select.Root value={toastPosition} onValueChange={setToastPosition}>
    <Select.Trigger
      className="SelectTrigger"
      aria-label="Notification Position"
    >
      <Select.Value placeholder="Select notifications position" />
      <Select.Icon className="SelectIcon">
        <ChevronDownIcon />
      </Select.Icon>
    </Select.Trigger>
    <Select.Portal>
      <Select.Content className="SelectContent">
        <Select.ScrollUpButton className="SelectScrollButton">
          <ChevronUpIcon />
        </Select.ScrollUpButton>
        <Select.Viewport className="SelectViewport">
          <Select.Group>
            <SelectItem value={"top-center"}>Top center</SelectItem>
            <SelectItem value={"bottom-center"}>Bottom center</SelectItem>
          </Select.Group>
        </Select.Viewport>
      </Select.Content>
    </Select.Portal>
  </Select.Root>
);
