var socket = io();


Vue.component('register', {
    props: ['frst', 'lst', 'usr', 'pass', 'slct', 'user'],
    template: "#register",
    created(){
        console.log(this.user)
    },
    data(){
        return{
            firstname: this.frst,
            lastname: this.lst,
            createUsr: this.usr,
            createPass: this.pass,
            selected: this.slct,
            confirmUser: this.user
        }
    },
    methods: {
        register(){
            socket.emit('register', {
                f: this.firstname,
                l: this.lastname,
                u: this.createUsr,
                p: this.createPass,
                s: this.selected
            })
        },
        logUser(){
            this.confirmUser = true
        }
    }   
})

new Vue({
    el: "#app",
    data: {
        msg: 'Meow',
        firstname: '',
        lastname: '',
        createUsr: '',
        createPass: '',
        selected: 'Select',
        username: '',
        password: '',
        logged: false,
        user: false,
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