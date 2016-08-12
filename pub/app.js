var socket = io();

var bus = new Vue()

var EMPLOYER_DATA = [
    {name: 'Foo Bar', title: 'Web Development', skills: 'JavaScript', exp: 5, ed: 'Bachelors in Computer Science', loc: 'San Franciso', email: 'bob@gmail.com'}
]

var SEEKER_DATA = [
    {company: 'Bar Baz', field: 'Software Developer', skills: 'Python', exp: 2, ed: 'Bachelors in Computer Science', loc: 'Ann Arbor', email: 'saadiq@gmail.com'}
]


Vue.component('employer', {
    template: '#employer',
    data(){
        return{
            company: '',
            title: '',
            skills: '',
            exp: 0,
            edu: '',
            education: [
                'Bachelors in Computer Science',
                'Masters in Computer Science', 
                'PhD in Computer Science', 
                'Other'],
            loc: '',
            email: '',
            submitted: false
        }
    },
    methods: {
        clearData(){
            this.company = ''
            this.title = ''
            this.skills = ''
            this.exp = ''
            this.edu = ''
            this.loc = ''
            this.email = ''
        },
        addEmployerProfile(){
            socket.emit('employer-profile', {
                company: this.company,
                title: this.title,
                skills: this.skills,
                exp: this.exp,
                edu: this.edu,
                loc: this.loc,
                email: this.email
            })
            this.submitted = true
            this.clearData()
        }
    }

})

Vue.component('job-seeker', {
    template: '#job-seeker',
    data(){
        return{
            name: '',
            field: '',
            skills: '',
            exp: 0,
            edu: '',
            education: [
                'Bachelors in Computer Science',
                'Masters in Computer Science', 
                'PhD in Computer Science', 
                'Other'],
            loc: '',
            email: '',
            submitted: false,
        }
    },
    methods: {
        clearData(){
            this.name = ''
            this.field = ''
            this.skills = ''
            this.exp = ''
            this.edu = ''
            this.loc = ''
            this.email = ''
        },
        addSeekerProfile(){
            socket.emit('seeker-profile', {
                name: this.name,
                field: this.field,
                skills: this.skills,
                exp: this.exp,
                edu: this.edu,
                loc: this.loc,
                email: this.email
            })
            this.submitted = true
            this.clearData()

        }
    }
})



Vue.component('main-content', {
    props:['usr', 'u'],
    created(){
        var self = this
        var obj = {}
        socket.on('register', (data)=>{
            self.firstname = data.f
            self.lastname = data.l
            self.username = data.u
            self.password = data.p
            self.email = data.e
            self.sel = data.s
            self.loginDetails.push({
                        f:data.f,
                        l:data.l, 
                        u:data.u, 
                        p:data.p,
                        e:data.e,
                        s:data.s
                    })
            var accountType = this.loginDetails.map((u)=>{return u.s})
            accountType[0]==="Job Seeker" ? self.isJobSeeker = true : self.isEmployer = true
               
            console.log('show user details: ', data.u, data.p)
        })
          socket.emit('find-user', {
                f: this.firstname,
                l: this.lastname,
                u: this.username,
                p: this.password,
                e: this.email,
                s: this.sel,
                log: this.uName
            })
            var self = this
            socket.on('find-user', (data)=>{
                console.log('am i working? ', data.r)
                data.r.map(function(user){
                    self.loginDetails.push({
                        f:user.f,
                        l:user.l, 
                        u:user.u, 
                        p:user.p,
                        e:user.e,
                        s:user.s
                    })
                })
            var accountType = this.loginDetails.map((u)=>{return u.s})
            accountType[0]==="Job Seeker" ? self.isJobSeeker = true : self.isEmployer = true
            })
    },
    data(){
        return{
            employerData: '',
            seekerData: '',
            loginDetails:[],
            firstname: '',
            lastname: '',
            username: '',
            password: '',
            email: '',
            sel: '',
            uName: this.u,
            isJobSeeker: false,
            isEmployer: false,
            visible: true,
        }
    },
    methods: {
        findUser(){
          
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
    mounted(){
        var self = this
        socket.on('seeker-profile', (data)=>{
            var unique = _.uniqBy(data.seek, 'email')
            console.log(unique)
            self.seekerData = unique
            console.log('job seeker\'s field, ', data.field)
        })
         socket.on('employer-profile', (data)=>{
            var unique = _.uniqBy(data.seek, 'email')
            console.log(unique)
            self.employerData = unique
         })
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
        email: '',
        selected: 'Select',
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
            this.email=''
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
                e: this.email,
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


