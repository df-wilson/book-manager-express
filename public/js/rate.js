const rate = {
   template:
   `<div id="rate-component">
      <span v-if="selectedStars > 0" v-on:click="selected(1)" class="icon-star em" aria-hidden="true">★</span>
      <span v-else v-on:click="selected(1)" class="em" aria-hidden="true">☆</span>
      <span v-if="selectedStars > 1" v-on:click="selected(2)" class="icon-star em" aria-hidden="true">★</span>
      <span v-else v-on:click="selected(2)" class="em" aria-hidden="true">☆</span>
      <span v-if="selectedStars > 2" v-on:click="selected(3)" class="icon-star em" aria-hidden="true">★</span>
      <span v-else v-on:click="selected(3)" class="em" aria-hidden="true">☆</span>
      <span v-if="selectedStars > 3" v-on:click="selected(4)" class="icon-star em" aria-hidden="true">★</span>
      <span v-else v-on:click="selected(4)" class="em" aria-hidden="true">☆</span>
      <span v-if="selectedStars > 4" v-on:click="selected(5)" class="icon-star em" aria-hidden="true">★</span>
      <span v-else v-on:click="selected(5)" class="em" aria-hidden="true">☆</span>
   </div>`,

      name: 'rate',
      data () {
         return {
            selectedStars: 0
         }
      },

      methods: {
         selected(count) 
         {
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
}


