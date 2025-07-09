export function loadCircuit(event, setNodes, setEdges) {
  const fileReader = new FileReader();
  fileReader.readAsText(event.target.files[0]);
  fileReader.onload = (e) => {
    const circuitData = JSON.parse(e.target.result);
    setNodes([]);
    setEdges([]);
    setTimeout(() => {
      setNodes(circuitData.nodes || []);
      setEdges(circuitData.edges || []);
    }, 100);
  };
}