import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './style.css'
import App from './App.vue'
import HomeView from './views/HomeView.vue'
import UploadView from './views/UploadView.vue'
import CandidateView from './views/CandidateView.vue'

const routes = [
	{
		path: '/',
		redirect: '/home'
	},
	{
		path: '/home',
		name: 'home',
		component: HomeView
	},
	{
		path: '/upload',
		name: 'upload',
		component: UploadView
	},
	{
		path: '/candidates',
		name: 'candidates',
		component: CandidateView
	}
]

const router = createRouter({
	history: createWebHistory(),
	routes
})

createApp(App).use(router).use(ElementPlus).mount('#app')
