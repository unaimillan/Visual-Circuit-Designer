import { NODE_SIZES } from "../constants/nodeSizes";

export function calculatePosition(rawPos, type) {
  const nodeSize = NODE_SIZES[type] || NODE_SIZES.default;

  return {
    x: rawPos.x - nodeSize.width / 2,
    y: rawPos.y - nodeSize.height / 2,
  };
}
