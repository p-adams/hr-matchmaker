var socket = io();

Vue.component('main-content', {
    props:['usr', 'u', 'd'],
    created(){
        var self = this
        console.log(this.u)
        socket.on('register', (data)=>{
            self.firstname = data.f
            self.lastname = data.l
            self.username = data.u
            self.password = data.p
            self.sel = data.s
            console.log('show user details: ', data.u, data.p)
        })
        socket.on('login-success', (data)=>{
            self.username = data.u
            self.password = data.p
            console.log('login', data.u)
        })
    },
    data(){
        return{
            firstname: '',
            lastname: '',
            username: '',
            password: '',
            sel: '',
            uName: this.u
        }
    },
    computed:{
        showUsername(){
                
                if(this.uName==this.uName&&this.uName!=''){        
                    return this.uName
                }else{
                    return this.username
                }
            }
        },
    template: "#main-content"
})

new Vue({
    el: "#app",
    data: {
        firstname: '',
        lastname: '',
        createUsr: '',
        createPass: '',
        selected: '',
        registrationFailure: false,
        create: true,
        mainContentVisible: false,
        username: '',
        password: '',
        loginFailure: false,
        log: false
       
       
    },
    methods: {
        clearForm(){
            this.firstname = ''
            this.lastname = ''
            this.createUsr = ''
            this.createPass = ''
            this.selected = ''
            this.username=''
            this.password=''
        },
        register(){
            var usr = {u: this.createUsr, p: this.createPass}
            socket.emit('check-user', usr )
            socket.on('check-user', (user)=>{
               this.registrationFailure = false
               this.mainContentVisible=true
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
        login(){
            this.mainContentVisible = true
           
            socket.emit('login', {u: this.username, p: this.password})
           
            var self = this
            socket.on('login-failure', (data)=>{
                this.loginFailure = true
                console.log("account doesnt exist")
            })
            this.clearForm()
            
        },
        logUser(){
            this.log = true
            this.mainContentVisible = true
        }
    },
    computed: {
        hideMain(){
            return this.mainContentVisible && !this.loginFailure && ! this.log
        },
        hideLogin(){
            return !this.log
        }
    },
    created(){
        var self = this
        socket.on('register', (data)=>{
            self.createUsr = data.u
            console.log('registered: ', data.s, data.p)
        })
       
        var self = this
        socket.on('login-success', (data)=>{
            this.log = false
            self.username = data.u
            console.log('login sucess')
        })
    }
})

/* 

click on login => hide login div and show main content 

*/
