import Vue from 'vue'
import iView from 'view-design';
import 'view-design/dist/styles/iview.css';
import App from './App'
import router from './router'
import Resource from 'vue-resource'
import '@/assets/css/common.css'
import $ from 'jquery'
global.$ = global.jQuery = $
Vue.use(iView)
Vue.use(Resource)
Vue.config.productionTip = false
router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title}`;
    next();
})
// router.afterEach((to, from, next) => {})
new Vue({
        el: '#app',
        router,
        components: { App },
        template: '<App/>'
    })
    //捕捉全局异常
Vue.http.interceptors.push(function(request, next) {
    let _this = this;
    next(function(response) {
        if (response.status == 500) {
            let data = response.data;
            _this.$Message.error("服务器错误：" + data.ExceptionMessage);
        }
    });
}); 
