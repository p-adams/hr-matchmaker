var socket = io();


Vue.component('register', {
    props: ['frst', 'lst', 'usr', 'pass', 'slct'],
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
            confirmUser: false
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

Vue.component('login', {
    template: '#login'
})

new Vue({
    el: "#app",
    data: {
        firstname: '',
        lastname: '',
        createUsr: '',
        createPass: '',
        selected: 'Select',
        username: '',
        password: '',
        log: false,
        register: false,
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
        },
        select(e){
            var val = e.currentTarget.value
            if(val === "login"){
                this.log=true        
            }
            else if(val === 'create'){
                this.register=true
            }
        }
    },
    computed: {
        hide(){
           if(this.register||this.log)return true
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