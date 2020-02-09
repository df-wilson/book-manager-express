const login_form = {
    template: `

   <div class="container">
      <div class="row justify-content-center">
         <div class="col-10 col-sm-9 col-md-7 col-lg-6">
            <form class="form" v-on:submit.prevent="login">
              <h2 class="form-title">Book Manager Login</h2>
              
              <div class="form-group">
                <div class="p-2 mb-2 bg-danger" v-if="infoError">{{errorText}}</div>      
              </div>
              
              <div class="form-group">
                 <label for="email">Email address</label>
                 <input v-model.trim="email" class="form-control" name="email" type="email" placeholder="Enter email" required>      
              </div>
              <div class="form-group">
                 <label for="password">Password</label>
                 <input v-model.trim="password" class="form-control" name="password" type="password" placeholder="Enter password" required>
              </div>
            
              <div class="form-group">
                 <router-link to="/password-reset">Lost your password?</router-link>
              </div>
                 
              <button type="submit" class="btn btn-primary">Login</button>
            </form>            
         </div>
      </div>
   </div>
`,
    name: 'login page',
    data () {
        return {
            title: 'Login Page',
            updating: false,
            loader: false,
            infoError: false,
            errorText: "",
            email: '',
            password: ''
        }
    },
    
    mounted()
    {
      let logoutItem = document.getElementById("logout-menu");
      logoutItem.style.display='none';
      let addItem = document.getElementById("add-menu");
      addItem.style.display='none';
      let showItem = document.getElementById("show-menu");
      showItem.style.display='none';
      
      let loginItem = document.getElementById("login-menu");
      loginItem.style.display='block';
      let registerItem = document.getElementById("register-menu");
      registerItem.style.display='block';
    },
    
    methods: {
        login () {
            if (!this.validateForm()) {
                // Data invalid don't save.
                return;
            }

            // Send login info to server.
            let vm = this;

            axios.post('/api/v1/auth/login', {email: vm.email, password: vm.password})
               .then(function (response) {
                   console.log("Token is " + response.data.token);

                   if (response.data.token) {
                       localStorage.setItem('token', response.data.token);
                       let logoutItem = document.getElementById("logout-menu");
                       logoutItem.style.display='none';
                       let loginItem = document.getElementById("login-menu");
                       loginItem.style.display='block';
                       let registerItem = document.getElementById("register-menu");
                       registerItem.style.display='block';
                       
                       router.push('book-manager');
                   }

               })
               .catch(function (error) {
                   console.log("Returned 404");
                   vm.errorText = "Invalid username or password. Please try again.";
                   vm.infoError = true;
               });
        },

        validateForm() {
            let isValid = false;

            if (this.email.length < 6) {
                this.infoError = true;
                this.errorText = "Email must be at least six characters."
            } else if (this.password.length < 6) {
                this.errorText = "Password must be at least six characters.";
                this.infoError = true;
            } else {
                this.infoError = false;
            }

            if (!this.infoError) {
                isValid = true;
            }

            return isValid;
        }
    }
}


