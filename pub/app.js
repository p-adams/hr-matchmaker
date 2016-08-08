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
        clearForm(){
            this.firstname = ''
            this.lastname = ''
            this.createUsr = ''
            this.createPass = ''
            this.selected = ''
        },
        register(){
            socket.emit('register', {
                f: this.firstname,
                l: this.lastname,
                u: this.createUsr,
                p: this.createPass,
                s: this.selected
            })
            this.clearForm()
        },
        logUser(){
            this.confirmUser = true
        }
    }   
})

Vue.component('login', {
    props: ['usr', 'pass'],
    template: '#login',
    data(){
        return{
            username: this.usr,
            password: this.pass
        }
    },
    methods: {
        login(){
            //this.logged = true
            socket.emit('login', {u: this.username, p: this.password})
            this.username=''
            this.password=''
        },
    }
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
           if( this.register || this.log) return true
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