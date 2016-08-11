var express = require("express"),
    app = express(),
    http = require("http"),
    server = http.Server(app),
    socketio = require("socket.io"),
    _ = require("lodash"),
    io = socketio(server);
app.use(express.static("pub"));


var users = []
var seekerProfiles = []
var employerProfiles = []

var login = (name, password)=> {
    var employer = {name: name, password: password}
    employers.push(employer)
}

var findUser=(arr, username1, username2)=>{
    var regUser = arr.filter(function(e) { return e.u == username1}).length > 0
    var logUser = arr.filter(function(e) { return e.u== username2}).length > 0
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

var registerNewUser=(firstname, lastname, username, password, email,selected)=>{
    var newUser = {f: firstname, l: lastname, u: username, p: password, e: email, s: selected}
    users.push(newUser)
    for(p in newUser){
        console.log( newUser[p], users.length)
    }
}

var registerSeekerProfile=(name, field, skills, exp, edu, loc, email)=>{
    var newSeekerProfile = {
        name: name,
        field: field,
        skills: skills,
        exp: exp,
        edu: edu,
        loc: loc,
        email: email,
    }
    seekerProfiles.push(newSeekerProfile)
}

var registerEmployerProfile=(company, title, skills, exp, edu, loc, email)=>{
    var newEmployerProfile = {
        company: company,
        title: title,
        skills: skills,
        exp: exp,
        edu: edu,
        loc: loc,
        email: email,
    }
    employerProfiles.push(newEmployerProfile)
}


io.on('connection', (socket) => {
    console.log('Someone connected to server');
    var profiles = {s: seekerProfiles, e: employerProfiles}
    socket.on('fetch-seeker-data', (data)=>{
        io.emit('fetch-seeker-data', profiles )
    })

     socket.on('fetch-employer-data', (data)=>{
        io.emit('fetch-employer-data', profiles )
    })
    
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
            registerNewUser(data.f, data.l, data.u, data.p, data.e, data.s)
            io.emit('register', data)
        }
        else{
            console.log('User already exists or username already taken')
            io.emit('failure', data)
        }        
    })

    socket.on('find-user', (data)=>{
      
    var result = users.filter(function( obj ) {
        return obj.u == data.u || obj.u == data.log;
    });
    
        if(findUser(users, data.u, data.log)){
            console.log('sending user info to main-content...')
            data.r = result
            io.emit('find-user', data)
        }
    })

    socket.on('seeker-profile', (data)=>{
        registerSeekerProfile(data.name, data.field, data.skills, data.exp, data.edu, data.loc, data.email)
        data.seek = seekerProfiles
        seekerProfiles.map(function(p){
            console.log('# seeker profiles: ', p)
        })
        io.emit('seeker-profile', data)
    
    })

    socket.on('employer-profile', (data)=>{
        console.log('company name: ', data.company)
        registerEmployerProfile(data.company, data.title, data.skills, data.exp, data.edu, data.loc, data.email)
        employerProfiles.map(function(p){
            console.log('# employer profiles: ', p)
        })
        data.emp = employerProfiles
        io.emit('employer-profile', data)
    })



 
    socket.on('disconnect', (socket) => {
       console.log('someone left the server'); 
    });
    
});
server.listen(80, () => {
    console.log('listening on port 80');
});
