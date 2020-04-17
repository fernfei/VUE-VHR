<template>
    <div v-loading="loading">
        <div>

            <el-input
                    size="small"
                    style="width: 375px"
                    placeholder="添加职位"
                    prefix-icon="el-icon-plus"
                    @keydown.enter.native="addPosition"
                    v-model="pos.name">
            </el-input>
            <el-button size="small" icon="el-icon-plus"  type="primary" @click="addPosition" style="margin-left: 10px;">添加职位</el-button>
            <el-table
                    :data="posData"
                    border
                    stripe
                    style="width: 50%;margin-top: 30px "
                    @selection-change="handleSelectionChange">
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column
                        prop="id"
                        label="编号"
                        width="80">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="职位名称"
                        width="200">
                </el-table-column>
                <el-table-column
                        prop="createdate"
                        label="创建时间">
                </el-table-column>
                <el-table-column
                        label="是否启用">
                    <template v-slot="scope">

                        <el-tag class="enabled" type="success" v-if="scope.row.enabled" @click="changeEnable(scope.row)">已启用</el-tag>
                        <el-tag class="enabled" type="danger" v-else @click="changeEnable(scope.row)">已禁止</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        label="操作">

                    <template v-slot="scope">
                        <el-button
                                size="mini"
                                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button
                                size="mini"
                                type="danger"
                                @click="deletePosition(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <div>
            <el-dialog
                    title="编辑职位名称"
                    :visible.sync="dialogVisible"
                    width="30%"
                    class="dialog">
               <div>
                   <el-tag effect="dark">职位名称</el-tag>
                   <el-input size="small"
                             placeholder="请输入内容"
                             style="width: 40%;margin-left: 10px;"
                             v-model="updateData.name"></el-input>
               </div>


                <div>
                    <el-tag effect="dark">是否启用</el-tag>
                    <el-switch
                            style="margin-left: 10px;"
                            v-model="updateData.enabled"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            :active-text="updateData.text()">
                    </el-switch>
                </div>

                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false" size="small">取 消</el-button>
                    <el-button type="primary" @click="updataPosition" size="small">确 定</el-button>
                </span>
            </el-dialog>
        </div>
        <el-button type="danger"
                   size="small"
                   style="margin-top: 10px"
                   :disabled="this.multipleSelection.length===0"
                    @click="deletePositionsByIds">批量删除</el-button>
    </div>

</template>

<script>

    import {initMenu} from "../../../utils/menus";

    export default {
        name: "PosMana",
        data: function () {

            return{
                pos:{
                    name:""
                },
                posData:[],
                dialogVisible:false,
                updateData:{
                    name:"",
                    enabled:false,
                    text() {
                        if (this.enabled) {
                            return "已启用"
                        }
                        return "已禁止";
                    }
                },
                multipleSelection:[],
                loading: true
            }
        },
        /**
         * Vue的钩子函数和created一样，属于Vue的生命周期
         * 在Vue创建时被调用
         * 具体什么时候被调用请访问官方文档查看https://cn.vuejs.org/v2/guide/instance.html
         */

        mounted() {
            this.initPositions();
        },
        methods:{
            /***
             *  初始化职位信息
             */
            initPositions() {
                this.getRequest("/system/basic/pos/").then(data => {
                    this.loading = false;
                    if (data) {
                        this.posData=data.object
                        this.pos.name = "";
                    }
                });
            },

            /***
             *  添加职位
             */
            addPosition() {
                if (this.pos.name) {
                    this.postRequest("/system/basic/pos/", this.pos).then(resp => {
                        if (resp) {
                            this.initPositions();
                        }
                    });
                }else{
                    this.$message.error("需要添加的职位名不能为空");
                }
            },

            /***
             *  删除职位
             * @param index 当前事件表格的下标/索引
             * @param rowData 当前事件那一行的数据
             */
            deletePosition(index, rowData) {
                this.$confirm('此操作将永久删除【'+rowData.name+'】, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/system/basic/pos/" + rowData.id).then(resp => {
                        if (resp) {
                            this.initPositions();
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

            },
            /***
             * 批量删除
             */
            deletePositionsByIds() {
                this.$confirm('此操作将永久删除【'+this.multipleSelection.length+'条数据】, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let ids = "?";
                    this.multipleSelection.forEach(item => {
                        ids += "ids=" + item.id + "&";
                    });
                    this.deleteRequest("/system/basic/pos/multi/" + ids).then(resp => {
                        if (resp) {
                            this.initPositions();
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });


            },
            /***
             * 修改职位
             */
            updataPosition() {
                this.putRequest("/system/basic/pos/", this.updateData).then(resp => {
                    if (resp) {
                        this.initPositions();
                        //关闭编辑框
                        this.dialogVisible = false;
                    }
                });
            },
            handleEdit(index, rowData) {
                this.dialogVisible = true;
                /***
                 * 必须使用Object.assign 拷贝rowData数据
                 *
                 * 如果使用this.updateData=rowData
                 * 是把引用地址赋给this.updateData,导致在v-model修改数据时，rowData里面的数据也被修改了
                 */
                Object.assign(this.updateData, rowData);


            },
            /***
             * 复选框
             * val是选中行的里面有每行的数据
             * @param val
             */
            handleSelectionChange(val) {
                this.multipleSelection = val;
                console.log(val);
            },
            changeEnable(data) {
                let enabledData = {
                    id: data.id,
                    name: data.name,
                    enabled: !data.enabled
                };
                if (data) {
                    this.putRequest("/system/basic/pos/", enabledData).then(resp => {
                        if (resp) {
                            this.initPositions();
                        }
                    });
                }

            }
        }

    }
</script>

<style scoped>
    .enabled{
        cursor: pointer;
    }
</style>