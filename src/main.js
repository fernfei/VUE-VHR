import Vue from 'vue'
import App from './App.vue'
import router from './router'
// collapse 展开折叠
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import {postKeyValueRequest} from "./utils/api";
import {postRequest} from "./utils/api";
import {getRequest} from "./utils/api";
import {putRequest} from "./utils/api";
import {deleteRequest} from "./utils/api";
import store from './store';
import {initMenu} from "./utils/menus";
import 'font-awesome/css/font-awesome.min.css'
//转化UTC时间的
import moment, {months} from "moment";
import Qs from 'qs'

//添加 Vue 实例方法，通过把它们添加到 Vue.prototype 上实现。可以全局this.自定义方法
//这样就不用在每个用到该方法的地方再一个一个导入，【集中管理】
Vue.prototype.postKeyValueRequest = postKeyValueRequest;
Vue.prototype.postRequest = postRequest;
Vue.prototype.getRequest = getRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.deleteRequest = deleteRequest;
Vue.prototype.moment = moment;
Vue.config.productionTip = false
Vue.component(CollapseTransition.name, CollapseTransition)

/***
 * 路由的全局前置守卫 类似java的过滤器
 *
 * 例如 A页面===>B页面
 *
 * to：B页面
 * from：A页面
 *
 * @param to 去的路径
 * @param from 来自的路径
 * @param next 类似Java过滤器的ChainFilter
 */
router.beforeEach((to, from, next) => {
  console.log(to);
  console.log(from);
  //如果是登陆页面就直接过去
  if (to.path==='/') {
    next();
  }else{
    //如果非Login页面，每次都会导入菜单

    //如果登陆了
    if (window.sessionStorage.getItem("user")) {
      //如果请求的页面是本系统不存在的页面，直接重定向到Home页面
      if (to.name === null) {
        next("/home")
      }else{
        initMenu(router, store);
        store.commit("ININ_CURRENTHR", JSON.parse(window.sessionStorage.getItem("user")).object);
        next();
      }

    }else{
        //如果未登录却想请求非登陆页面的话==>重定向到登陆页面，并且把URL返回给登陆页面
        //好让登陆成功后直接去该页面
        next("/?redirect="+to.path);
    }
  }



});

Vue.use(ElementUI);
new Vue({
  router,
  store,
  render: function (createElement) {
    return createElement(App);
  }
}).$mount('#app')


