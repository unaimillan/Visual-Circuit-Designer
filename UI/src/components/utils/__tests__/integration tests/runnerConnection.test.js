import { io } from "socket.io-client";

let port = 52525;

describe("Socket.IO integration", () => {
  it("should connect to socket.io server", (done) => {
    const client = io(`http://localhost:${port}`, {
      path: "/socket.io",
      transports: ["websocket"],
    });

    client.on("connect", () => {
      expect(client.connected).toBe(true);
      client.disconnect();
      done();
    });
  });
});
