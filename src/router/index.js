import Vue from 'vue'
import Router from 'vue-router'
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return originalPush.call(this, location)
    // .catch(err => err)
}
Vue.use(Router);
const router = new Router({
    base: '/',
    mode: 'history', //去掉#号
    routes: [
        {
            path: '*',
            meta: { title: '' },
            component: (resolve) => require(['@/views/error/404.vue'], resolve)
        }, {
            path: '/test',
            meta: {
                title: '批次管理'
            },
            component: {
                template: '<router-view />'
            },
            children: [{
                path: 'list',
                meta: { title: '批次列表' },
                component: (resolve) => require(['@/views/template/list.vue'], resolve)
            }, {
                path: 'add',
                meta: { title: '批次添加' },
                component: (resolve) => require(['@/views/template/add.vue'], resolve)
            }]
        }
    ]
});
export default router
