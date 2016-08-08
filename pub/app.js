var socket = io();


Vue.component('register', {
    props: ['frst', 'lst', 'usr', 'pass', 'slct'],
    template: "#register",
    created(){
        var self = this
        socket.on('failure', (data)=>{
            self.failure = true
            var userDetails = _.mapValues(data , function(d) { return d; });
        })
    },
    data(){
        return{
            users:[],
            firstname: this.frst,
            lastname: this.lst,
            createUsr: this.usr,
            createPass: this.pass,
            selected: this.slct,
            confirmUser: false,
            failure: false,
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
        register(e){
            
            socket.emit('register', {
                f: this.firstname,
                l: this.lastname,
                u: this.createUsr,
                p: this.createPass,
                s: this.selected
            })
            this.clearForm()
            
        },//logUser in order to see if user already has account
        //allows for escape to login menu
        logUser(){
            this.confirmUser = true
        }
    }
})

Vue.component('login', {
    props: ['usr', 'pass'],
    template: '#login',
    created(){
        var self = this
        socket.on('login-failure', (data)=>{
            self.failure = true
        })
    },
    data(){
        return{
            username: this.usr,
            password: this.pass,
            failure: false,
        }
    },
    methods: {
        login(){
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
           if(this.register || this.log) return true
        }
    },
    created(){
        var self = this
        socket.on('register', (data)=>{
            self.username = data.u
            console.log(data.u, data.p)
        })
        socket.on('login-success', (data)=>{
            self.username = data.u
        })
    }
})