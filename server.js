var express = require("express"),
    app = express(),
    http = require("http"),
    server = http.Server(app),
    socketio = require("socket.io"),
    io = socketio(server);
app.use(express.static("pub"));

var employers = []
var seekers = []

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
    
    if(newUser.s==="Job Seeker"){
        if(!userExists(seekers, username, password) && !usernameTaken(seekers, username)){
            seekers.push(newUser)
        }else{
            console.log('Already a user or username taken')
        }
    }
    else if(newUser.s==="Employer"){
          if(!userExists(seekers, username, password) && !usernameTaken(seekers, username)){
            seekers.push(newUser)
        }else{
            console.log('Already a user or username taken')
        }
    }
    for(p in newUser){
        console.log(newUser[p], seekers.length, employers.length)
    }
}

io.on('connection', (socket) => {
    console.log('Someone connected to server');

    socket.on('login', (login)=>{
        login(login.usr, login.pass)
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