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
    users: [],
  }
};

let userMessages = {
  userId: [],
};

io.on('connection', (socket) => {
  let addedUser = false;
  console.log(`Connected to client: ${socket.id}`);    

  socket.on("check activity", () => {
    if (userMessages[socket.userId]) {
      if (userMessages[socket.userId].length >= 1) {
        const lastMessage = userMessages[socket.userId][userMessages[socket.userId].length - 1];
	const currentTime = new Date();
        if ((currentTime.getHours() * 60 + currentTime.getMinutes()) -
             (lastMessage.getHours() * 60 + lastMessage.getMinutes()) >= 20) {
                console.log(`boot ${socket.username}`);
		socket.emit("inactive");
	        socket.to(socket.roomCode).emit("inactive left", socket.username);
        }
      }
      else {
        const currentTime = new Date();
        if ((currentTime.getHours() * 60 + currentTime.getMinutes()) -
             (socket.joined.getHours() * 60 + socket.joined.getMinutes()) >= 20) {
                console.log(`boot ${socket.username}`);
                socket.emit("inactive");
		socket.to(socket.roomCode).emit("inactive left", socket.username);
        }
      }
    }
  });

  socket.on('send message', async(message, username, roomName, roomCode) => {
    userMessages[socket.userId].push(new Date());
    console.log(`${username} successfuly sent message to ${socket.roomCode}`);
    socket.to(roomCode).emit("receive message", username, message);
  });

  socket.on("joining room", (userId, username, roomCode, roomName) => {
    socket.userId = userId;
    socket.username = username;
    socket.roomCode = roomCode;
    socket.roomName = roomName;
    
    if (!rooms[roomCode]) {
      rooms[roomCode] = {};
      rooms[roomCode].users = [];
    }

    addedUser = true;   
    rooms[roomCode].owner = userId;
    rooms[roomCode].users.push(userId);
    userMessages[userId] = [];
    socket.join(roomCode);
    socket.joined = new Date();

    socket.to(roomCode).emit("new user", username);
  });

  socket.on("remove inactive", () => {
    delete rooms[socket.roomCode].users[socket.userId];
    delete userMessages[socket.userId];
    socket.leave(socket.roomCode);
    socket.disconnect();
  });

  socket.on('disconnect', () => {
    console.log(`Disconnected from Client: ${socket.id}`);
    if (addedUser) {
      delete rooms[socket.roomCode].users[socket.userId];
      delete userMessages[socket.userId];
      socket.to(socket.roomCode).emit('user left', socket.username);
      socket.leave(socket.roomCode);
      socket.disconnect();
    }
  });
});

httpServer.listen(port)
console.log('Listening on port ' + port + '...')

