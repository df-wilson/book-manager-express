const routes = [
   { path: '/', component: home },
   { path: '/login', component: login_form },
   { path: '/logout', component: logout },
   { path: '/register', component: register_form },
   { path: '/add', component: add_book },
   { path: '/edit', component: add_book },
   { path: '/book-manager', component: book_manager}
];

const router = new VueRouter({
   routes // short for `routes: routes`
});

const app = new Vue({
   router,
}).$mount('#app');
