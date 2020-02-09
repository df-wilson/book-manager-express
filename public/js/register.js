const register_form = {
   template: `

   <div class="container">
      <div class="row justify-content-center">
         <div class="col-10 col-sm-9 col-md-7 col-lg-6">
            <form class="form" v-on:submit.prevent="register">
              <h2 class="form-title">Create an Account</h2>
              
              <div class="form-group">
                <div class="p-2 mb-2 bg-danger" v-if="infoError">{{errorText}}</div>      
              </div>
              <div class="form-group">
                 <label for="name">Name</label>
                 <input v-model.trim="name" class="form-control" name="name" type="text" placeholder="Enter your user name" required>      
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
                 <label for="password2">Retype Password</label>
                 <input v-model.trim="password2" class="form-control" name="password2" type="password" placeholder="Enter your password again" required>
              </div>
            
              <div class="form-group">
                 <router-link to="/password-reset">Lost your password?</router-link>
              </div>
                 
              <button type="submit" class="btn btn-primary">Register</button>
            </form>            
         </div>
      </div>
   </div>
`,
   name: 'register',
   data () {
      return {
         title: 'Register',
         updating: false,
         loader: false,
         infoError: false,
         errorText: "",
         name: "",
         email: "",
         password: "",
         password2: ""
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
      register () {
         if(!this.validateForm()) {
            // Data invalid don't save.
            console.log("Form data invalid.");
            return;
         }

         // Send login info to server.
         let vm = this;

         axios.post('/api/v1/auth/register', {name: vm.name, email: vm.email, password: vm.password})
            .then(function(response) {
               console.log("Register. Token is " + response.data.token);

               if(response.data.token) {
                  localStorage.setItem('token', response.data.token);
                  vm.$router.push("book-manager");
               }

            })
            .catch(function(error) {
               console.log("Returned 404");
               //vm.clearErrors();
               //vm.displayErrors(error.response.data.errors);
               vm.errorText = "Invalid username or password. Please try again.";
               vm.infoError = true;
            });
      },

      validateForm() {
         let isValid = false;

         if(this.email.length < 6) {
            this.infoError = true;
            this.errorText = "Email must be at least six characters."
         } else if(this.password.length < 6) {
            this.errorText = "Password must be at least six characters.";
            this.infoError = true;
         } else if (this.password !== this.password2) {
            this.errorText = "Passwords must match.";
            this.infoError = true;
            this.errorText = "";
         } else {
            this.infoError = false;
         }

         if(!this.infoError) {
            isValid = true;
         }

         return isValid;
      }
   }
};

