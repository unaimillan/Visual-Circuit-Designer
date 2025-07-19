/*TODO: Add tests*/
export const generateCustomBlockId = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 10);
  return `custom_${timestamp}_${random}`;
};

export const createCustomBlock = (nodes, edges, blockName) => {
  if (!Array.isArray(nodes)) throw new Error("Invalid nodes: must be an array");
  if (!Array.isArray(edges)) throw new Error("Invalid edges: must be an array");

  const inputs = nodes.filter(node =>
    node.type === "inputNodeSwitch" || node.type === "inputNodeButton"
  ).map(node => ({
    id: node.id,
    name: node.name || `input_${Math.floor(Math.random() * 10000)}`,
  }));

  const outputs = nodes.filter(node =>
    node.type === "outputNodeLed"
  ).map(node => ({
    id: node.id,
    name: node.name || `output_${Math.floor(Math.random() * 10000)}`,
  }));

  return {
    id: generateCustomBlockId(),
    name: blockName,
    inputs,
    outputs,
    originalSchema: { nodes, edges },
  };
};

/**
 * Сохраняет кастомный блок в localStorage
 */
export const saveCustomBlock = (customBlock) => {
  try {
    const savedBlocks = JSON.parse(localStorage.getItem("customBlocks") || "[]");
    localStorage.setItem("customBlocks", JSON.stringify([...savedBlocks, customBlock]));
  } catch (error) {
    console.error("Failed to save custom block:", error);
  }
};

/**
 * Загружает все кастомные блоки из localStorage
 */
export const loadCustomBlocks = () => {
  try {
    return JSON.parse(localStorage.getItem("customBlocks") || "[]");
  } catch (error) {
    console.error("Failed to load custom blocks:", error);
    return [];
  }
};

/**
 * Удаляет кастомный блок по ID
 */
export const deleteCustomBlock = (blockId) => {
  try {
    const savedBlocks = JSON.parse(
      localStorage.getItem("customBlocks") || "[]",
    );
    const updatedBlocks = savedBlocks.filter((block) => block.id !== blockId);
    localStorage.setItem("customBlocks", JSON.stringify(updatedBlocks));
    return true;
  } catch (error) {
    console.error("Failed to delete custom block:", error);
    return false;
  }
};

/**
 * Находит кастомный блок по ID
 */
export const findCustomBlockById = (blockId) => {
  const blocks = loadCustomBlocks();
  return blocks.find((block) => block.id === blockId);
};
