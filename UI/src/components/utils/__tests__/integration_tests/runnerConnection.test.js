import { io } from "socket.io-client";

let port = 52525;

describe("Socket.IO integration", () => {
  it("should connect to RunnerNode", (done) => {
    const client = io(`http://localhost:${port}`, {
      path: "/socket.io",
      transports: ["polling", "websocket"],
    });

    client.on("connect", () => {
      expect(client.connected).toBe(true);
      client.disconnect();
      done();
    });
  }, 15000);
});
