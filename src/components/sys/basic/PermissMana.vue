<template>
    <div v-loading="loading">
        <div class="permissHead">
            <el-input
                    v-model="default_value"
                    :disabled="true"
                    style="width: 80px;"
                    size="small">
            </el-input>
            <el-input class="inputStyle" v-model="role.name" placeholder="请输入角色的英文名" size="small"></el-input>
            <el-input class="inputStyle" v-model="role.namezh" placeholder="请输入角色的中文名" size="small"></el-input>
            <el-button size="small" icon="el-icon-plus"  type="primary" @click="addRole">添加角色</el-button>
        </div>
        <div>
            <el-collapse accordion
                         v-model="activeName"
                         style="width: 35%"
                         @change="change">

                <el-collapse-item :title="role.namezh"
                                  v-for="(role,index) in roles"
                                  :key="index+''"
                                  :name="role.id" >
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>可访问资源</span>
                            <el-button style="float: right; padding: 3px 0"
                                       type="danger"
                                       icon="el-icon-delete"
                                       size="small"
                                        @click="deleteRole(role.id,role.namezh)"></el-button>
                        </div>
                        <el-tree :data="allMenus"
                                 :props="defaultProps"
                                 show-checkbox
                                 node-key="id"
                                 :key="index+''"
                                 :default-checked-keys="selectedMenus"
                                 :default-expanded-keys="selectedMenus"
                                 ref="tree">
                                <!--ref 被用来给元素或子组件注册引用信息。引用信息将会注册在父组件的 $refs 对象上。
                                如果在普通的 DOM 元素上使用，引用指向的就是 DOM 元素；如果用在子组件上，引用就指向组件-->
                                <!--ref给当前元素取一个别名，方便用this.$refs.tree获取这个对象-->
                                <!--this.$refs.tree和document.getElementsById("tree")效果一样都是获取DOM对象-->
                                <!--this.$refs.tree是Vue的写法-->
                                <!--document.getElementsById("tree")原生JS写法-->


                                <!--node-key其值为节点数据中的一个字段名，该字段在整棵树中是唯一的。-->
                                <!--通过default-expanded-keys和default-checked-keys设置默认展开和默认选中的节点。需要注意的是，此时必须设置node-key-->
                        </el-tree>

                        <div class="footer">
                            <el-button size="small" @click="activeName=-1">取消修改</el-button>
                            <el-button type="primary"
                                       size="small"
                                       @click="updatePermiss(role.id,index)">确定修改</el-button>
                        </div>
                    </el-card>



                </el-collapse-item>
            </el-collapse>
        </div>
    </div>
</template>

<script>
    export default {
        name: "PermissMana",
        data() {
            return{
                roles:[],
                default_value:"ROLE_",
                allMenus: [],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                role:{
                    name:"",
                    namzh:""
                },
                selectedMenus: [],
                activeName: -1,
                loading: true
            }
        },
        mounted() {
            this.initRoles();

        },
        methods:{
            initRoles() {
                this.getRequest("/system/basic/permiss/").then(resp => {
                    this.loading = false;
                    if (resp) {
                        this.roles = resp.object;
                    }else{
                        this.$message.error("加载角色信息失败！");
                    }
                });
            },
            initMenus() {
                this.getRequest("/system/basic/permiss/menus/").then(resp => {
                    if (resp) {
                        this.allMenus = resp.object;

                    }else{
                        this.$message.error("加载菜单失败！");
                    }
                });
            },
            addRole() {
                if (this.role.name && this.role.namezh) {
                    this.postRequest("/system/basic/permiss/", this.role).then(resp => {
                        if (resp) {
                            //清空添加空的数据
                            this.role={
                                name: "",
                                namezh: ""
                            }
                            //刷新数据
                            this.initRoles();
                        }
                    });
                } else {
                    this.$message.error("添加框不能为空！");
                }

            },
            change(rid) {

                if (rid) {
                    this.initMenus();
                    this.initSelectedMenus(rid);
                }
            },
            initSelectedMenus(rid) {
                this.getRequest("/system/basic/permiss/getMenuId/" + rid).then(resp => {
                    if (resp) {
                        console.log(resp.object)
                        this.selectedMenus = resp.object;
                    }else{
                        this.$message.error("加载角色资源失败！");
                    }
                });
            },
            updatePermiss(rid,index) {
                /***
                 * this.$refs.tree获取tree元素DOM数组，通过index来区别当前操作的DOM
                 *
                 * getCheckedKeys是element-ui tree组件的方法
                 * @type {Vue | Element | Vue[] | Element[]}
                 */
                let obj=this.$refs.tree;
                let checkedKeys = obj[index].getCheckedKeys(true);
                let url='/system/basic/permiss/?rid='+rid+"&"
                let data=""
                checkedKeys.forEach(item => {
                    data += "mids=" + item + "&";
                });
                this.putRequest(url + data).then(resp => {
                    if (resp) {
                        //更新成功后关闭手风琴
                        this.activeName = -1;
                    }
                });
            },
            deleteRole(rid,namezh) {
                this.$confirm('此操作将永久删除【'+namezh+'】, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/system/basic/permiss/" + rid).then(resp => {
                        if (resp) {
                            this.initRoles();
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
.permissHead{

    display: flex;
}
    .permissHead .inputStyle {
        width: 200px;
        margin-right: 10px;
    }
    .footer {
        margin-left: 370px;
    }
</style>