import Vue from 'vue';
import app from './components/app.vue';

import Vuetify from 'vuetify'

Vue.use(Vuetify)

import 'vuetify/dist/vuetify.min.css'

const main = new Vue({
	el: '#app',
	components: {app},
	template: '<app />'
});
