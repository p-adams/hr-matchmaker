var socket = io();

var store = {
    state: {
        clicked: true,
        show: false
    }
}
/*
Vue.component('register', {
    props: ['st'],
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
            //reg: false,
            user: false,
            clicked: this.st
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
           
            this.clicked = false
             alert(this.clicked)
            var usr = {u: this.createUsr, p: this.createPass}
           
            socket.emit('check-user', usr )
            socket.on('check-user', (user)=>{
               this.registrationFailure = false
               this.clicked = false
               //this.reg = true
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
})*/

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
    template: `<p>Hello {{usr}}</p>`
})

new Vue({
    el: "#app",
    data: {
        firstname: '',
        lastname: '',
        createUsr: '',
        createPass: '',
        selected: 'Select',
        registrationFailure: false,
        create: true,
        mainContentVisible: false,
        user: false,
        clicked: false
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
            var usr = {u: this.createUsr, p: this.createPass}
            socket.emit('check-user', usr )
            socket.on('check-user', (user)=>{
               this.registrationFailure = false
               this.clicked = false
               this.mainContentVisible=true
               //this.reg = true
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
                this.clicked = false;
                console.log('user exists')
            })  
            this.clearForm()    
        },
        logUser(){
            this.user = true
            this.clicked = true
            this.mainContentVisible = true
        }
    },
    computed: {
        hideMain(){
            return this.mainContentVisible===true&&this.user===false
        }
    },
    created(){
        var self = this
        socket.on('register', (data)=>{
            self.createUsr = data.u
            console.log('registered: ', data.u, data.p)
        })
       
        /*var self = this
        socket.on('login-success', (data)=>{
            //this.sharedState.state.logged = true
            self.username = data.u
        })*/
    }
})

/* 

Main content is hidden by default, if user registers new user,
registration form is hidden and main content is shown.

*/
