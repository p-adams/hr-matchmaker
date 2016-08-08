var socket = io();

var store = {
    state: {
        registered: false,
        logged: false
    }
}
Vue.component('register', {
    props: ['frst', 'lst', 'usr', 'pass', 'slct', 'f', 'st'],
    template: "#register",
    created(){
        //console.log(this.registered.state.registered)
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
            failure: this.f,
            registered: this.st
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
            if(this.failure){
            this.registered.state.registered = true
            }
           
            
        },
        logUser(){
            this.confirmUser = true
        }
    }
})

Vue.component('login', {
    props: ['usr', 'pass', 'f', 'st'],
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
            failure: this.f,
            logged: this.st,
            confirmUser: false
        }
    },
    methods: {
        login(){
            socket.emit('login', {u: this.username, p: this.password})
            this.username=''
            this.password=''
            if(this.failure){
                this.logged.state.logged = true
            }
        },
        logUser(){
            this.confirmUser = true
        }
    }
})

new Vue({
    el: "#app",
    data: {
        sharedState: store,
        firstname: '',
        lastname: '',
        createUsr: '',
        createPass: '',
        selected: 'Select',
        username: '',
        password: '',
        log: false,
        register: false,
        role: '',
        failure: '',
        
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
        },
        showReg(){ 
            if(this.register && !this.sharedState.state.registered){
                return true
            }     
        },
        showLog(){
            if(this.log && !this.sharedState.state.logged)return true
        },
        main(){
            if(this.hide && !this.showReg && !this.showLog)return true
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

