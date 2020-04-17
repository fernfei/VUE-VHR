/**
 *  因为前端Vue项目是localhost:8080
 *      后端Vhr是localhost:8081
 *  前端请求后端数据需要跨域，但其实这个跨域只存在开发过程中因为上线是会被合并在一起
 *  或者被Naginx请求转发，因此我们在开发中并不需要涉及到跨域问题
 *
 *
 *  利用Node.js请求转发，前端的请求先发到node.js----node.js把它转发到后端上
 *  后端再将响应给node.js,node.js再将响应交给前端
 *
 *
 *  该js就是配置一个代理对象
 *  官方文档 https://webpack.docschina.org/configuration/dev-server/#devserver-proxy
 */
//定义一个空对象
let proxyObj = {};

//转发WebSocket的请求
//先定义proxyObj第二项
proxyObj['/ws'] = {
    //开启WebSocket
    ws: true,
    //转发的目标地址
    target: "ws://localhost:8081"
};


//先定义proxyObj第一项
proxyObj['/'] = {
    //关闭websocket
    ws: false,
    //转发的目标地址
    target: "http://localhost:8081",
    changeOrigin: true,//跨域
    pathRewrite: {
        //可以对拦截到路径进行更改
        '^/': ""
    }
};



module.exports = {
    devServer: {
        host: "localhost",
        port:8080,
        proxy: proxyObj
    }
};




/***   module.exports = {
 *               devServer: {
 *                    host: "localhost",
                      port:8080,
 *                   proxy: {
 *                       '/': {
 *                           ws: false,
 *                           target: "http://localhost:8081",
 *                           changeOrigin: true,
 *                           pathRewrite: {
 *                               '^/': ""
 *                           }
 *                       }
 *                   }
 *               }
 *           };
 *
 *
 */