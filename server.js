var express = require("express"),
    app = express(),
    http = require("http"),
    server = http.Server(app),
    socketio = require("socket.io"),
    _ = require("lodash"),
    io = socketio(server);
app.use(express.static("pub"));


var users = []

var login = (name, password)=> {
    var employer = {name: name, password: password}
    employers.push(employer)
}


var foo = (arr, user) => {
    arr.filter(function(e) { 
        console.log('foo', e);
        return e.u == username1
        }
        ).length > 0 
}

var findUser=(arr, username1, username2)=>{
    var regUser = arr.filter(function(e) { console.log('meow', e);return e.u == username1}).length > 0
    var logUser = arr.filter(function(e) { console.log('woof', e);return e.u== username2}).length > 0
    return regUser || logUser
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

    

    socket.on('check-user', (data)=>{
         console.log('from check-user', data.u, data.p)
         console.log(userExists(users, data.u, data.p))
       if(!userExists(users, data.u, data.p)&&!usernameTaken(users,data.u)){
            io.emit('check-user', data)
           console.log(users.length)
        }
        
    })


    socket.on('login', (login)=>{
        if(userExists(users, login.u, login.p)){
            io.emit('login-success', login)
            console.log('You are a user')
        }else{
            console.log('You are not a user')
            io.emit('login-failure', login)
        }
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

    socket.on('find-user', (data)=>{
        if(findUser(users, data.u, data.log)){
            console.log('sending user info to main-content...')
            io.emit('find-user', data)
        }
    })

 
    socket.on('disconnect', (socket) => {
       console.log('someone left the server'); 
    });
    
});
server.listen(80, () => {
    console.log('listening on port 80');
});
