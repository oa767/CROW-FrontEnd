const axios = require('axios').default;
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const port = process.env.PORT || 8080;

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*'
  }
});

let rooms = {
  roomCode: {
    owner: '',
    users: {
      username: {
	sockId: '',
        userId: '',
      }
    }
  }
};


io.on('connection', (socket) => {
  let addedUser = false;
  console.log("Connected to client: " + socket.id);  

  socket.on('joinPrivateRoom', async(username, userId, roomCode) => {
    rooms[roomCode] = {};
    rooms[roomCode].owner = socket.id;
    rooms[roomCode].users = {};
    rooms[roomCode].users[username] = {};
    rooms[roomCode].users[username].sockId = socket.id;
    rooms[roomCode].users[username].userId = userId;
    socket.join(roomCode);

    await axios.post(`https://crow249.herokuapp.com/rooms/join/${roomCode}/${username}`)
      .then(() => {
	console.log(`${username} added to ${roomCode}`);
        socket.emit('joinPrivateRoom', "success");
      })
      .catch((error) => {
        console.log(error);
      });

    console.log("Created private room " + roomCode + " owned by " + socket.id);
  });

  socket.on('joinWithCode', async(username, userId, roomCode) => {
    rooms[roomCode].users[username] = {};
    rooms[roomCode].users[username].sockId = socket.id;
    rooms[roomCode].users[username].userId = userId;
    socket.join(roomCode);

    await axios.post(`https://crow249.herokuapp.com/rooms/join/${roomCode}/${username}`)
      .then(() => {
        console.log(`${username} added to ${roomCode}`);
        socket.emit('joinWithCode', "success");
      })
      .catch((error) => {
        console.log(error);
	socket.emit('joinWithCode', "This roomcode is invalid.");
      });

    console.log("User " + socket.id + "  has joined private room " + roomCode);
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from Client...');
    if (addedUser) {
      --numUsers;

      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});

io.listen(port)
console.log('Listening on port ' + port + '...')

