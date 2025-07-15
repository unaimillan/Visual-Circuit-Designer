export const initializeTabHistory = (tab) => ({
  ...tab,
  history: [
    {
      nodes: tab.nodes || [],
      edges: tab.edges || [],
    },
  ],
  index: 0,
});
