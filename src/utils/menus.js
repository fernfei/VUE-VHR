import {getRequest} from "./api";
/***
 * 初始化菜单
 * @param router 将服务端查询的菜单数据放在router
 * @param store  将服务端查询的菜单保存到store
 */
export const initMenu = (router,store) => {
    if (store.state.routes.length > 0) {
        //说明store里面有数据，直接返回
        return;
    }
    //getRequest是封装好请求后端函数
    getRequest('/system/config/menu').then(data => {
        if (data) {
            //如果有数据
            //服务端传过来的数据componet的数据是字符串，而router需要的是一个对象。不符合
            let fmtRoutes = formatRoutes(data.object);
            //将处理好的数据放入router路由
            router.addRoutes(fmtRoutes);
            //将处理好的数据存入vuex   commit()的第一个参数是mutations里的方法名，第二个参数是处理好的数据
            store.commit("initRoutes", fmtRoutes);
        }

    });
};
/***
 * 处理格式化后端传来的数据
 * @param routes
 * @returns {[]}
 */
export const formatRoutes = (routes) => {
    let fmtRoutes = [];
    routes.forEach((route) => {
        //批量变量定义并赋值
        //相当于 let path=route.path
        let {
            path,
            component,
            name,
            iconcls,
            meta,
            children
        } = route;
        //如果route有children并且children是一个数组，也就代表children是一个父级
        if (children && children instanceof Array) {
            children = formatRoutes(children);
        }
        /*将格式化的数据赋值给route*/
        let fmtRoute={
            path: path,
            name: name,
            iconcls:iconcls,
            meta:meta,
            children:children,
            component: resolve => {
                //require: 运行时调用，理论上可以运用在代码的任何地方，
                //import：编译时调用，必须放在文件开头


                /**
                 * router/index.js里面的Home，这时已经没用了【可以删除掉了】
                 *
                 * 为什么没用了呢？
                 * 因为router/index.js里面的Home没有children也就没有子组件
                 * 因此后端查来的组件并不在里面，也就不能路由对应的页面了
                 *
                 * 需要我们自己重新创建Home
                 */
                if (component === "Home") {
                    require(['../views/' + component + '.vue'], resolve);
                }else if (component.startsWith("Emp")) {
                    require(['../views/emp/' + component + '.vue'], resolve);
                } else if (component.startsWith("Per")) {
                    require(['../views/per/' + component + '.vue'], resolve);
                } else if (component.startsWith("Sal")) {
                    require(['../views/sal/' + component + '.vue'], resolve);
                } else if (component.startsWith("Sta")) {
                    require(['../views/sta/' + component + '.vue'], resolve);
                } else if (component.startsWith("Sys")) {
                    require(['../views/sys/' + component + '.vue'], resolve);
                }
                console.log(component);
            }
        }
        //route赋值给routes
        fmtRoutes.push(fmtRoute);
    });
    return fmtRoutes
};


//3月11号任务
//写到视频60