const app              = require('./app');
const PORT             = process.env.PORT || 8000
const connectDatabase  = require('./config/database');

const socketMiddleware = require('./middlewares/socketMiddleware');

let websocketUsers = require('./utils/socketUsers');

connectDatabase();

const server = app.listen(PORT, () => {
    console.log(`[server] running at http://localhost:${PORT} 🚀`);
})


// ============= socket.io =============


const io = require('socket.io')(server, {
    cors: {
        origin: ['http://localhost:8000', 'http://localhost:3000']
    }
});

app.set('socketio', io);

const addUser = (userId, socketId) => {
    !websocketUsers.some((user) => user.userId === userId) &&
        websocketUsers.push({ userId, socketId });
}

const removeUser = (socketId) => {
    websocketUsers = websocketUsers.filter((user) => user.socketId !== socketId)
}

// socket auth middleware
io.use((socket, next) => {
    socketMiddleware(socket, next);
});


// socket connection
io.on('connection', (socket) => {    
    // connect
    console.log(`[socket] user connected`);

    // add user to websocketUsers array
    addUser(socket.user_id, socket.id)

    io.to(socket.id).emit('connectStatus', 'Hola amigos');

    // disconnect
    socket.on('disconnect', () => {
        console.log(`[socket] user disconnected`);
        removeUser(socket.id);
    });
})
