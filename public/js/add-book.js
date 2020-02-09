const add_book = {
   template: `
   <div class="container" id="add-book">
      <div class="row">
         <div class="col-12">
            <h1>{{title}}</h1>
            <h3>{{subtitle}}</h3>
            <p class="error text-danger center">{{errors.misc}}</p>
         </div>
      </div>

      <div id="book-form" class="row">
         <div class="col-12">
            <form v-on:submit.prevent="onSubmit">
               <div class="form-group">
                  <label for="title">Title <span class="text-danger error"> {{errors.title}}</span></label>

                  <input name="title" id="title" type="text" placeholder="book title" class="form-control" v-model="book.title" />
               </div>
               <div class="form-group">
                  <label for="author">Author <span class="text-danger error"> {{errors.author}}</span></label>
                  <input id="author" name="author" type="text" placeholder="author" class="form-control" v-model="book.author" />
               </div>
               <div class="form-group">
                  <label for="year">Year <span class="error text-danger">{{errors.year}}</span></label>
                  <input name="year" id="year" type="text" size=4 placeholder="year" class="form-control" style="width: auto" v-model="book.year" />
               </div>
               <div class="form-group">
                  <label>Rating</label>
                  <rate v-on:onRatingSelected="onRatingSelected"></rate>
               </div>
               <div class="checkbox">
                  <label for="read">
                     <input name="read" id="read" type="checkbox" v-model="book.read" /> <b>Read?</b>
                  </label>
               </div>

               <button class="btn btn-primary">{{buttonText}}</button>
               <button class="btn btn-primary" v-on:click.stop.prevent="onCancel">Done</button>
            </form>
         </div>
      </div>
   </div>
   
   `,
   created() {
      if(this.$route.query.mode && this.$route.query.mode == 'edit')
      {
         this.subtitle = 'Edit Book';
         this.buttonText = 'Update';
         this.isUpdating = true;
         
         if(this.$route.query.book_id) {
            this.book.id = this.$route.query.book_id;
         }
         if(this.$route.query.book_title) {
            this.book.title = this.$route.query.book_title;
         }
         if(this.$route.query.book_author) {
            this.book.author = this.$route.query.book_author;
         }
         if(this.$route.query.book_year) {
            this.book.year = this.$route.query.book_year;
         }
         if(this.$route.query.book_read) {
            this.book.read = this.$route.query.book_read;
         }
         if(this.$route.query.book_rating) {
            this.book.rating = this.$route.query.book_rating;
            this.selectedStars = this.$route.query.book_rating;
         }
      }
      else
      {
         this.subtitle = 'Add Book';
         this.buttonText = 'Add';
         this.isUpdating = false;
      }
   },
    
   data () {
      return {
         title: "Book Manager",
         subtitle: "",
         buttonText: "",
         isUpdating: false,
         year: "",
         book: 
         {
            id: 0,
            title:  '',
            year:   '',
            author: '',
            read:   false,
            rating: 0
         },
         errors: 
         {
            title:  '',
            author: '',
            year:   '',
            misc:   '',
            rating: ''
         },
         selectedStars: 0
      }
   },
   
   components: {
      rate
   },
      
   methods: 
   {
      onCancel() 
      {
         this.updating = false;
         router.push({path: '/book-manager'});
      },

      onRatingSelected(rating) 
      {
         this.book.rating = rating;
      },
      
      onSubmit() 
      {
         if(!this.validateForm()) {
            // Data invalid don't save.
            return;
         }

         if (this.isUpdating) {
            this.submitUpdate();
         } else {
            this.submitAdd();
         }
      },
      
      validateForm() 
      {
         let result = true;

         this.clearErrors();

         if(this.book.year.match(/^[0-9]+$/) == null) {
            this.errors.year = "Year must be a positive number without any letters.";
            result = false;
         } else if (year < 0 || year > 9999) {
            this.errors.year = "Year must be > 0 and < 9999.";
            result = false;
         } else {
            // Valid.
         }

         if(!this.validateString(this.book.title)) {
            this.errors.title = "Value required for title.";
            result = false;
         }

         if(!this.validateString(this.book.author)) {
            this.errors.author = "Value required for author.";
            result = false;
         }

         return result;
      },

      validateString(data) 
      {
         data = data.trim();
         if(data.length) {
            return true;
         } else {
            return false;
         }
      },
      
      clearErrors() 
      {
         this.errors = {
              title: '',
              year: '',
              author: '',
              misc: '',
              rating: ''
         };
      },

      clearForm() 
      {
         this.book = {
              title: '',
              year: '',
              author: '',
              read: false,
              rating: 0
         };
         this.clearErrors();
      },

      displayErrors(errordata) 
      {
         if(!errordata) {
            return;
         }

         // Only use the first error for each field
         if(errordata.title) {
            this.errors.title = errordata.title[0];
         }

         if(errordata.author) {
            this.errors.author = errordata.author[0];
         }

         if(errordata.year) {
            this.errors.year = errordata.year[0];
         }

         if(errordata[0]) {
            this.errors.misc = errordata[0];
         }
      },
        
      submitAdd() 
      {
         // Creating a new book.
         let vm = this;
         var token = localStorage.getItem("token");
         axios.post('/api/v1/books?token='+token, vm.book)
              .then(function(response) {
                  vm.book.id = response.data.id;
                  vm.books.push(vm.book);
                  vm.clearForm();
               })
              .catch(function(error) {
                  vm.clearErrors();
                  alert("Error param in response " + JSON.stringify(error)); 
               
                  if(error.response.data.errors) {
                     vm.displayErrors(error.response.data.errors);
                  } else {
                     alert("Errors undefined in response " + JSON.stringify(error)); 
                  }
               })
      },
         
      submitUpdate ()
      {
         // Updating an existing book
         let vm = this;
         var token = localStorage.getItem("token");
         axios.put("/api/v1/books/" + this.book.id+'?token='+token,
               {
                  title:  this.book.title,
                  author: this.book.author,
                  year:   this.book.year,
                  read:   this.book.read,
                  rating: this.book.rating
               })
               .then(function(response) {
                  router.push({path: '/book-manager'});
               })
               .catch(function(error) {
                  alert("Error param in response " + JSON.stringify(error)); 
                  vm.clearErrors();
                  vm.displayErrors(error.response.data.errors);
               });
      },
   }
}
