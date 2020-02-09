const logout = {
   template: `

   <div class="container">
      <div class="row justify-content-center">
         <div class="col-12">
            <h2>
               Logging Out
            </h2>
         </div>
      </div>
   </div>
`,
   name: 'logout page',
   data () {
      return {
         title: 'Logout page',
      }
   },
   
   mounted() 
   {
      let vm = this;
   
      let logoutItem = document.getElementById("logout-menu");
      logoutItem.style.display='none';
      let loginItem = document.getElementById("login-menu");
      loginItem.style.display='block';
      let registerItem = document.getElementById("register-menu");
      registerItem.style.display='block';
   
      var token = localStorage.getItem("token");
      
      if(token) {
         // Only send a request to the server to delete a token if it is valid.
         axios.post('/api/v1/auth/logout', {token: token})
            .then(function (response) {
               localStorage.removeItem('token');
               router.push('/');

            })
            .catch(function (error) {
            });
      } else {
         router.push('/');
      }
   },
         
   methods: {
   }
}


