import Vue from 'vue'
import App from './App'


import ElementUI from 'element-ui'
import './styles/my-element-ui.css'

import i18n from './lang'
import store from './store'
import router from './router.js'

Vue.config.productionTip = false
Vue.use(ElementUI, {
	i18n: (key, value) => i18n.t(key, value)
})
new Vue({
	el: '#app',
	router,
	store,
	i18n,
	render: h => h(App)
})
