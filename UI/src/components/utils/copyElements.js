export function copyElements({ getSelectedElements, setClipboard }) {
  const selected = getSelectedElements();
  if (selected.nodes.length === 0) return;

  setClipboard(selected);

  console.log(
    "Copied:",
    selected.nodes.length,
    "nodes and",
    selected.edges.length,
    "edges",
  );
}