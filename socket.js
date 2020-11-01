/* eslint-disable no-param-reassign */
let io;

module.exports = {
  init: (server) => {
    io = require("socket.io")(server);

    // const users = {};
    let rooms = {
      "room-1": {
        xPlayer: "",
        oPlayer: "",
        xIsNext: true,
        score: { x: 0, o: 0, d: 0 },
      },
    };

    io.on("connection", (socket) => {
      console.log("io.sockets.adapter.rooms", io.sockets.adapter.rooms);
      // Join the game
      socket.on("joinGame", (user) => {
        const room = io.sockets.adapter.rooms["room-1"];
        if (!room) {
          socket.join("room-1");
          rooms["room-1"] = { ...rooms["room-1"], xPlayer: user };
        } else if (room.length === 1) {
          // room-1 for nowd
          socket.join("room-1");
          rooms["room-1"] = { ...rooms["room-1"], oPlayer: user };
          // notfiy users rooms
          io.in("room-1").emit("gameStarted", rooms["room-1"]);
        } else {
          socket.emit("err", { message: "Sorry, The room is full!" });
        }
      });

      // start game
      socket.on("changeTurn", (data) => {
        rooms["room-1"] = { ...rooms["room-1"], xIsNext: data.xIsNext };
        socket.broadcast
          .to("room-1")
          .emit("changedTurn", { index: data.index, xIsNext: data.xIsNext });
      });

      socket.on("rematch", () => {
        socket.broadcast.to("room-1").emit("rematchRequest");
      });

      socket.on("rematchOn", () => {
        io.in("room-1").emit("rematchAccepted");
      });

      socket.on("playerLeft", () => {
        socket.leave("room-1");
      });

      socket.on("logout", () => {
        socket.leave("room-1");
      });
    });
    return io;
  },
  getSocket: () => {
    if (!io) {
      throw new Error("Socket.io was not initialized!");
    }
    return io;
  },
};
