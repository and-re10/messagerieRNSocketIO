const app = require('express')();
const server = require('http').createServer(app);
const io = require("socket.io")(server)
const formatMessage = require('./src/utils/messages');

const PORT = process.env.PORT || 3020

// // Routes
// const authRouter = require('./routes/auth');
// app.use('/api/auth/', authRouter);

// Socket IO
io.on("connection", socket => {
    console.log("A user Connected :D");
    socket.on('disconnect', () => {
        console.log('A user Disconnected ;)');
    });
    socket.on("chat message", msg => {
        console.log(msg);
        io.emit("chat message", formatMessage(msg.username, msg.text))
        // io.emit("chat message", msg)
    })
});
// const messagesRoute = require("./src/routes/messages");
// server.use('/', messagesRoute)

app.get('/', (req, res) => {
    res.send('hello world')
})

server.listen(PORT, () => console.log("Server running on port: " + PORT))
