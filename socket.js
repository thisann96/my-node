require("dotenv").config();
const express = require('express')
const app = express();

const http = require('http');
const socketIo = require('socket.io');

const PORT = process.env.PORT || 3010

app.use(express.static('public'));
const server = http.createServer(app);

//initiate to server
const io = socketIo(server);

const users = new Set();

io.on("connection", socket => {
    console.log("A user is connected");

    socket.on("join", userName => {
        users.add(userName);
        socket.userName = userName;

        io.emit('userJoined', userName);

        io.emit("userList", Array.from(users));
    })

    socket.on("chatMessage", message => {
        io.emit("chatMessage", message);
    })

    socket.on("disconnect", () => {
        users.forEach(user => {
            if (user === socket.userName) {
                users.delete(user);

                io.emit("userLeft", user);
            }
        })
    })
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})