var socket = io();

var store = {
    state: {
        username: ''
    }
}

Vue.component('meow',{
    template: '<h3>Meow</h3>'
})
Vue.component('register', {
    props: ['usr'],
    template: "#register",
    created(){
                
    },
    data(){
        return{
            firstname: '',
            lastname: '',
            createUsr: '',
            createPass: '',
            selected: 'Select',
            registrationFailure: false,
            create: true,
            reg: false,
            user: false,
            username: this.usr
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
            alert(this.username)

            var usr = {u: this.createUsr, p: this.createPass}
           
            socket.emit('check-user', usr )
            socket.on('check-user', (user)=>{
               this.registrationFailure = false
               this.create = false
               this.reg = true
               console.log("Not user: ", user.u, user.p)
           })
            socket.emit('register', {
                f: this.firstname,
                l: this.lastname,
                u: this.createUsr,
                p: this.createPass,
                s: this.selected
            })
            socket.on('failure', ()=>{
                this.registrationFailure = true
                console.log('user exists')
            })  
            this.clearForm()
            
            
        },
        logUser(){
            this.user = true
            this.create = false
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
            log: false,
            
        }
    },
    methods: {
        login(){
            this.log = true
            
            socket.emit('login', {u: this.username, p: this.password})
            this.username=''
            this.password=''
            console.log(this.logged)
            
        },
    }
})

Vue.component('main-content', {
    props:['usr'],
    created(){
        console.log(this.usr)
    
    },
    template: `<p>Hello{{usr}}</p>`
})

new Vue({
    el: "#app",
    data: {
        
        username: '',
        password: ''
        //sharedState: store,      
    },
    created(){
        var self = this
        socket.on('register', (data)=>{
            self.username = data.u
            console.log('registered: ', data.u, data.p)
        })
       
        /*var self = this
        socket.on('register', (data)=>{
            //this.sharedState.state.registered = true
            self.username = data.u
            console.log(data.u, data.p)
        })
        socket.on('login-success', (data)=>{
            //this.sharedState.state.logged = true
            self.username = data.u
        })*/
    }
})

/* 
User gets on site, there is a create account form, 
the user can create a new account or login to existing account

*/
