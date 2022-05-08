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

let messages = {
  roomCode: {}
}

let userMessages = {
  username: {}
}

io.on('connection', (socket) => {
  console.log("Connected to client: " + socket.id);  

  socket.on("send message", async(message, username, roomName, roomCode) => {
    await axios.get(`https://crow249.herokuapp.com/users/list/${roomName}`)
      .then((response) => {
	if (response.data) {
          for (var i = 0; i < response.data.length; ++i) {
            if (response.data[i].user_name == username) {
	      console.log(`${username} successfuly sent message to ${socket.roomCode}`);
	      messages[roomCode] = {Time: new Date(), User: username, Message: message};
	      userMessages[username] = {Time: newDate(), Message: message};
	      socket.to(roomCode).emit("receive message", username, message);
	    }
          }
        }
        else {
	  socket.emit("send message", "failed");
        }
      })
     .catch(error => {
	console.log(error);
	socket.emit("send message", "failed");
     })
  });

  socket.on('joinPrivateRoom', async(username, userId, roomCode) => {
    rooms[roomCode] = {};
    rooms[roomCode].owner = userId;
    rooms[roomCode].users = {};
    rooms[roomCode].users[username] = {};
    rooms[roomCode].users[username].sockId = socket.id;
    rooms[roomCode].users[username].userId = userId;
    socket.join(roomCode);

    socket.username = username;
    socket.userId = userId;
    socket.roomCode = roomCode;

    await axios.post(`https://crow249.herokuapp.com/rooms/join/${roomCode}/${username}`)
      .then(() => {
	console.log(`${username} added to ${roomCode}`);
        socket.emit('joinPrivateRoom', "success");
        socket.to(roomCode).emit("new user", "username");
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

    socket.username = username;
    socket.userId = userId;
    socket.roomCode = roomCode;

    await axios.post(`https://crow249.herokuapp.com/rooms/join/${roomCode}/${username}`)
      .then(() => {
        console.log(`${username} added to ${roomCode}`);
        socket.emit('joinWithCode', "success");
	socket.to(roomCode).emit("new user");
      })
      .catch((error) => {
        console.log(error);
	socket.emit('joinWithCode', "invalid");
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

