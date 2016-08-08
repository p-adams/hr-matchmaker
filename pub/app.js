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
            console.log('h',this.failure)
            if(this.failure){
            this.registered.state.registered = true
            
            }
            
        },//logUser in order to see if user already has account
        //allows for escape to login menu
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
            logged: this.st
        }
    },
    methods: {
        login(){
            socket.emit('login', {u: this.username, p: this.password})
            this.username=''
            this.password=''
            this.logged.state.logged = true
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
        sharedState: store,
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
            if(this.register && !this.sharedState.state.registered)return true  
        },
        showLog(){
            if(this.log && !this.sharedState.state.logged)return true
        },
        main(){
            if(!this.showReg)return true
        }
    },
    created(){
        console.log(this.sharedState.state.registered)
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

/*show registration form:

    if register radio button is clicked or if registration button is not clicked

*/
