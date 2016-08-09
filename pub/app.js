var socket = io();

var store = {
    state: {
        registered: false,
        logged: false,
        isUser: false,
       
    }
}

Vue.component('meow',{
    template: '<h3>Meow</h3>'
})
Vue.component('register', {
    props: ['frst', 'lst', 'usr', 'pass', 'slct', 'st'],
    template: "#register",
    created(){
       
        var self = this
        socket.on('failure', (data)=>{
            self.registered = true
            var userDetails = _.mapValues(data , function(d) { return d; });
        })
    },
    data(){
        return{
            users:[],
            firstname: '',
            lastname: '',
            createUsr: '',
            createPass: '',
            selected: 'Select',
            confirmUser: false,
            hide: this.st.state.hideMain,
            registered: this.st.state.registered,
            user: this.st.state.isUser
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
            if(!this.registered){
                this.hideMain = true
            }
            
        },
        logUser(){
            
            this.registered = true
            alert(this.registered)
        }
    }
})

Vue.component('login', {
    props: ['usr', 'pass',  'st'],
    template: '#login',
    created(){
        var self = this
        socket.on('login-failure', (data)=>{
            self.logged = true
        })
        
    },
    data(){
        return{
            username: this.usr,
            password: this.pass,
            logged: this.st.state.logged
        }
    },
    methods: {
        login(){
            if(this.logged){
                console.log(this.logged)
            }
            socket.emit('login', {u: this.username, p: this.password})
            this.username=''
            this.password=''
            console.log(this.logged)
            
        },
    }
})

new Vue({
    el: "#app",
    data: {
        
        username: '',
        password: '',
       
        sharedState: store,
       
           
    },
    methods: {
       
    },
    computed: {
        user(){
            return this.sharedState.state.registered
        }
    },
    created(){
       
        var self = this
        socket.on('register', (data)=>{
            this.sharedState.state.registered = true
            self.username = data.u
            console.log(data.u, data.p)
        })
        socket.on('login-success', (data)=>{
            this.sharedState.state.logged = true
            self.username = data.u
        })
    }
})

/* 
User gets on site, there is a create account form, 
the user can create a new account or login to existing account

*/
