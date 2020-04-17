<template>
    <div>
        <div class="tree" v-loading="loading">
            <el-input
                    prefix-icon="el-icon-search"
                    size="small"
                    placeholder="请输入部门名称进行搜索..."
                    v-model="filterText">
            </el-input>

            <el-tree
                    :data="deps"
                    :props="defaultProps"
                    :filter-node-method="filterNode"
                    :expand-on-click-node="false"
                    ref="tree"
                    style="margin-top: 10px;">
                    <span class="custom-tree-node" slot-scope="{ node, data }">
                        <span>{{ node.label }}</span>

                        <span>
                          <el-button
                                  type="primary"
                                  style="padding: 3px 0;"
                                  @click="showAppendDepartment(data)">
                            添加部门
                          </el-button>
                          <el-button
                                  type="danger"
                                  style="padding: 3px 0"
                                  @click="removeDepartment(node, data)">
                            删除部门
                          </el-button>
                         </span>
                    </span>

            </el-tree>

        </div>
        <div>


            <!-- Form -->

            <el-dialog title="添加部门" :visible.sync="dialogFormVisible">
                <el-form :model="form">

                    <el-form-item label="上级部门" >
                        <el-select v-model="form.name" disabled  placeholder="请选择上级部门" size="small">
                            <el-option :value="form.name"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="部门名称">
                        <el-input v-model="form.depName"
                                  autocomplete="off"
                                  size="small" style="width: 23.5%;"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false" size="small">取 消</el-button>
                    <el-button type="primary" @click="appendDepartment()" size="small">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    export default {
        name: "DepMana",
        data() {
            return {
                filterText: '',
                deps: [],
                defaultProps:{
                    children: "children",
                    label: "name"
                },
                dialogFormVisible : false,
                form:{
                    name: "",
                    depName: "",
                    id: 0
                },
                loading: true
            }

        },
        watch: {
            /***
             * 监听filterText的值变化，val是变化后的值
             * @param val
             */
            filterText(val) {
                //获取DOM对象
                //filter	对树节点进行筛选操作	接收一个任意类型的参数，该参数会在 filter-node-method 中作为第一个参数
                this.$refs.tree.filter(val);
            }
        },

        methods: {
            //filter-node-method对树节点进行筛选时执行的方法，返回 true 表示这个节点可以显示，返回 false 则表示这个节点会被隐藏
            // Function(value, data, node)
            filterNode(value, data) {
                //如果等于空那么就可以显示
                if (!value) return true;
                //如果搜索的数据value能在data中找到那么可以显示
                return data.name.indexOf(value) !== -1;
            },
            initDepartment() {

                this.getRequest("/system/basic/department/").then(resp => {
                    this.loading = false;
                    if (resp) {
                        this.deps = resp.object;
                    }
                });
            },
            showAppendDepartment(data) {
                this.dialogFormVisible = true;
                Object.assign(this.form, data);
            },
            /***
             * 删除部门
             * @param node 当前节点数据及子节点数据
             * @param data
             */
            removeDepartment(node,data) {
                this.$confirm('此操作将永久删除【'+data.name+'】部门, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/system/basic/department/" + data.id).then(resp => {
                        if (resp) {
                            this.removeRefresh(this.deps, data);
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
                console.log(node);
                console.log(data);
            },
            appendDepartment() {
                this.dialogFormVisible = false;
                let obj = {
                    name: "",
                    parentid: 0
                } ;
                obj.name = this.form.depName;
                obj.parentid = this.form.id;
                this.postRequest("/system/basic/department/", obj).then(resp => {
                    if (resp) {
                        this.addRefresh(this.deps,resp);
                    }
                });
                this.form.depName = '';

            },
            /***
             * 刷新添加成功的节点
             * @param deps tree的数据
             * @param successData 添加节点的数据
             */
            addRefresh(deps,successData) {
                for (let i = 0; i < deps.length; i++) {
                    if (deps[i].id == successData.object.parentid) {
                        deps[i].children.push(successData.object)
                        return ;
                    }else{
                        //递归去子节点查找
                        this.addRefresh(deps[i].children, successData);
                    }
                }
            },
            /***
             * 刷新删除成功的节点
             * @param deps tree的数据
             * @param data 删除的节点数据
             */
            removeRefresh(deps,data) {
                for (let i = 0; i < deps.length; i++) {
                    //找出父级节点对象
                    if (deps[i].id == data.parentid) {
                        //遍历父节点的children找出我们要删除的节点索引
                        for (let j = 0; j <deps[i].children.length; j++) {
                            if (deps[i].children[j].id == data.id) {
                                deps[i].children.splice(j, 1);
                            }
                        }
                        return;
                    }else{
                        //递归去子节点查找
                        this.removeRefresh(deps[i].children, data);
                    }
                }
            }
        },
        /***
         * 钩子函数
         */
        mounted() {
            this.initDepartment();
        }

    }
</script>

<style scoped>
.tree {
    width: 475px;

}
.custom-tree-node {
    flex: 1;
    display: flex;
    /*align-items属性定义项目在交叉轴上如何对齐。*/
    align-items: center;
    /*justify-content属性定义了项目在主轴上的对齐方式。*/
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;

}
</style>