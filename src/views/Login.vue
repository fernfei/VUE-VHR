<template>
    <div id="body">
        <el-form :model="loginForm"
                 :rules="rules"
                 id="loginform"
                 ref="loginForm">
            <h3 class="loginTitle">系统登陆</h3>
            <el-form-item prop="username">
                <el-input prefix-icon="el-icon-user-solid" v-model="loginForm.username" aria-placeholder="Enter Username"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input type="password" prefix-icon="el-icon-lock" v-model="loginForm.password" @keydown.enter.native="loginSubmit()" aria-placeholder="Enter Password"></el-input>
            </el-form-item>
            <el-checkbox v-model="checked">记住密码</el-checkbox>
            <el-button type="primary"
                       style="width: 100%"
                       @click="loginSubmit()"
                       v-loading.fullscreen.lock="fullscreenLoading">登陆</el-button>
        </el-form>
    </div>
</template>

<script>

    export default {
        name: "Login",
        data() {
            return {
                /*登陆表单的信息*/
                loginForm: {
                    username:"admin",
                    password:"123"

                },
                checked:true,
                fullscreenLoading: false,
                /*规则*/
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password:[
                        { required: true, message: '请输入用户密码', trigger: 'blur' }
                    ]
                }
            };
        },
        methods:{
            loginSubmit:function () {
                    /*$refs获取当前页面的所有ref*/
                    this.$refs.loginForm.validate((valid) => {
                        /*校验传入进来的参数是否存在*/
                        if (valid) {
                            /*加载中*/
                            this.loading();

                            this.postKeyValueRequest('/doLogin', this.loginForm).then(resp => {
                                //resp有数据进来
                                if (resp) {
                                    //在浏览器中存储 key/value 对。 在关闭窗口或标签页之后将会删除这些数据。
                                    window.sessionStorage.setItem("user", JSON.stringify(resp));

                                    //$route为当前router跳转对象里面可以获取name、path、query、params等
                                    //.$route是一个跳转的路由对象，每一个路由都会有一个$route对象，是一个局部的对象，可以获取对应的name，path，params，query等
                                    let path=this.$route.query.redirect;
                                    //登陆成功后跳转到Home页
                                    //router是VueRouter的一个对象，通过Vue.use(VueRouter)和VueRouter构造函数得到一个router的实例对象，
                                    // 这个对象中是一个全局的对象，他包含了所有的路由包含了许多关键的对象和属性。
                                    this.$router.replace((path == null || path == undefined) ? "/home" : path);
                                }

                            });

                        } else {
                            this.$message({
                                message:"所有字段必须填写",
                                type:"error",
                                duration:500
                            });
                            return false;
                        }

                    });

            },
            loading() {
                this.fullscreenLoading = true;
                setTimeout(() => {
                    this.fullscreenLoading = false;
                }, 2000);
            },
            getUserIP() {

                //判断是否是同一个用户访问
                if (!(window.sessionStorage.getItem("ip"))) {
                    window.sessionStorage.setItem("ip", JSON.stringify(returnCitySN));
                    alert("欢迎来到微人管理系统本人QQ1639670695,你的IP已经被上传到服务器！我需要了解是否有人访问本站")
                }


                this.postRequest("/getIP",returnCitySN);

            }

        },
        mounted() {
            this.getUserIP();
        }
    }

</script>

<style scoped>
 .loginTitle{
     text-align: center;
 }
 #loginform {
     padding: 15px;
     margin: 300px auto;
     width: 380px;
     height: 300px;
     border-radius: 4%;
     /*水平位置，垂直位置，阴影大小，颜色*/
     box-shadow: 0 0 25px rgba(0, 0, 0, .2);
     opacity: 0.85;
     background-color: white;
     text-align: center;
 }
 #loginform button{
     margin-top: 20px;
 }
    #body{
        background-image: url("../assets/login.jpg");
        background-size: cover;
        width:100%;
        height: 100%;
        position: absolute;

    }

</style>