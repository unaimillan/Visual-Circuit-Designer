import ioClient from "socket.io-client";

let port = 8000;

describe("Socket.IO integration", () => {
  it("should connect to socket.io server", (done) => {
    const client = ioClient(`http://0.0.0.0:${port}`, {
      path: "/socket.io",
      transports: ["websocket"],
    });

    client.on("ready", () => {
      expect(client.connected).toBe(true);
      client.disconnect();
      done();
    });
  });
});
