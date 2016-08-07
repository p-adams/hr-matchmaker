var express = require("express"),
    app = express(),
    http = require("http"),
    server = http.Server(app),
    socketio = require("socket.io"),
    io = socketio(server);
app.use(express.static("pub"));

var employers = []
var seekers = []

var addEmployer = (name, password)=> {
    var employer = {name: name, password: password}
    employers.push(employer)
}

var registerNewUser=(firstname, lastname, username, password, selected)=>{
    var newUser = {f: firstname, l: lastname, u: username, p: password, s: selected}
    console.log(newUser.f)
}

io.on('connection', (socket) => {
    console.log('Someone connected to server');

    socket.on('login', (login)=>{
        addEmployer(login.usr, login.pass)
        io.emit('login', login)
    })

    socket.on('register', (data)=>{
        registerNewUser(data.f, data.l, data.u, data.p, data.s)
    })

 
    socket.on('disconnect', (socket) => {
       console.log('someone left the server'); 
    });
    
});
server.listen(80, () => {
    console.log('listening on port 80');
});