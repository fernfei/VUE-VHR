<template>
    <div v-loading="loading">
        <div>
            <el-input
                    size="small"
                    style="width: 375px"
                    placeholder="添加职称"
                    prefix-icon="el-icon-plus"
                    v-model="addJobData.name">
            </el-input>
            <el-select v-model="addJobData.titlelevel"
                       placeholder="职称等级"
                       size="small"
                        style="margin-left: 10px;">
                <el-option
                        v-for="(item,index) in titlelevels"
                        :key="index+''"
                        :label="item"
                        :value="item">
                </el-option>
            </el-select>
            <el-button size="small" icon="el-icon-plus"  type="primary" @click="addJobLevel" style="margin-left: 10px;">添加职位</el-button>
            <el-table
                    :data="jobLevelData"
                    border
                    stripe
                    style="width: 70%;margin-top: 30px "
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
                        label="职称名称"
                        width="230">
                </el-table-column>
                <el-table-column
                        prop="titlelevel"
                        label="职称等级"
                        width="230">
                </el-table-column>
                <el-table-column
                        prop="createdate"
                        label="创建时间">
                </el-table-column>
                <el-table-column
                        label="是否启用">
                    <template v-slot="scope">

                        <el-tag class="enabled" type="success" v-if="scope.row.enabled" @click="changeEnabled(scope.row)">已启用</el-tag>
                        <el-tag class="enabled" type="danger" v-else @click="changeEnabled(scope.row)">已禁止</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        label="操作">
                    <!--插槽语法请访问官方文档查看具体使用https://cn.vuejs.org/v2/guide/components-slots.html-->
                    <template v-slot="scope">
                        <el-button
                                size="mini"
                                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button
                                size="mini"
                                type="danger"
                                @click="deleteJobLevel(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <div>
            <el-dialog
                    title="编辑职位名称"
                    :visible.sync="dialogVisible"
                    width="30%">
                <div>
                    <el-tag effect="dark">职称名称</el-tag>
                    <el-input size="small"
                              placeholder="请输入内容"
                              style="width: 40%;margin-left: 10px;"
                              v-model="updateData.name"></el-input>
                    <el-select v-model="updateData.titlelevel"
                               placeholder="职称等级"
                               size="small"
                               style="margin-left: 10px;">
                        <el-option
                                v-for="(item,index) in titlelevels"
                                :key="index+''"
                                :label="item"
                                :value="item">
                        </el-option>
                    </el-select>
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
                    <el-button type="primary" @click="updateJobLevel" size="small">确 定</el-button>
                </span>
            </el-dialog>
        </div>
        <el-button type="danger"
                   size="small"
                   style="margin-top: 10px"
                   :disabled="multipleSelection.length===0"
                   @click="deleteJobLevelByIds">批量删除</el-button>
    </div>
</template>

<script>
    export default {
        name: "JobLevelMana",
        data(){
            return {
                multipleSelection:[],
                jobLevelData:[],
                updateData:{
                    name:"",
                    titlelevel:"",
                    enabled: false,
                    text() {
                        if (this.enabled) {
                            return "已启用";
                        }
                        return "已禁止";
                    }
                },
                addJobData:{
                    name:"",
                    titlelevel:""
                },
                titlelevels:[],
                dialogVisible:false,
                loading: true
            }
        },
        mounted() {
            this.initJobLevel()
            this.initTitleLevel();
        },
        methods:{
            initJobLevel() {
                this.getRequest("/system/basic/joblevel/").then(resp => {
                    this.loading = false;
                    if (resp) {
                        this.jobLevelData=resp.object
                        this.addJobData.name = "";
                        this.addJobData.titlelevel = "";
                    }else{
                        this.$message.error("加载职称信息失败！");
                    }
                });
            },
            initTitleLevel() {
                this.getRequest("/system/basic/joblevel/titlelevel").then(resp => {
                    if (resp) {
                        this.titlelevels=resp.object
                    }else{
                        this.$message.error("加载职称级别失败！")
                    }
                });
            },
            addJobLevel() {
                if (this.addJobData.name && this.addJobData.titlelevel) {
                    this.postRequest("/system/basic/joblevel/", this.addJobData).then(resp => {
                        if (resp) {
                            this.initJobLevel();
                        }
                    });
                } else {
                    this.$message.error("职称或者职称等级有一项为空！")
                }

            },
            deleteJobLevel(index,rowData) {
                this.$confirm('此操作将永久删除【'+rowData.name+'】, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/system/basic/joblevel/" + rowData.id).then(resp => {
                        if (resp) {
                            this.initJobLevel();
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

            },
            deleteJobLevelByIds() {
                let ids="?"
                this.multipleSelection.forEach(item => {
                    ids += "ids=" + item.id + "&";
                });
                this.deleteRequest("/system/basic/joblevel/multi/" + ids).then(resp => {
                    if (resp) {
                        this.initJobLevel();
                    }
                });
            },
            handleEdit(index, rowData) {
                this.dialogVisible = true;
                Object.assign(this.updateData, rowData);
            },
            updateJobLevel() {
                this.putRequest("/system/basic/joblevel/", this.updateData).then(resp => {
                    if (resp) {
                        this.initJobLevel();
                        this.dialogVisible = false;
                    }
                });
            },
            handleSelectionChange(val) {
              this.multipleSelection=val
            },
            changeEnabled(data) {
                let enableData = {
                    id: data.id,
                    name: data.name,
                    titlelevel: data.titlelevel,
                    enabled: !data.enabled
                };
                if (data) {
                    this.putRequest("/system/basic/joblevel/", enableData).then(resp => {
                        if (resp) {
                            this.initJobLevel();
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