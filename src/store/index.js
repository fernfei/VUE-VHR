import Vue from 'vue';
import Vuex from 'vuex';
import {getRequest} from "../utils/api";
import SockJS from "../utils/sockjs";
import {Stomp} from "../utils/stomp";
import { Notification } from 'element-ui';
import router from '../router/index'
/***
 * Vuex状态管理，用于存储服务端返回的数据
 */

Vue.use(Vuex);
const store=new Vuex.Store({
    /*定义变量的地方*/
    state: {
        routes: [],
        //以key-value形式保存用户聊天记录
        // admin#libai:聊天记录
        userWithMessages: {},
        //所有用户信息
        users: [],
        //选中的用户信息
        currentSession: "",
        //当前登陆的用户消息
        currentHr: '',
        filterKey: '',
        stomp: null,
        //格式  admin#libai：true
        isDot: {}

    },
    getters:{

    },
    /*修改state里面变量通过mutations，类似java中的set方法*/
    mutations: {
        ININ_CURRENTHR(state, user) {
            state.currentHr = user;
        },
        //传参时，state参数可以不用传入
        initRoutes(state, data) {
            state.routes = data;
        },
        //点中要聊天的用户头像时变化
        changeCurrentSession (state,user) {
            state.isDot[state.currentHr.username + '#' + user.username] = false;

            state.currentSession = user;
        },
        addMessage (state,msg) {
            //用以key-value存储聊天记录
            let mss = state.userWithMessages[state.currentHr.username + '#' + msg.to];
            if (!mss) {
                //state.userWithMessages[state.currentHr.username + '#' + msg.to] = [];
                /***
                 * Vue只会监听对象已有的属性，后来新增的属性无法监听其变化
                 *
                 * userWithMessages:{}
                 * state.userWithMessages[state.currentHr.username + '#' + msg.to]
                 * 我们原属性是为空，因此我们这里加的属性则都不会被监听到
                 */
                //参数分别  是监听的对象名，监听的key，监听的value
                Vue.set(state.userWithMessages, state.currentHr.username + '#' + msg.to, []);

            }
            state.userWithMessages[state.currentHr.username + '#' + msg.to].push({
                content:msg.content,
                date: new Date(),
                //用来区分是自己发消息的聊天记录还是别人发的聊天记录
                self: !msg.noSelf
            })
            console.log("addMessage")
            console.log(state.userWithMessages)
        },
        INIT_DATA (state) {
            let data = localStorage.getItem('vue-chat-session');
            //console.log(data)
            if (data) {
                state.userWithMessages = JSON.parse(data);
            }
        },
        INIT_USERS(state, data) {
            state.users = data;
        }
    },
    /*也是修改states里面的变量，但是actions提交的是mutations，而不是直接更改state的状态*/
    /*并且actions可以包含异步请求，如果说你修改一个值需要网络访问，可以使用actions*/
    actions: {
        connect(context) {
            //服务器连接点
            let socket = new SockJS("/ws/ep");
            //调用state里面的对象
            //将创建的Stomp对象赋给state的对象
            context.state.stomp = Stomp.over(socket);
            //第一个参数是连接的一些配置
            //success连接成功的回调
            //error连接失败的回调
            context.state.stomp.connect({}, success => {
                //订阅服务端的消息，如果有新消息，服务端会发给订阅的客户端
                //user前缀是必须的，默认就有，
                context.state.stomp.subscribe('/user/queue/chat', msg => {
                    //msg里面有服务端发回的消息
                    let receivedMessage = JSON.parse(msg.body);
                    //服务端来其他用户发的信息时或者没有选中聊天对象时，给个提示
                    if ((context.state.currentSession===""||context.state.currentSession.username != receivedMessage.from)&&router.currentRoute.path === '/chat') {
                        Notification({
                            title: '新消息',
                            message: "来自【" + receivedMessage.name + "】一封消息",
                            iconClass: 'el-icon-chat-round',
                            showClose: false
                        })
                        //有新消息就将isDot设置为true，然后会在相应的用户头像有红点提示
                        Vue.set(context.state.isDot, context.state.currentHr.username + '#' + receivedMessage.from, true);

                    }
                    //
                    if (router.currentRoute.path != '/chat') {
                        Notification({
                            title: '新消息',
                            message: "来自【" + receivedMessage.name + "】一封消息",
                            duration: 0,
                            iconClass: 'el-icon-chat-round',
                            showClose: true
                        })
                    }

                    receivedMessage.to = receivedMessage.from;
                    receivedMessage.noSelf = true;
                    context.commit('addMessage', receivedMessage);
                });
            }, error => {
                console.log("socket关闭");
            });
        },
        initData (context) {
            //异步请求用户信息
            getRequest("/system/chat/").then(resp => {
                if (resp) {
                    //调用mutations里面的方法
                    context.commit('INIT_USERS', resp.object);
                }
            });
            context.commit("INIT_DATA");
        }

    }

});

store.watch(function (state) {
    return state.userWithMessages
},function (val) {
    console.log('CHANGE: ', val);
    localStorage.setItem('vue-chat-session', JSON.stringify(val));
},{
    deep:true/*这个貌似是开启watch监测的判断,官方说明也比较模糊*/
})


export default store;