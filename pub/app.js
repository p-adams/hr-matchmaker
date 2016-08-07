var socket = io();
new Vue({
    el: "#app",
    data: {
        msg: 'Meow',
        username: '',
        password: '',
        logged: false,
        user: '',
        role: ''
    },
    methods: {
        login(){
            var username = this.username
            var password = this.password
            this.logged = true
            socket.emit('login', {usr: username, pass: password})
            username=''
            password=''
        }
    },
    created(){
        var self = this
        socket.on('login', (login)=>{
            self.user = login.usr
            console.log(login.usr, login.pass)
        })
    }
})