import { generateId } from "../../generateId.js";

test("generates id of expected format", () => {
  const id = generateId();
  expect(typeof id).toBe("string");
  expect(id.length).toBe(22);
  expect(/^[A-Za-z0-9]{22}$/.test(id)).toBe(true);
});
