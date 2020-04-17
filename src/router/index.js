import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login'
import Home from '../views/Home'
import Chat from '../views/chat/FriendChat';

Vue.use(VueRouter)
/**
 * 当请求的url是`/test1`或者·`/test2`时
 * 会先去Home.vue组件去找有没有`<router-view/>`
 * 而不是直接去找App.vue里面的`<router-view/>`
 */
const routes = [
    {
        path: '/',
        name: 'Login',
        component: Login,
    }, {
        path: '/home',
        name: 'Home',
        component: Home,
        children:[
            {
                path: "/chat",
                name: "消息中心",
                component: Chat
            }
        ]
    }
]

const router = new VueRouter({
    routes
})

export default router




