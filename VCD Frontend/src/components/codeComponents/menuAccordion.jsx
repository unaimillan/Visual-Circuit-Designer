import * as React from "react";
import { Accordion } from "radix-ui";
import classNames from "classnames";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import "../../CSS/accordion.css";
import AndGate from "../../../assets/circuitsMenu/AND.svg";
import OrGate from "../../../assets/circuitsMenu/OR.svg";
import NotGate from "../../../assets/circuitsMenu/NOT.svg";
import NandGate from "../../../assets/circuitsMenu/NAND.svg";
import NorGate from "../../../assets/circuitsMenu/NOR.svg";
import XorGate from "../../../assets/circuitsMenu/XOR.svg";
import InputGate from "../../../assets/circuitsMenu/input.svg";
import OutputGate from "../../../assets/circuitsMenu/output.svg";

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
      { id: 'inputNode', label: 'input', icon: InputGate },
      { id: 'outputNode', label: 'output', icon: OutputGate },
    ]
  },
  {
    header: "Pins",
    gates: [
      { id: 'inputNode', label: 'input', icon: InputGate },
      { id: 'outputNode', label: 'output', icon: OutputGate },
    ]
  },
  {
    header: "Custom Logic Elements",
    gates: [
      { id: 'notNode', label: 'NOT', icon: NotGate },
    ]
  }
];

const AccordionDemo = () => (
  <Accordion.Root
    className="AccordionRoot"
    type="multiple"
    defaultValue="item-1"
    collapsible
  >
    <Accordion.Item className="AccordionItem" value="item-1">
      <AccordionTrigger>menuItems[0].header</AccordionTrigger>
      <AccordionContent>
        00000
      </AccordionContent>
    </Accordion.Item>

    <Accordion.Item className="AccordionItem" value="item-2">
      <AccordionTrigger>Is it unstyled?</AccordionTrigger>
      <AccordionContent>
        1111
      </AccordionContent>
    </Accordion.Item>

    <Accordion.Item className="AccordionItem" value="item-3">
      <AccordionTrigger>Can it be animated?</AccordionTrigger>
      <Accordion.Content className="AccordionContent">
        <div className="AccordionContentText">
          22222
        </div>
      </Accordion.Content>
    </Accordion.Item>
  </Accordion.Root>
);

const AccordionTrigger = React.forwardRef(
  ({ children, className, ...props }, forwardedRef) => (
    <Accordion.Header className="AccordionHeader">
      <Accordion.Trigger
        className={classNames("AccordionTrigger", className)}
        {...props}
        ref={forwardedRef}
      >
        {children}
        <ChevronDownIcon className="AccordionChevron" aria-hidden />
      </Accordion.Trigger>
    </Accordion.Header>
  ),
);

const AccordionContent = React.forwardRef(
  ({ children, className, ...props }, forwardedRef) => (
    <Accordion.Content
      className={classNames("AccordionContent", className)}
      {...props}
      ref={forwardedRef}
    >
      <div className="AccordionContentText">{children}</div>
    </Accordion.Content>
  ),
);

export default AccordionDemo;
