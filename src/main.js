import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import ElementPlus from 'element-plus'
import { zhCn } from 'element-plus/es/locale/index.mjs'
import 'element-plus/dist/index.css'
import 'uno.css'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'

//定义路由规则
const routes = [
	{
		path: '/',
		redirect: '/home'
	},
	{
		path: '/home',
		name: 'home',
		component: () => import('./views/HomeView.vue')
	},
	{
		path: '/upload',
		name: 'upload',
		component: () => import('./views/UploadView.vue')
	},
	{
		path: '/candidates',
		name: 'candidates',
		component: () => import('./views/CandidateView.vue'),
		//嵌套路由，候选详情页
		// children: [
		// 	{
		// 		path: ':id',
		// 		name: 'candidateDetail',
		// 		component: () => import('./views/CandidateDetailView.vue')
		// 	}
		// ]
	}
]

//创建路由实例
const router = createRouter({
	history: createWebHistory(),//路由模式，使用HTML5的history模式
	routes
})

//加载路由实例
const app = createApp(App)
app.use(router)

//加载Element Plus组件库
app.use(ElementPlus, {
	locale: zhCn
})

//加载Pinia状态管理库
const pinia = createPinia()
app.use(pinia)

//挂载Vue应用
app.mount('#app')




