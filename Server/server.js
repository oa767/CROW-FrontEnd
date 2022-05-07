const axios = require('axios').default;

const app = require("express")();
const httpServer = require("http").createServer(app);
const {Server} = require("socket.io");

const options = {
		  cors: { origin: '*' },
		  wsEngine: require("eiows").Server
		};
const io = new Server(httpServer, options);

const port = process.env.PORT || 8080;

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
        socket.to(roomCode).emit("new user");
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
	socket.to(roomCode).emit("new user");
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

httpServer.listen(port)
console.log('Listening on port ' + port + '...')

