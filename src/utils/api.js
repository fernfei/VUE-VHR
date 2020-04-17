/**
 * axios统一处理本网站网络请求的失败信息
 */

import axios from 'axios';
import {Message} from "element-ui";
import Qs from 'qs'
import router from "../router";
/*响应拦截器 :在请求或响应被then或catch处理前拦截它们。*/
/**
 * response
 * 请求异常分为http请求异常，和系统的业务逻辑异常（也就是程序员自己定义的状态码）
 * 因此在http请求200成功的时候并代表程序的业务逻辑没有异常
 *
 *  error
 * 而在http请求的异常时，有可能是程序员在服务端设置的http请求异常也会带有异常信息
 * 因此http请求异常时，也需要接受一下服务端的响应信息
 */

axios.interceptors.response.use(response => {

    console.log(response)
    //success.status 存在进入
    //success.status是服务端网络响应的状态码
    //success.data.status是服务端业务逻辑的状态码
    if (response.status && response.status == 200 && response.data.status == 500) {
        //服务端业务逻辑错误
        Message.error({
            message:response.data.msg,
        })
        /*
        * 此时调用方法为 Message(options)。我们也为每个 type 定义了各自的方法，
        * 如 Message.success(options)。并且可以调用 Message.closeAll() 手动关闭所有实例。
        * */
        return;
    }
    if (response.status && response.status == 200 && response.data.status == 200) {
        //服务端请求成功
        //将数据返回出去
        if (response.data.msg != null) {
            Message.success({
                message: response.data.msg,
            });
        }
        return response.data;
    }
}, error => {
    console.log("error:"+error)
    if (error.response.status == 503 || error.response.status == 404) {
        Message.error({
            message: "服务器被吃啦( ╯□╰ )",
        })
    }else if (error.response.status == 403) {
        Message.error({
            message: "权限不足(,,•́ . •̀,,)，请联系QQ:1639670695!",
        })
    }else if (error.response.status == 401) {
        Message.error({
            message: "尚未登陆，请登陆（⊙.⊙）！",
        })
        router.replace("/");
     //else 其他异常码的错误
    }else {
        //服务端设置了http请求状态码，并且也附带了信息
        if (error.response.data.msg) {
            Message.error({
                message:error.response.data.msg,
            })
        }else{
            Message.error({
                message: "未知错误（⊙.⊙）！",
            })
        }
    }
    return;
});

/**
 *  封装前端各种请求
 */
//请求的前缀
let base = '';
/**
 * key-value形式请求
 *  json形式请求
 * export default 是默认导出
 * export const 是命名导出
 */
export const  postKeyValueRequest=(url,params)=>{
    //使用axios请求后端。axios封装了Ajax两者使用差不多
    return axios({
        method: "post",
        //这个两个表示占位符，和jQuery没关系引号是键盘1前面那个符号
        url: `${base}${url}`,
        data: params,
        // `transformRequest` 允许在向服务器发送前，修改请求数据
        // 只能用在 'PUT', 'POST' 和 'PATCH' 这几个请求方法
        // 后面数组中的函数必须返回一个字符串，或 ArrayBuffer，或 Stream
        transformRequest:[function (data) {
            //将data数据转换成`key=value&key=value`的形式提交给后端
            data = Qs.stringify(data)
            //console.log(data);
            return data;
        }],
        // `headers` 是即将被发送的自定义请求头
        headers:{
            //设置表单请求头
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
    });
}
/**
 * post
 * @param url
 * @param params
 * @returns {AxiosPromise}
 */
export const postRequest = (url, params) => {
    return axios({
        method: "post",
        url: `${base}${url}`,
        data: params
    })
};

/**
 * get
 * @param url
 * @param params
 * @returns {AxiosPromise}
 */
export const getRequest = (url, params) => {
    return axios({
        method: "get",
        url: `${base}${url}`,
        data: params
    })
};

/**
 * put
 * @param url
 * @param params
 * @returns {AxiosPromise}
 */
export const putRequest = (url, params) => {
    return axios({
        method: "put",
        url: `${base}${url}`,
        data: params
    })
};


/**
 * delete
 * @param url
 * @param params
 * @returns {AxiosPromise}
 */
export const deleteRequest = (url, params) => {
    return axios({
        method: "delete",
        url: `${base}${url}`,
        data: params
    })
};



