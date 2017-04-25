Vue.component('book-manager', {
   template: `
   <div class="container" id="book-manager">
      <div class="row">
         <div class="col-xs-12">
            <h1>{{title}}</h1>
            <h3 v-if="updating">Edit Book</h3>
            <h3 v-else>New Book</h3>
            <p class="error text-danger center">{{errors.misc}}</p>
         </div>
      </div>

      <div id="book-form" class="row">
         <div class="col-sm-12">
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

               <button class="btn btn-primary" v-if="updating">Update</button>
               <button class="btn btn-primary" v-else>Add</button>
               <button class="btn btn-primary" v-on:click.stop.prevent="onCancel">Cancel</button>
            </form>
         </div>
      </div>
      <div class="row">
         <div class="col-sm-12">
            <h3>All Books</h3>
            <table class="table table-bordered">
               <tr>
                  <th class="clickable" v-on:click.prevent="onSortTitle()">Title <span class="glyphicon glyphicon-triangle-bottom" aria-hidden="true"></span></th>
                  <th class="clickable" v-on:click.prevent="onSortAuthor()">Author <span class="glyphicon glyphicon-triangle-bottom" aria-hidden="true"></span></th>
                  <th class="clickable" v-on:click.prevent="onSortYear()">Year <span class="glyphicon glyphicon-triangle-bottom" aria-hidden="true"></span></th>
                  <th>Read</th>
                  <th>Rating</th>
                  <th>Update</th>
                  <th>Delete</th>
               </tr>
               <tr v-for="(b, index) in books">
                  <td>{{b.title}}</td>
                  <td>{{b.author}}</td>
                  <td>{{b.year}}</td>
                  <td v-if="b.read" class="text-success em">✓</td>
                  <td v-else> </td>
                  <td v-if="b.rating">{{b.rating}} <span class="glyphicon glyphicon-star" aria-hidden="true"></span></td>
                  <td v-else> </td>
                  <td v-on:click.prevent="onEdit(index)"><a class="em">✎</a></td>
                  <td v-on:click.prevent="onDelete(index)"><a class="text-danger em">✗</a></td>
               </tr>
            </table>
         </div>
      </div>
   </div>
   
   `,
   
      name: 'book',
      data () {
         return {
            title: 'Book Manager',
            updating: false,
            updateIndex: 0,
            books: [],
            book: {
               id: 0,
               title: '',
               year: '',
               author: '',
               read: false,
               rating: 0
            },
            errors: {
               title: '',
               author: '',
               year: '',
               misc: '',
               rating: ''
            },

            selectedStars: 0
         }
      },

      mounted() {
         let vm = this;
         axios.get('/api/v1/books')
            .then(function(response) {
               for(let i = 0; i < response.data.books.length; i++) {
                  let book = [];
                  book.id = response.data.books[i].id;
                  book.title = response.data.books[i].title;
                  book.author = response.data.books[i].author;
                  book.year = response.data.books[i].year;
                  book.read = response.data.books[i].read != 0;
                  book.rating = response.data.books[i].rating;
                  vm.books.push(book);
               }
            })
            .catch(function(error) {
            });
      },

      methods: {
         onCancel() {
            this.updating = false;
            this.clearForm();
         },

         onSortAuthor() {
            this.books.sort(function(a,b) {
               let author1 = a.author.toLowerCase();
               let author2 = b.author.toLowerCase();

               if(author1 < author2) {
                  return -1;
               }
               if(author1 > author2) {
                  return 1;
               }

               return 0;
            });
         },

         onSortTitle() {
            this.books.sort(function(a,b) {
               let title1 = a.title.toLowerCase();
               let title2 = b.title.toLowerCase();

               if(title1 < title2) {
                  return -1;
               }
               if(title1 > title2) {
                  return 1;
               }

               return 0;
            });
         },

         onSortYear() {
            this.books.sort(function(a,b) {
               let year1 = a.year.toLowerCase();
               let year2 = b.year.toLowerCase();

               if(year1 < year2) {
                  return -1;
               }
               if(year1 > year2) {
                  return 1;
               }

               return 0;
            });
         },

         onSubmit() {
            if(!this.validateForm()) {
               // Data invalid don't save.
               return;
            }

            if (this.updating) {
               this.onUpdate();
               return;
            }

            // Creating a new book.
            let vm = this;

            axios.post('/api/v1/books', vm.book)
               .then(function(response) {
                  vm.book.id = response.data.id;
                  vm.books.push(vm.book);
                  vm.clearForm();
               })
               .catch(function(error) {
                  vm.clearErrors();
                  vm.displayErrors(error.response.data.errors);
               });
         },

         onEdit (index) {
            this.updating = true;
            this.updateIndex = index;

            // Create a new copy of the book object data.
            Object.assign(this.book, this.books[index]);
         },

         onUpdate () {
            let vm = this;
            
            axios.put("/api/v1/books/" + this.books[this.updateIndex].id,
               {
                  title: this.book.title,
                  author: this.book.author,
                  year: this.book.year,
                  read: this.book.read,
                  rating: this.book.rating
               })
               .then(function(response) {
                  vm.updating = false;
                  vm.books[vm.updateIndex] = vm.book;
                  vm.clearForm();
               })
               .catch(function(error) {
                  vm.clearErrors();
                  vm.displayErrors(error.response.data.errors);
               });
         },

         onDelete (index) {
            let vm = this;
            
            axios.delete('/api/v1/books/' + vm.books[index].id)
               .then(function(response) {
                  vm.books.splice(index, 1);
               })
               .catch(function(error) {
                  vm.displayErrors(error);
               });
         },

         clearErrors() {
            this.errors = {
               title: '',
               year: '',
               author: '',
               misc: '',
               rating: ''
            };
         },

         clearForm() {
            this.book = {
               title: '',
               year: '',
               author: '',
               read: false,
               rating: 0
            };
            this.clearErrors();
         },

         displayErrors(errordata) {
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

         validateForm() {
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

         validateString(data) {
            data = data.trim();
            if(data.length) {
               return true;
            } else {
               return false;
            }
         },

         onRatingSelected(rating) {
            this.book.rating = rating;
         }
      }
  });


Vue.component('rate', {
   template:
   `<div id="rate-component">
      <span v-if="selectedStars > 0" v-on:click="selected(1)" class="glyphicon glyphicon-star" aria-hidden="true"></span>
      <span v-else v-on:click="selected(1)" class="glyphicon glyphicon-star-empty" aria-hidden="true"></span>
      <span v-if="selectedStars > 1" v-on:click="selected(2)" class="glyphicon glyphicon-star" aria-hidden="true"></span>
      <span v-else v-on:click="selected(2)" class="glyphicon glyphicon-star-empty" aria-hidden="true"></span>
      <span v-if="selectedStars > 2" v-on:click="selected(3)" class="glyphicon glyphicon-star" aria-hidden="true"></span>
      <span v-else v-on:click="selected(3)" class="glyphicon glyphicon-star-empty" aria-hidden="true"></span>
      <span v-if="selectedStars > 3" v-on:click="selected(4)" class="glyphicon glyphicon-star" aria-hidden="true"></span>
      <span v-else v-on:click="selected(4)" class="glyphicon glyphicon-star-empty" aria-hidden="true"></span>
      <span v-if="selectedStars > 4" v-on:click="selected(5)" class="glyphicon glyphicon-star" aria-hidden="true"></span>
      <span v-else v-on:click="selected(5)" class="glyphicon glyphicon-star-empty" aria-hidden="true"></span>
   </div>`,

      name: 'rate',
      data () {
         return {
            selectedStars: 0
         }
      },

      methods: {
         selected(count) {
            switch(count) {
               case 1:
                  this.selectedStars = 1;
                break;

               case 2:
                  this.selectedStars = 2;
                break;

               case 3:
                  this.selectedStars = 3;
                break;

               case 4:
                  this.selectedStars = 4;
                break;

               case 5:
                  this.selectedStars = 5;
                break;

               default:
                  this.selectedStars = 6;
                break;
            }

            this.$emit('onRatingSelected', this.selectedStars);
         }
      }
   });


var app = new Vue({
  el: '#app',
  data: {
  }
});
