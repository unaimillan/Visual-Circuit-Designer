module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
  moduleFileExtensions: ["js", "jsx", "json", "node"],
  transformIgnorePatterns: ["/node_modules/(?!@xyflow/react)/"],
};
