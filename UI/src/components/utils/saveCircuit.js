export function saveCircuit(nodes, edges) {
  const flowData = {
    nodes,
    edges,
  };

  const dataStr =
    "data:text/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(flowData, null, 2));

  const a = document.createElement("a");
  a.setAttribute("href", dataStr);
  a.setAttribute("download", "circuit.json");
  document.body.appendChild(a);
  a.click();
  a.remove();
}
