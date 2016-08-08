var express = require("express"),
    app = express(),
    http = require("http"),
    server = http.Server(app),
    socketio = require("socket.io"),
    io = socketio(server);
app.use(express.static("pub"));


var users = []

var login = (name, password)=> {
    var employer = {name: name, password: password}
    employers.push(employer)
}

var findUser=(user, username, password)=>{
    return user.u === username && user.p === password
}

var usernameTaken=(arr, username)=>{
     return arr.filter(function(e) { return e.u == username}).length > 0
}

var userExists=(arr, username, password)=>{
    var isUser = arr.filter(function(e) { return e.u == username}).length > 0
    var isPass = arr.filter(function(e) { return e.p == password}).length > 0
    return isUser&&isPass   
}

var registerNewUser= (firstname, lastname, username, password, selected)=>{
    var newUser = {f: firstname, l: lastname, u: username, p: password, s: selected}
    users.push(newUser)
    for(p in newUser){
        console.log( newUser[p], users.length)
    }
}

io.on('connection', (socket) => {
    console.log('Someone connected to server');

    socket.on('login', (login)=>{
        if(userExists(users, login.u, login.p)){
            io.emit('login-success', login)
            console.log('You are a user')
        }else{
            console.log('You are not a user')
            io.emit('login-failure', login)
        }
        io.emit('login', login)
    })

    socket.on('register', (data)=>{
        if(!userExists(users, data.u, data.p)&&!usernameTaken(users,data.u)){
            registerNewUser(data.f, data.l, data.u, data.p, data.s)
            io.emit('register', data)
        }
        else{
            console.log('User already exists or username already taken')
            io.emit('failure', data)
        }        
    })

 
    socket.on('disconnect', (socket) => {
       console.log('someone left the server'); 
    });
    
});
server.listen(80, () => {
    console.log('listening on port 80');
});