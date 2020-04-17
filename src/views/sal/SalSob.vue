<template>
    <div>
        <div class="sal-head">
            <div>
                <el-button type="primary" @click="showAddView"  icon="el-icon-plus" size="small">添加套账</el-button>
            </div>
            <div>
                <el-button type="success" icon="el-icon-refresh" size="small"></el-button>
            </div>
        </div>
        <div style="margin-top: 10px">
            <el-table
                    :data="sobData"
                    size="small"
                    style="width: 100%">
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="套账名称"
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="basicsalary"
                        label="基本工资"
                        width="100">


                </el-table-column>
                <el-table-column
                        prop="trafficsalary"
                        label="交通补助"
                        width="100">

                </el-table-column>
                <el-table-column
                        prop="lunchsalary"
                        label="午餐补助"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="bonus"
                        label="奖金"
                        width="100">

                </el-table-column>
                <el-table-column
                        prop="createdate"
                        label="启用日期"
                        width="150">

                </el-table-column>
                <el-table-column
                        style="text-align: center"
                        prop="pension"
                        label="养老金"
                        width="100">

                    <el-table-column
                            prop="pensionper"
                            label="比率"
                            width="100">

                    </el-table-column>
                    <el-table-column
                            prop="pensionbase"
                            label="基数"
                            width="100">

                    </el-table-column>
                </el-table-column>
                <el-table-column
                        prop="medical"
                        label="医疗保险"
                        width="100">

                    <el-table-column
                            prop="medicalper"
                            label="比率"
                            width="100">

                    </el-table-column>
                    <el-table-column
                            prop="medicalbase"
                            label="基数"
                            width="100">

                    </el-table-column>
                </el-table-column>

                <el-table-column
                        prop="accumulation"
                        label="公积金"
                        width="100">

                    <el-table-column
                            prop="accumulationfundper"
                            label="比率"
                            width="100">

                    </el-table-column>
                    <el-table-column
                            prop="accumulationfundbase"
                            label="基数"
                            width="100">

                    </el-table-column>
                </el-table-column>
                <el-table-column
                        label="操作"
                        width="200">
                    <template slot-scope="scope">
                        <el-button
                                size="mini"
                                @click="showEditView(scope.$index, scope.row)">编辑</el-button>
                        <el-button
                                size="mini"
                                type="danger"
                                @click="deleteSalary(scope.$index, scope.row)">删除</el-button>
                    </template>

                </el-table-column>

            </el-table>
        </div>
        <div>


            <el-dialog :title="operation" :visible.sync="dialogVisible" >

                <div style="display: flex;justify-content: space-between;align-items: center;">
                    <el-steps direction="vertical" :active="active" >
                        <el-step :title="item"
                                 v-for="(item,index) in salaryItemsName"
                                 :key="index">

                        </el-step>

                    </el-steps>
                    <div>
                        <el-input :placeholder="'请输入'+salaryItemsName[active]"
                                  v-for="(value,item,index) in salary"
                                  :key="index"
                                  v-if="index==active"
                                  size="small"
                                  v-show="active<=10"
                                  v-model="salary[item]"
                                  style="width: 300px">

                        </el-input>

                        <div class="block" v-show="active==11">
                            <el-date-picker
                                    v-model="salary.createdate"
                                    type="date"
                                    style="width: 300px"
                                    size="small"
                                    placeholder="选择日期">
                            </el-date-picker>
                        </div>
                    </div>
                    <div>

                    </div>
                </div>

                <div slot="footer" class="dialog-footer">
                    <el-button @click="prev" size="small">{{active==0?'取消':'上一步'}}</el-button>
                    <el-button type="primary" plain  @click="next" size="small" >{{active==12?'完成':'下一步'}}</el-button>
                </div>
            </el-dialog>


        </div>
    </div>
</template>

<script>
    export default {
        name: "SalSob",
        data(){
            return {
                sobData: [],
                dialogVisible: false ,
                active: 0,
                salaryItemsName: [
                    '套账名称',
                    '基本工资',
                    '交通补助',
                    '午餐补助',
                    '奖金',
                    '养老金比率',
                    '养老金基数',
                    '医疗保险比率',
                    '医疗保险基数',
                    '公积金比率',
                    '公积金基数',
                    '启用时间',
                ],
                salary: {
                    name: '',
                    basicsalary: '',
                    trafficsalary: '',
                    lunchsalary: '',
                    bonus: '',
                    pensionper: '',
                    pensionbase: '',
                    medicalper: '',
                    medicalbase: '',
                    accumulationfundper: '',
                    accumulationfundbase: '',
                    createdate: ''

                },
                operation: ""
            };
        },
        mounted() {
            this.initSalarySob();
        },
        methods:{
            initSalarySob() {
                this.getRequest("/salary/sob/").then(resp => {
                    if (resp) {
                         this.sobData = resp.object;
                    }else{
                        this.$message.error("初始化工资套账信息失败！");
                    }
                });
            },
            showEditView(index, data) {
                this.dialogVisible = true;
                Object.assign(this.salary, data);
                this.operation = "编辑";

            },
            showAddView() {
                this.operation = "添加";
                this.dialogVisible = true;
            },
            next() {
                if (this.active === 12) {
                    if (this.operation === "编辑") {
                        this.putRequest("/salary/sob/", this.salary).then(resp => {
                            if (resp) {
                                this.initSalarySob();
                            }
                        });
                    }else if (this.operation === "添加") {
                        console.log(this.salary);
                        //检查对象的每个属性是否都为空字符串
                        let result = Object.values(this.salary).every(item => item === "");
                        if (result) {
                            this.$message.error("字段不能为空！");
                            return;
                        }
                        if (!this.salary.createdate) {
                            this.salary.createdate = new Date();
                        }
                        this.salary.createdate=this.moment(this.salary.createdate).format('YYYY-MM-DD HH:mm:ss');
                        this.postRequest("/salary/sob/", this.salary).then(resp => {
                            if (resp) {
                                this.initSalarySob();
                            }
                        });
                    }
                    this.dialogVisible = false;
                    this.active = 0;
                    this.salary = {
                        name: '',
                        basicsalary: '',
                        trafficsalary: '',
                        lunchsalary: '',
                        bonus: '',
                        pensionper: '',
                        pensionbase: '',
                        medicalper: '',
                        medicalbase: '',
                        accumulationfundper: '',
                        accumulationfundbase: '',
                        createdate: ''

                    };
                }else{
                    if (this.active++ > 11) this.active = 0;
                }
            },
            prev(){
                if (this.active === 0) {
                    this.dialogVisible = false;
                }else{
                    if (this.active-- < 0) this.active = 0;
                }
            },
            deleteSalary(index, data) {
                this.$confirm('此操作将永久删除【'+data.name+'】, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/salary/sob/" + data.id).then(resp => {
                        if (resp) {
                            this.initSalarySob();
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
.sal-head {
    margin-top: 20px;

    display: flex;
    justify-content: space-between;

}
</style>