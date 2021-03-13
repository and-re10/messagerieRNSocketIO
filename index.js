const app = require('express')();
const server = require('http').createServer(app);
const io = require("socket.io")(server)
const PORT = process.env.PORT || 3020



io.on("connection", socket => {
    console.log("A user Connected :D");
    socket.on('disconnect', () => {
        console.log('A user Disconnected ;)');
    });
    socket.on("chat message", msg => {
        console.log(msg);
        io.emit("chat message", msg)
    })
});

server.listen(PORT, () => console.log("Server running on port: " + PORT))
