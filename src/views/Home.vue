<template>
    <div>
        <el-container>
            <el-header class="header" height="80px">
                <div class="title">微人事</div>
                <div>
                    <div class="chat-message">

                        <el-dropdown class="userInfo" @command="handleCommand">
                            <span class="el-dropdown-link"  @click="drawer = true">
                                {{user.object.name}}<i>
                                <img :src="imageUrl===''?user.object.userface:imageUrl" alt="头像">
                            </i>
                             </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="userinfo">个人中心</el-dropdown-item>
                                <el-dropdown-item command="chatinfo">消息中心</el-dropdown-item>
                                <el-dropdown-item command="setting">设置</el-dropdown-item>
                                <el-dropdown-item command="logout" divided >注销</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </div>

            </el-header>

            <el-container>
                <el-aside width="200px">
                    <!--在菜单标签上使用`router` 将启用该模式会在激活导航时以 index 作为 path 进行路由跳转-->
                    <el-menu router>
                        <!--this.$router.options.routers,这个拿到的就是router/index.js里面的路由数组-->
                        <el-submenu :index="index+''" v-for="(item,index) in routes" :key="index">
                            <template slot="title">
                                <i :class="item.iconcls" style="margin-right: 8px;color:dodgerblue;"></i>
                                <span>{{item.name}}</span>
                            </template>
                            <el-menu-item-group>
                                <el-menu-item :index="child.path" v-for="(child,indexj) in item.children" :key="indexj">{{child.name}}</el-menu-item>
                            </el-menu-item-group>

                        </el-submenu>

                    </el-menu>
                </el-aside>
                <el-main>
                    <el-breadcrumb separator-class="el-icon-arrow-right" v-show="this.$router.currentRoute.path!='/home'">
                        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                        <!--获取当前路由的名字-->
                        <el-breadcrumb-item>{{this.$router.currentRoute.name}}</el-breadcrumb-item>

                    </el-breadcrumb>
                    <div class="welcomevHr" @click="download" v-show="this.$router.currentRoute.path=='/home'" >
                        (•‾̑⌣‾̑•)✧˖欢迎来到微人事管理系统【点我下载本系统源码】(•‾̑⌣‾̑•)✧˖
                    </div>

                    <!--路由-->
                    <router-view/>
                </el-main>
            </el-container>
        </el-container>
        <div>
            <el-drawer
                    title="个人信息设置"
                    :visible.sync="drawer"
                    :with-header="false">
                <div style="margin-top: 50px;text-align: center;">
                    <div><h3>上传头像</h3></div>
                    <div class="upload-style">
                        <el-upload
                                class="avatar-uploader"
                                action="/system/hr/upload"
                                :show-file-list="false"
                                :on-success="handleAvatarSuccess"
                                :before-upload="beforeAvatarUpload">
                            <img v-if="imageUrl" :src="imageUrl===''?user.object.userface:imageUrl" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </div>
                    <div style="display: flex;justify-content: center;margin-top: 50px;">
                        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" size="small" style="width: 60%; " class="demo-ruleForm">
                            <el-form-item  prop="password">
                                <el-input placeholder="请输入修改密码" type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
                            </el-form-item>
                            <el-form-item prop="checkPassWord">
                                <el-input placeholder="请输入确定密码" type="password" v-model="ruleForm.checkPassWord" autocomplete="off"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                                <el-button @click="resetForm('ruleForm')">重置</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </el-drawer>
        </div>
    </div>
</template>

<script>
    /**
     *
     * vue中，new vue({})与export default {} 两者的区别？
     *
     * 1.new vue({}) 只在入口文件 main.js里使用，而其余组件的里的属性和方法的使用，
     *   为什么都要放在export default{}中，而不是每个组件都用new Vue({})来生成呢？
     *
     * 2.放在export default{}中它是作为一个class被导出的么？
     *
     * 3.另外两者的写法也不一样。就data来说，给作为new Vue的参数，它是对象。
     *   而在export default里面的data是一个方法
     *
     *
     *
     * 答案：第一问&&第二问
     * export default 的是一个对象 Object，然后父组件通过 components 属性注册，
     * 其实是内部调用了 Vue.extend 方法，把这个 Object 传入，然后得到的也是一个 Vue 的实例。
     * 为啥用 Vue.extend 而不是直接new Vue，
     * 因为他们要建立父子关系，形成一个 Vue 的组件树。
     *
     *
     * 答案：第三问
     * 组件里的 data 必须是一个方法，因为组件是多个实例，
     * 如果 data 是一个同一个 object，那么一个组件的修改会影响另一个，因此它必须返回一个方法。
     */
    export default {
        name: "Home",
        data(){
            let validatePassWord = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.ruleForm.checkPassWord !== '') {
                        this.$refs.ruleForm.validateField('checkPassWorld');
                    }
                    callback();
                }
            };
            let validateCheckPassWord = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.ruleForm.password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                user:JSON.parse(window.sessionStorage.getItem("user")),
                drawer: false,
                imageUrl: JSON.parse(window.sessionStorage.getItem("user")).object.userface,
                ruleForm: {
                    password: '',
                    checkPassWord: '',
                },
                rules: {
                    password: [
                        { validator: validatePassWord, trigger: 'blur' }
                    ],
                    checkPassWord: [
                        { validator: validateCheckPassWord, trigger: 'blur' }
                    ],
                }
            }
        },
        methods:{
            handleCommand:function (command) {
                /**
                 * 注销
                 */
                if (command === 'logout') {
                    this.$confirm('是否注销?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.getRequest('/logout');
                        //退出清空本地保存账户信息
                        window.sessionStorage.removeItem("user");
                        //退出清空Vuex里面存储的菜单
                        this.$store.commit("initRoutes", []);
                        this.$router.replace("/")
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消'
                        });
                    });
                }else if (command === 'chatinfo') {
                    this.$router.push("/chat");
                }else if (command === 'userinfo') {
                    this.drawer = true;
                }
            },
            download() {
                window.open("/salary/sob/download", "_parent");
            },
            /***
             *上传图片成功的回到函数
             */
            handleAvatarSuccess(res, file) {
                this.$message.success("头像上传成功！");
                this.imageUrl=res.object
                let user = this.user;
                user.object.userface = this.imageUrl;
                window.sessionStorage.removeItem("user");
                window.sessionStorage.setItem("user", JSON.stringify(user));
            },
            beforeAvatarUpload(file) {
                let flag = true;
                const isLt1M = file.size / 1024 / 1024 < 1;

                if (!(file.type==="image/jpeg"||file.type==="image/png")) {
                    this.$message.error('上传头像图片只能是 JPG/PNG 格式!');
                    flag = false;
                }
                if (!isLt1M) {
                    this.$message.error('上传头像图片大小不能超过 1MB!');
                }
                return flag && isLt1M;
            },
            /***
             *修改密码
             */
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let user = {};
                        user.id = this.user.object.id;
                        user.password = this.ruleForm.password;
                        user.enabled = this.user.object.enabled;
                        console.log(user)
                        this.postRequest("/system/hr/updateHr/", user)
                    } else {
                        this.$message.error("校验不通过！");
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
        },
        computed:{
            /**
             * 只返回 hidden 为 false的 routes
             * @returns {RouteConfig[]}
             */
            activeRoutes:function () {
                return this.$router.options.routes;
            },
            routes:function () {
                //$store 是挂载在 Vue 实例上的（即Vue.prototype），而组件也其实是一个Vue实例
                return this.$store.state.routes;
            }
        },
        mounted() {
            //登陆进来后直接让用户与服务端连接
            this.$store.dispatch('connect');

        }
    }
</script>

<style scoped>
    .header {
        background-color: #409EFF;
        color: white;
        display: flex;
        align-items: center;
        justify-content: space-between;

    }
    .title {
        font-size: 30px;
        font-family: 华文楷体;
    }

    .userInfo{
        color: white;
        cursor: pointer;
    }

    .userInfo img {
        margin-left: 8px;
        width: 48px;
        height: 48px;
        border-radius: 24px;
    }
    .el-dropdown-link{

        display: flex;
        align-items: center;
        font-size: 14px;
    }
    .welcomevHr {
        cursor: pointer;
        font-size: 30px;
        text-align: center;
        padding-top:100px;
        color: dodgerblue;

    }
    .avatar-uploader{
        height: 200px;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 200px;
        height: 200px;
        display: block;
        border-radius: 4%;
    }
    .upload-style{

        border-radius: 6px;
        cursor: pointer;
        width: 200px;
        height: 200px;
        margin-top: 50px;
        border-radius: 4%;
        /*水平位置，垂直位置，阴影大小，颜色*/
        box-shadow: 0 0 25px rgba(0, 0, 0, .2);
        margin-left: 200px;
    }
</style>