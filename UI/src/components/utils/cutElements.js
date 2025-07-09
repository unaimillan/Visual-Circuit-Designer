export function cutElements({ getSelectedElements, setClipboard, deleteSelectedElements }) {
  const selected = getSelectedElements();
  if (selected.nodes.length === 0 && selected.edges.length === 0) return;

  setClipboard(selected);
  deleteSelectedElements();

  console.log(
    "Cut:",
    selected.nodes.length,
    "nodes and",
    selected.edges.length,
    "edges",
  );
}