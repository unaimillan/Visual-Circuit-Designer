import * as React from "react";
import { Select } from "radix-ui";
import classnames from "classnames";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";
import "../../CSS/select.css";

const SelectDemo = ({currentBG, setCurrentBG}) => (
  <Select.Root value={currentBG} onValueChange={setCurrentBG}>
    <Select.Trigger className="SelectTrigger" aria-label="Food">
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

export default SelectDemo;
