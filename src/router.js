import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
import Layout from './layout/Index'
// meta格式说明:
// title = 当前页面的标题
// breadcrumb: 面包屑上有哪些连接
//   path = 请求连接
//   title = 标题
//   queryKeys =  ['query参数的key']

export const constantRoutes = [{
		path: '/',
		name: '/',
		redirect: 'apps'
	}, {
		path: '/login',
		name: 'Login',
		component: () => import('./views/login/Login')
	},
	{
		path: '/404',
		name: '404',
		component: () => import('./views/404')
	},
	{
		path: '/apps',
		component: Layout,
		children: [{
				path: '',
				name: 'apps',
				component: () => import('./views/application/List'),
				meta: {
					title:'Applications'
				}
			}, {
				path: '/apps/details',
				name: 'apps.details',
				component: () => import('./views/application/Details'),
				meta: {
					title:'Applications details',
					breadcrumb: [{
						path: '/apps',
						title: 'Applications'
					}]
				}
			},{
				path: '/apps/new',
				name: 'apps.new',
				component: () => import('./views/application/New'),
				meta: {
					title:'Add application',
					breadcrumb: [{
						path: '/apps',
						title: 'Applications'
					}]
				}
			},
			{
				path: '/apis/group',
				name: 'apis.group',
				component: () => import('./views/apis/ApiGroup'),
				meta: {
					title:'API group'
				}
			}
		]
	},
	// 404 page must be placed at the end !!!
	{
		path: '*',
		redirect: '/404',
		hidden: true
	}
]

const createRouter = () => new Router({
	scrollBehavior: () => ({
		y: 0
	}),
	routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
	const newRouter = createRouter()
	router.matcher = newRouter.matcher
}

export default router
