import {
  generateCustomBlockId,
  createCustomBlock,
  saveCustomBlock,
  loadCustomBlocks,
  deleteCustomBlock,
  findCustomBlockById,
} from "../../customBlockUtils.js";

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

describe("generateCustomBlockId", () => {
  it("should generate a unique id with correct format", () => {
    const id = generateCustomBlockId();
    expect(id).toMatch(/^custom_[a-z0-9]+_[a-z0-9]{8}$/);
  });

  it("should generate different IDs on consecutive calls", () => {
    const id1 = generateCustomBlockId();
    const id2 = generateCustomBlockId();
    expect(id1).not.toEqual(id2);
  });
});

describe("createCustomBlock", () => {
  const nodes = [
    { id: "1", type: "inputNodeSwitch", name: "Switch A" },
    { id: "2", type: "inputNodeButton" },
    { id: "3", type: "outputNodeLed", name: "LED" },
    { id: "4", type: "logicNode" },
  ];
  const edges = [{ id: "e1", source: "1", target: "3" }];

  it("should create a custom block with inputs and outputs", () => {
    const block = createCustomBlock(nodes, edges, "My Block");

    expect(block).toHaveProperty("id");
    expect(block).toHaveProperty("name", "My Block");
    expect(block.inputs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "1", name: "Switch A" }),
        expect.objectContaining({ id: "2" }),
      ]),
    );
    expect(block.outputs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "3", name: "LED" }),
      ]),
    );
    expect(block.originalSchema.nodes).toBe(nodes);
    expect(block.originalSchema.edges).toBe(edges);
  });

  it("should throw error if nodes or edges are not arrays", () => {
    expect(() => createCustomBlock(null, [], "Block")).toThrow();
    expect(() => createCustomBlock([], null, "Block")).toThrow();
  });
});

describe("saveCustomBlock & loadCustomBlocks", () => {
  it("should save and load a block correctly", () => {
    const block = {
      id: "test-id",
      name: "Test",
      inputs: [],
      outputs: [],
      originalSchema: {},
    };
    saveCustomBlock(block);

    const loaded = loadCustomBlocks();
    expect(loaded).toHaveLength(1);
    expect(loaded[0]).toEqual(block);
  });

  it("should handle malformed JSON gracefully", () => {
    localStorage.setItem("customBlocks", "invalid_json");
    const loaded = loadCustomBlocks();
    expect(loaded).toEqual([]);
  });
});

describe("deleteCustomBlock", () => {
  it("should delete the specified block", () => {
    const block = {
      id: "to-delete",
      name: "To Delete",
      inputs: [],
      outputs: [],
      originalSchema: {},
    };
    saveCustomBlock(block);
    expect(loadCustomBlocks()).toHaveLength(1);

    const result = deleteCustomBlock("to-delete");
    expect(result).toBe(true);
    expect(loadCustomBlocks()).toHaveLength(0);
  });

  it("should return false if deletion fails", () => {
    localStorage.setItem("customBlocks", "bad_json");
    const result = deleteCustomBlock("any-id");
    expect(result).toBe(false);
  });
});

describe("findCustomBlockById", () => {
  it("should return the correct block by ID", () => {
    const block = {
      id: "block123",
      name: "FindMe",
      inputs: [],
      outputs: [],
      originalSchema: {},
    };
    saveCustomBlock(block);

    const found = findCustomBlockById("block123");
    expect(found).toEqual(block);
  });

  it("should return undefined for nonexistent ID", () => {
    const found = findCustomBlockById("missing");
    expect(found).toBeUndefined();
  });
});
