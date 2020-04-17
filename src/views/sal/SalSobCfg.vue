<template>
    <div>
        <div>
            <el-table
                    :data="SalSobCfgData"
                    border
                    size="mini"
                    style="width: 100%">
                <el-table-column
                        prop="employee.name"
                        label="姓名"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="employee.workid"
                        label="工号">
                </el-table-column>
                <el-table-column
                        prop="employee.email"
                        label="电子邮件">
                </el-table-column>
                <el-table-column
                        prop="employee.phone"
                        label="手机号码">
                </el-table-column>
                <el-table-column
                        prop="department.name"
                        label="所属部门">
                </el-table-column>
                <el-table-column
                        label="工资套账">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" placement="right" v-if="scope.row.salary!=null">
                            <table slot="content">
                                <tr>
                                    <td>基本工资:</td>
                                    <td>￥{{scope.row.salary.basicsalary}}</td>
                                </tr>
                                <tr>
                                    <td>奖金:</td>
                                    <td>￥{{scope.row.salary.bonus}}</td>
                                </tr>
                                <tr>
                                    <td>午餐补助:</td>
                                    <td>￥{{scope.row.salary.lunchsalary}}</td>
                                </tr>
                                <tr>
                                    <td>交通补助:</td>
                                    <td>￥{{scope.row.salary.trafficsalary}}</td>
                                </tr>
                                <tr>
                                    <td>养老金基数:</td>
                                    <td>{{scope.row.salary.pensionbase}}</td>
                                </tr>
                                <tr>
                                    <td>养老金比率:</td>
                                    <td>{{scope.row.salary.pensionper}}</td>
                                </tr>
                                <tr>
                                    <td>公积金基数:</td>
                                    <td>{{scope.row.salary.medicalbase}}</td>
                                </tr>
                                <tr>
                                    <td>公积金比率:</td>
                                    <td>{{scope.row.salary.medicalper}}</td>
                                </tr>
                                <tr>
                                    <td>医疗保险基数:</td>
                                    <td>{{scope.row.salary.accumulationfundbase}}</td>
                                </tr>
                                <tr>
                                    <td>医疗保险比率:</td>
                                    <td>{{scope.row.salary.accumulationfundper}}</td>
                                </tr>
                            </table>
                            <el-tag>{{scope.row.salary.name}}</el-tag>
                        </el-tooltip>
                        <el-tag v-show="scope.row.salary===null">暂未设置</el-tag>

                    </template>

                </el-table-column>
                <el-table-column
                        label="操作">
                    <template slot-scope="scope">
                        <el-popover
                                placement="left"
                                width="200"
                                @show="showPop(scope.row)"
                                @hide="hidenPop(scope.row)"
                                trigger="click">
                            <el-select v-model="currentSalary"
                                       placeholder="请选择"
                                       size="mini">
                                <el-option

                                        v-for="(item,index) in salaries"
                                        :key="index"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                            <el-button
                                    size="mini"
                                    type="danger"
                                    slot="reference"
                                    >修改套账</el-button>
                        </el-popover>

                    </template>
                </el-table-column>
            </el-table>
        </div>
       <div style="display: flex; display: flex; justify-content: space-between;margin-top: 50px">
           <div></div>
           <div>
               <el-pagination
                       background
                       @current-change="currentPage"
                       layout="prev, pager, next"
                       :total="total">
               </el-pagination>
           </div>
       </div>
    </div>
</template>

<script>
    export default {
        name: "SalSobCfg",
        data(){
            return {
                SalSobCfgData: [],
                total: 0,
                page: 1,
                size: 10,
                salaries: [],
                currentSalary: ''
            }
        },
        mounted() {
            this.initSalary();
            this.initSalSobCfg(this.page, this.size);
        },
        methods: {
            initSalary() {
                this.getRequest("/salary/sobcfg/salary").then(resp => {
                    if (resp) {
                        this.salaries = resp.object;
                    } else {
                        this.$message.error("初始化套账信息失败！");
                    }
                });
            },
            initSalSobCfg(page, size) {
                this.getRequest("/salary/sobcfg/?page=" + page + "&size=" + size).then(resp => {
                    if (resp) {
                        this.SalSobCfgData = resp.object.data
                        this.total = resp.object.total;
                    }
                });
            },
            currentPage(page) {
                this.initSalSobCfg(page, this.size);
            },
            showPop(data) {
                if (data.salary) {
                    this.currentSalary = data.salary.id;
                }
            },
            hidenPop(data) {

                if (!data.salary&&this.currentSalary === "") {
                    //salary为空并且currentSalary也为空
                    //说明用户没有发生修改
                    this.currentSalary = "";
                    return;
                }else if (this.currentSalary === data.salary.id) {
                    //如果当前选中的值和数据库中的值一样
                    //同样说明用户没有发生修改
                    this.currentSalary = "";
                    return;
                }
                let url = "/salary/sobcfg/updateSalarySob/?employeeId=" + data.employee.id + "&salaryId=" + this.currentSalary;
                this.putRequest(url).then(resp=>{
                    if (resp) {
                        this.initSalSobCfg(this.page, this.size);
                        this.currentSalary = "";
                    }
                })


            }
        }
    }
</script>

<style scoped>

</style>