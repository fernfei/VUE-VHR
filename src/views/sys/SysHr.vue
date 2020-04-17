<template>
    <div v-loading="loading">
        <div class="searchBox">
            <el-input class="searchUser"
                      v-model="keywords"
                      @keydown.enter.native="searchUser"
                      placeholder="仅展示部分用户,可以通过搜索用户名来展示用户..."
                      prefix-icon="el-icon-search"
                      size="small"></el-input>
            <el-button class="buttonUser"
                       type="primary"
                       icon="el-icon-search"
                       size="small"
                       @click="searchUser">搜索</el-button>
        </div>
        <div class="user">
            <el-card class="box-card" v-for="(user,index) in userData" :key="index">
                <div slot="header">
                    <span>{{user.name}}</span>
                    <el-button style="float: right; padding: 3px 0"
                               type="danger"
                               @click="deleteUserById(user)"
                               icon="el-icon-delete"></el-button>
                </div>
                <div class="user-info">
                    <div class="user-image-info" >
                        <el-image class="userface" :src="user.userface" :alt="user.name"></el-image>
                    </div>

                    <div class="user-text-info">
                        <div><span>用户:&nbsp&nbsp&nbsp{{user.name}}</span></div>
                        <div><span>手机:&nbsp&nbsp&nbsp{{user.phone}}</span></div>
                        <div><span>电话:&nbsp&nbsp&nbsp{{user.telephone}}</span></div>
                        <div><span>地址:&nbsp&nbsp&nbsp{{user.address}}</span></div>
                        <div>
                            <span>状态:&nbsp&nbsp&nbsp
                                <el-tooltip :content="user.enabled?'开启':'禁用'" placement="top">
                                  <el-switch
                                          v-model="user.enabled"
                                          active-color="#13ce66"
                                          inactive-color="#ff4949"
                                          @change="changeEnabled(user)">
                                  </el-switch>
                                </el-tooltip>

                            </span>
                        </div>
                        <div>
                            <span>角色:&nbsp&nbsp&nbsp
                                    <el-tag type="success"
                                            v-for="role in user.roles"
                                            :key="role.id"
                                            style="margin-right: 4px;display: inline-block;"
                                            closable
                                            @close="deleteRoleById(user,role.id)">{{role.namezh}}</el-tag>
                                <el-popover
                                        placement="right"
                                        width="200"
                                        trigger="click"
                                        @show="showRoles(user)"
                                        @hide="hideRoles(user)">
                                    <div style="font-size: 15px;margin-bottom: 5px;">角色列表</div>
                                    <el-select
                                            v-model="selectRoles"
                                            multiple
                                            filterable
                                            allow-create
                                            default-first-option
                                            placeholder="请选择角色">
                                        <el-option
                                                v-for="role in allRoles"
                                                :key="role.id"
                                                :label="role.namezh"
                                                :value="role.id">
                                        </el-option>
                                    </el-select>
                                  <el-button slot="reference"
                                             type="text"
                                             icon="el-icon-more"
                                             :disabled="disabled"
                                             style="margin-left: 10px"
                                             @click="initRoles"></el-button>
                                </el-popover>

                            </span>
                        </div>
                        <div><span>备注:&nbsp&nbsp&nbsp{{user.remark}}</span></div>
                    </div>

                </div>
            </el-card>
        </div>
    </div>
</template>

<script>
    export default {
        name: "SysHr",
        data() {
            return {
                userData:[],
                allRoles:[],
                selectRoles: [],
                keywords: "",
                disabled: false,
                loading: true
            }
        },
        mounted() {
            this.initUser();
        },
        watch: {
            keywords(value) {
                if (value === "") {
                    this.initUser();
                }
            }
        },
        methods:{
            initUser() {

                this.getRequest("/system/hr/").then(resp => {
                    this.loading = false;
                    if (resp) {
                        this.userData = resp.object;
                    }else{
                        this.$message.error("加载用户失败！");
                    }
                });
            },
            changeEnabled(user){
                this.postRequest("/system/hr/", user)
            },
            initRoles() {
                this.disabled = true;
                this.getRequest("/system/basic/permiss/").then(resp => {
                    if (resp) {
                        this.allRoles = resp.object;
                    }else{
                        this.$message.error("加载角色信息失败！");
                    }
                });
            },
            showRoles(user) {
                this.selectRoles = [];
                user.roles.forEach(role => {
                    this.selectRoles.push(role.id);
                });
            },
            hideRoles(user) {
                this.disabled = false;
                let rid = [];
                user.roles.forEach(role => {
                    rid.push(role.id);
                });
                //将用户具有的角色和修改的角色比较是否一样，一样则没有修改
                //如果没有修改，那么之间返回
                if (rid.toString() === this.selectRoles.toString()) {
                    return;
                }
                let url = "/system/hr/?hrid="+user.id;
                let data = "";
                this.selectRoles.forEach(item => {
                    data += "&rids=" + item + "&";
                });
                this.putRequest(url + data).then(resp => {
                    if (resp) {
                        this.initUser();
                    }
                });
            },
            deleteRoleById(user,rid) {
                let data = "?hrid=" + user.id + "&rid=" + rid;
                this.deleteRequest("/system/hr/" + data).then(resp => {
                    if (resp) {
                        //将点击的tag标签给删除
                        for (let i = 0; i < user.roles.length; i++) {
                            if (user.roles[i].id == rid) {
                                user.roles.splice(i, 1);
                            }
                        }
                    }
                });
            },
            searchUser() {
                if (this.keywords) {
                    this.getRequest("/system/hr/?keywords="+this.keywords).then(resp => {
                        if (resp) {
                            this.userData=resp.object
                        }else{
                            this.$message.error("查询用户失败!");
                        }
                    });
                }else{
                    this.$message.error("搜索框不能为空！");
                    return;
                }
            },
            deleteUserById(user) {
                this.$confirm('此操作将永久删除【'+user.name+'】用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/system/hr/" + user.id).then(resp => {
                        if (resp) {
                            for (let i = 0; i < this.userData.length; i++) {
                                if (this.userData[i].id === user.id) {
                                    this.userData.splice(i, 1);
                                }
                            }
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

            }
        }
    }
</script>

<style scoped>
    .searchBox {
        display: flex;
        justify-content: center;
        margin-top: 20px;
    }
    .searchUser {
        width: 25%;
        margin-right: 10px;
    }
    .buttonUser {

    }
    .user{
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }
    .user .box-card {
        margin-left: 20px;
        margin-top: 50px;
        width: 350px;
        height: 450px;
        margin-right: 40px;
    }
    .userface {
        border-radius: 35px;
        height: 60px;
        width: 60px;

    }
    .user-image-info{
        display: flex;
        justify-content: center;
    }
    .user-text-info{
        margin-top: 20px;
        cursor: pointer;
        line-height: 32px;
    }
    .box-card{
        box-shadow: 0 0 25px rgba(0, 0, 0, .2);
        color: #409EFF;
        font-family: "Arial Rounded MT Bold";
    }

</style>