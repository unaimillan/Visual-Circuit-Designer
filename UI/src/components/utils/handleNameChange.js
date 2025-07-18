export function handleNameChange(event, editableNode, setNodes, recordHistory) {
  if (!editableNode) return;

  const newName = event.target.value;

  setNodes((prevNodes) =>
    prevNodes.map((node) =>
      node.id === editableNode.id ? { ...node, name: newName } : node
    )
  );

  setTimeout(recordHistory, 0);
}
