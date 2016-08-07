var express = require("express"),
    app = express(),
    http = require("http"),
    server = http.Server(app),
    socketio = require("socket.io"),
    io = socketio(server);
app.use(express.static("pub"));

var employers = []

var addEmployer = (name, password)=> {
    var employer = {name: name, password: password}
    employers.push(employer)
    console.log(employers.length)
}

io.on('connection', (socket) => {
    console.log('Someone connected to server');

    socket.on('login', (login)=>{
        addEmployer(login.usr, login.pass)
        socket.emit('login', login)
    })
 
    socket.on('disconnect', (socket) => {
       console.log('someone left the server'); 
    });
    
});
server.listen(80, () => {
    console.log('listening on port 80');
});