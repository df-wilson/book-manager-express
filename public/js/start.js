const home = {
   template: `
      <div class="container">
         <div class="row justify-content-center">
            <div class="col-10 col-sm-9 col-md-7 col-lg-6">
               <h1>Book Manager</h1>
               <p>This is an awsome app to help you manage your book collection.</p>
            </div>
         </div>
      </div>
   `,
   
   name: 'home',
   data () {
      return {
         title: 'home',
         loggedIn: false,
      }
   },
   mounted()
   {      
      const token = localStorage.getItem("token");
      if(token) {
         router.push('book-manager');
      } else {
         router.push('login');
      }
   }
};
