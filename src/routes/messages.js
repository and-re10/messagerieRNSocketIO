const Router = require("express")()
const server = require('http').createServer(Router);
const io = require("socket.io")(server)

Router.get('/messages', (req, res) => {
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
})

module.exports = Router;