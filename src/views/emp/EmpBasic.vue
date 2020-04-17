<template>
    <div v-loading="loading" style="font-family: Arial;">

        <div class="header">
            <div style="width: 600px">
                <el-input prefix-icon="el-icon-search"
                          size="small"
                          v-model="keywords"
                          clearable
                          :disabled="keywordSearchDisabled"
                          @keydown.enter.native="searchEmp"
                          style="width: 50%;margin-right: 10px"
                          placeholder="通过员工名搜索员工，回车键搜索..."></el-input>
                <el-button icon="el-icon-search"
                           type="primary"
                           size="small"
                           :disabled="keywordSearchDisabled"
                           @click="searchEmp">搜索</el-button>
                <el-button type="primary"
                           @click="showSearchView"
                           size="small">
                    <i class="fa fa-angle-double-down" aria-hidden="true"></i>
                    高级搜索</el-button>
            </div>
            <div>
                <el-upload
                        :on-error="onError"
                        :on-success="onSuccess"
                        :before-upload="beforeUpload"
                        :show-file-list="false"
                        :disabled="isImportDisabled"
                        style="display: inline-flex;margin-right: 10px"
                        action="/emp/basic/import"
                        >
                    <el-button size="small"
                               type="success"
                               :disabled="isImportDisabled"
                               :icon="importButtonIcon">
                        {{importButtonText}}
                    </el-button>
                </el-upload>

                <el-button size="small"
                           icon="el-icon-download"
                           @click="exportData"
                           type="success">

                    导出数据</el-button>
                <el-button size="small" type="primary" icon="el-icon-plus" @click="showAddEmp">
                    添加员工</el-button>
            </div>
        </div>
        <el-collapse-transition>
            <div v-show="showRangeSearch" class="showRangeSearch">
                <el-row style="margin-bottom: 20px">
                    <el-col :span="6" >
                        <el-tag type="" effect="dark">
                            政治面貌
                        </el-tag>
                        <el-select v-model="rangeSearch.politicId"
                                   @visible-change="getAllPoliticsStatus"
                                   size="small"
                                   placeholder="请选择政治面貌">
                            <el-option
                                    v-for="politicsStatus in allPoliticsStatus"
                                    :key="politicsStatus.id"
                                    :label="politicsStatus.name"
                                    :value="politicsStatus.id">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="6">
                        <el-tag type="" effect="dark">
                            民族
                        </el-tag>
                        <el-select v-model="rangeSearch.nationId"
                                   @visible-change="getAllNations"
                                   size="small"
                                   placeholder="请选择民族">
                            <el-option
                                    v-for="nation in allNations"
                                    :key="nation.id"
                                    :label="nation.name"
                                    :value="nation.id">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="6">
                        <el-tag type="" effect="dark">
                            职位
                        </el-tag>
                        <el-select v-model="rangeSearch.posId"
                                   @visible-change="getAllPositions"
                                   size="small"
                                   placeholder="请选择职位">
                            <el-option
                                    v-for="position in allPositions"
                                    :key="position.id"
                                    :label="position.name"
                                    :value="position.id">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="6">
                        <el-tag type="" effect="dark">
                            职称
                        </el-tag>
                        <el-select v-model="rangeSearch.jobLevelId"
                                   @visible-change="getAllJobLevels"
                                   size="small"
                                   placeholder="请选择职称">
                            <el-option
                                    v-for="jobLevel in allJobLevels"
                                    :key="jobLevel.id"
                                    :label="jobLevel.name"
                                    :value="jobLevel.id">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-row>
                <el-row >
                    <el-col :span="6" style="display: flex;">
                        <el-tag type="" effect="dark">
                            所属部门
                        </el-tag>
                        <el-popover
                                placement="right"
                                title="请选择部门"
                                width="200"
                                trigger="click">
                            <el-tree :data="allDepartment"
                                     default-expand-all
                                     node-key="id"
                                     :expand-on-click-node="false"
                                     @node-click="selectedDepartment"
                                     :props="defaultProps" ></el-tree>
                            <div v-if="rangeSearch.departmentName===''"
                                 slot="reference"
                                 ref="department"
                                 class="emp-length"
                                 @click="initDepartment"
                                 v-model="rangeSearch.departmentName"
                                 style="width: 203px;line-height: 32px; display: inline-block; height: 32px; border: 1px solid rgb(220,232,230);color:#C0C4CC; border-radius: 5px; padding-left: 10px">
                                所属部门
                            </div>
                            <div class="emp-length"
                                 slot="reference"
                                 v-else
                                 style="width: 203px;line-height: 32px;display: inline-block; height: 32px; border: 1px solid rgb(220,232,230); border-radius: 5px; padding-left: 10px"
                                 ref="department"
                                 @click="initDepartment"
                                 v-model="rangeSearch.departmentName">{{rangeSearch.departmentName}}</div>
                        </el-popover>

                    </el-col>
                    <el-col :span="6">
                        <el-tag type="" effect="dark">
                            入职日期
                        </el-tag>
                        <el-date-picker
                                v-model="rangeSearch.dateArray"
                                style="width: 330px;"
                                size="small"
                                type="datetimerange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                align="right">
                        </el-date-picker>
                    </el-col>
                    <el-col :span="6">
                        <el-tag type="" effect="dark" style="margin-right: 10px;">
                            聘用方式
                        </el-tag>
                        <el-radio v-model="rangeSearch.engageForm" label="劳动合同">劳动合同</el-radio>
                        <el-radio v-model="rangeSearch.engageForm" label="劳务合同">劳务合同</el-radio>
                    </el-col>
                    <el-col :span="6">
                        <el-button size="small"
                                   @click="showSearchView">
                            取消
                        </el-button>
                        <el-button type="primary"
                                   size="small"
                                   @click="advancedSearch"
                                   icon="el-icon-search">搜索</el-button>
                    </el-col>
                </el-row>
            </div>

        </el-collapse-transition>

        <div class="table">
            <el-table
                    size="mini"
                    :data="employeeData"
                    border
                    @selection-change="handleSelectionChange"
                    style="width: 100%">
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column
                        fixed
                        prop="name"
                        label="员工名"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="gender"
                        label="性别"
                        width="50">
                </el-table-column>
                <el-table-column
                        prop="birthday"
                        label="生日"
                        width="200">
                </el-table-column>
                <el-table-column
                        prop="wedlock"
                        label="婚姻状况"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="nation.name"
                        label="民族"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="nativeplace"
                        label="籍贯"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="politicsstatus.name"
                        label="政治面貌"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="email"
                        label="邮箱"
                        width="200">
                </el-table-column>
                <el-table-column
                        prop="phone"
                        label="手机号码"
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="address"
                        label="居住地址"
                        width="200">
                </el-table-column>

                <el-table-column
                        prop="department.name"
                        label="部门"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="jobLevel.name"
                        label="职称"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="position.name"
                        label="职位"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="engageform"
                        label="聘用形式"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="tiptopdegree"
                        label="最高学历"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="specialty"
                        label="专业"
                        width="200">
                </el-table-column>
                <el-table-column
                        prop="school"
                        label="毕业院校"
                        width="200">
                </el-table-column>
                <el-table-column
                        prop="begindate"
                        label="入职时间"
                        width="250">
                </el-table-column>
                <el-table-column
                        prop="workstate"
                        label="工作状态"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="workid"
                        label="工号"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="contractterm"
                        label="合同期限"
                        width="120">
                    <template v-slot="scope">
                        <el-tag>{{scope.row.contractterm}}年</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="conversiontime"
                        label="转正日期"
                        width="250">
                </el-table-column>
                <el-table-column
                        prop="notworkdate"
                        label="离职日期"
                        width="250">
                </el-table-column>
                <el-table-column
                        prop="begincontract"
                        label="合同起始时间"
                        width="250">
                </el-table-column>
                <el-table-column
                        prop="endcontract"
                        label="合同结束时间"
                        width="250">
                </el-table-column>
                <el-table-column
                        prop="workage"
                        label="工作年限"
                        width="120">
                </el-table-column>
                <el-table-column
                        fixed="right"
                        label="操作"
                        width="170">
                    <template slot-scope="scope">
                        <el-button style="padding: 3px 0;" @click="showEditEmp(scope.row)" type="warning" size="small">编辑</el-button>
                        <el-button style="padding: 3px 0;" type="primary" size="small">查看高级资料</el-button>
                        <el-button style="padding: 3px 0;" type="danger" size="small" @click="deleteEmp(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="total-page">
                <div>
                    <el-button type="danger" @click="deleteEmpByIds" :disabled="multipleSelection.length===0">批量删除</el-button>
                </div>
                <el-pagination
                        background
                        layout="prev, pager, next"
                        @current-change="currentChange"
                        :total="total">
                </el-pagination>
            </div>
        </div>
        <div>
            <!-- Form -->

            <el-dialog :title="OperationType+'用户信息'" :visible.sync="dialogFormVisible" width="80%" >

                <el-form :model="empForm" ref="empForm"  :rules="rules" label-width="120px" size="small" inline>
                    <el-form-item label="用户名" prop="name">
                        <el-input class="emp-length" v-model.trim="empForm.name" placeholder="请输入用户名" ></el-input>
                    </el-form-item>
                    <el-form-item label="性别" prop="gender" style="width: 334px">
                        <el-radio-group v-model="empForm.gender">
                            <el-radio  label="男">男</el-radio>
                            <el-radio  label="女">女</el-radio>
                        </el-radio-group>

                    </el-form-item>
                    <el-form-item label="出生日期" prop="birthday">
                        <div class="block">
                            <el-date-picker
                                    v-model="empForm.birthday"
                                    type="date"
                                    class="emp-length"
                                    placeholder="选择日期">
                            </el-date-picker>
                        </div>
                    </el-form-item>

                    <el-form-item label="政治面貌" prop="politicid" >
                        <el-select v-model="empForm.politicid"
                                   @visible-change="getAllPoliticsStatus"
                                   placeholder="政治面貌">
                            <el-option
                                       v-for="(politicsStatus,index) in allPoliticsStatus"
                                       :key="index"
                                       :label="politicsStatus.name"
                                       :value="politicsStatus.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="民族"
                                  prop="nationid" >
                        <el-select v-model="empForm.nationid"
                                   class="emp-length"
                                   @visible-change="getAllNations"
                                   placeholder="请选择民族">
                            <el-option
                                       v-for="(nation,index) in allNations"
                                       :key="index"
                                       :label="nation.name"
                                       :value="nation.id">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="籍贯" prop="nativeplace">
                        <el-input class="emp-length" v-model="empForm.nativeplace" placeholder="员工籍贯" ></el-input>
                    </el-form-item>

                    <el-form-item label="电子邮箱" prop="email">
                        <el-input class="emp-length" v-model="empForm.email" placeholder="电子邮件地址" ></el-input>
                    </el-form-item>

                    <el-form-item label="联系地址" prop="address">
                        <el-input class="emp-length" v-model="empForm.address" placeholder="联系地址" ></el-input>
                    </el-form-item>

                    <el-form-item label="职位" prop="posid" >
                        <el-select v-model="empForm.posid"
                                   class="emp-length"
                                   @visible-change="getAllPositions"
                                   placeholder="请选择职位">
                            <el-option
                                       v-for="(position,index) in allPositions"
                                       :key="index"
                                       :label="position.name"
                                       :value="position.id">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="职称" prop="joblevelid" >
                        <el-select v-model="empForm.joblevelid"
                                   class="emp-length"
                                   @visible-change="getAllJobLevels"
                                   placeholder="请选择职称">
                            <el-option
                                       v-for="(jobLevel,index) in allJobLevels"
                                       :key="index"
                                       :label="jobLevel.name"
                                       :value="jobLevel.id">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="所属部门"  prop="departmentid">
                        <el-popover
                                placement="right"
                                title="请选择部门"
                                width="200"
                                trigger="click">
                            <el-tree :data="allDepartment"
                                     default-expand-all
                                     node-key="id"
                                     :expand-on-click-node="false"
                                     @node-click="selectedDepartment"
                                     :props="defaultProps" ></el-tree>
                            <div v-if="empForm.departmentName===''"
                                 slot="reference"
                                 ref="department"
                                 class="emp-length"
                                 @click="initDepartment"
                                 v-model="empForm.departmentName"
                                 style="width: 203px; height: 32px; border: 1px solid rgb(220,232,230);color:#C0C4CC; border-radius: 5px; padding-left: 10px">
                                所属部门
                            </div>
                            <div class="emp-length"
                                      slot="reference"
                                      v-else
                                      style="width: 203px; height: 32px; border: 1px solid rgb(220,232,230); border-radius: 5px; padding-left: 10px"
                                      ref="department"
                                      @click="initDepartment"
                                      v-model="empForm.departmentName">{{empForm.departmentName}}</div>
                        </el-popover>

                    </el-form-item>

                    <el-form-item label="手机号码" prop="phone">
                        <el-input class="emp-length" v-model="empForm.phone" placeholder="手机号码"></el-input>
                    </el-form-item>

                    <el-form-item label="工号" prop="workId">
                        <el-input class="emp-length" disabled v-model="empForm.workid"></el-input>
                    </el-form-item>

                    <el-form-item label="学历" prop="tiptopdegree" >
                        <el-select v-model="empForm.tiptopdegree"
                                   class="emp-length"
                                   placeholder="最高学历">
                            <el-option :label="tiptopDegree"
                                       :value="tiptopDegree"
                                       v-for="(tiptopDegree,index) in tiptopDegrees"
                                       :key="index">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="毕业院校" prop="school">
                        <el-input class="emp-length" v-model="empForm.school" placeholder="毕业院校"></el-input>
                    </el-form-item>

                    <el-form-item label="专业名称" prop="specialty">
                        <el-input class="emp-length" v-model="empForm.specialty" placeholder="专业名称"></el-input>
                    </el-form-item>

                    <el-form-item label="入职日期" prop="begindate">
                        <div class="block">
                            <el-date-picker
                                    v-model="empForm.begindate"
                                    type="date"
                                    class="emp-length"
                                    placeholder="选择日期">
                            </el-date-picker>
                        </div>
                    </el-form-item>

                    <el-form-item label="转正日期" prop="conversiontime">
                        <div class="block">
                            <el-date-picker
                                    v-model="empForm.conversiontime"
                                    type="date"
                                    class="emp-length"
                                    placeholder="选择日期">
                            </el-date-picker>
                        </div>
                    </el-form-item>


                    <el-form-item label="合同起始时间" prop="begincontract">
                        <div class="block">
                            <el-date-picker
                                    v-model="empForm.begincontract"
                                    type="date"
                                    class="emp-length"
                                    placeholder="选择日期">
                            </el-date-picker>
                        </div>
                    </el-form-item>


                    <el-form-item label="合同终止时间" prop="endcontract">
                        <div class="block">
                            <el-date-picker
                                    v-model="empForm.endcontract"
                                    type="date"
                                    class="emp-length"
                                    placeholder="选择日期">
                            </el-date-picker>
                        </div>
                    </el-form-item>

                    <el-form-item label="身份证号码" prop="idcard">
                        <el-input class="emp-length" v-model.trim="empForm.idcard" placeholder="身份证号码" ></el-input>
                    </el-form-item>

                    <el-form-item label="聘用形式" prop="engageform" style="width: 314px">
                        <el-radio-group v-model="empForm.engageform">
                            <el-radio  label="劳动合同">劳动合同</el-radio>
                            <el-radio  label="劳务合同">劳务合同</el-radio>
                        </el-radio-group>

                    </el-form-item>


                    <el-form-item label="婚姻状况" prop="wedlock" style="width: 354px">
                        <el-radio-group v-model="empForm.wedlock">
                            <el-radio  label="已婚">已婚</el-radio>
                            <el-radio  label="未婚">未婚</el-radio>
                            <el-radio  label="离异">离异</el-radio>
                        </el-radio-group>

                    </el-form-item>

                </el-form>

                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false" size="small">取 消</el-button>
                    <el-button type="primary" @click="addEmp" size="small">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>

    /***
     * int totalPageNum = (totalRecord  +  pageSize  - 1) / pageSize;
     * 计算总也页数的算法
     *
     * element-ui已经自动帮我们计算了，只需要给出总记录数即可
     */
    export default {

        name: "EmpBasic",
        data() {
            // 手机号验证
            const checkPhone = (rule, value, callback) => {
                const phoneReg = /^1[3|4|5|6|7|8][0-9]{9}$/
                if (!value) {
                    return callback(new Error('电话号码不能为空'))
                }
                setTimeout(() => {

                    if (!Number.isInteger(+value)) {
                        callback(new Error('请输入数字值'))
                    } else {
                        if (phoneReg.test(value)) {
                            callback()
                        } else {
                            callback(new Error('电话号码格式不正确'))
                        }
                    }
                }, 100)
            };
            return{
                /**
                 * 范围查找所用的数据
                 */
                keywordSearchDisabled: false,
                showRangeSearch: false,
                rangeSearch:{
                    politicId: "",
                    nationId: "",
                    posId: "",
                    jobLevelId: "",
                    dateArray: "",
                    departmentId: "",
                    engageForm: "",
                    departmentName: "",
                    type: ""
                },
                importButtonText: "导入数据",
                importButtonIcon: "el-icon-upload2",
                isImportDisabled: false,
                allDepartment: [],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                employeeData: [],
                total: 0,
                multipleSelection: [],
                page: 1,
                size: 10,
                loading: true,
                dialogFormVisible: false,
                keywords:"",
                OperationType: "",
                tiptopDegrees: ['博士', '硕士', '本科', '大专', '高中', '初中', '小学', '其他'],
                allNations: [],
                allPositions: [],
                allJobLevels: [],
                allPoliticsStatus: [],
                engageform: "",
                wedlock: "",
                empForm: {
                    name: "",
                    gender: "",
                    birthday: new Date(),
                    idcard: "",
                    wedlock: "",
                    nationid: "",
                    nativeplace: "",
                    politicid: "",
                    email: "",
                    phone: "",
                    address: "",
                    departmentid: "",
                    departmentName: "",
                    joblevelid: "",
                    posid: "",
                    engageform: "",
                    tiptopdegree: "",
                    specialty: "",
                    school: "",
                    begindate: new Date(),
                    workstate: "",
                    workid: "",
                    contractterm:"",
                    conversiontime: new Date(),
                    notworkdate: "",
                    begincontract: new Date(),
                    endcontrct: new Date(),
                    workage: ""
                },
                rules: {
                    name: [
                        {required: true, message: '必须填写员工名', trigger: 'blur'}, {
                            min: 2,
                            max: 4,
                            message: '姓名在2~4字符之间',
                            trigger: 'blur'
                        }
                    ],
                    gender:[
                        { required: true, message: '必须选择性别', trigger: 'change'},
                    ],
                    birthday: [
                        {required: true, message: '必须选择出生日期', trigger: 'change'}
                    ],
                    politicid:[
                        {required: true, message: '必须选择政治面貌', trigger: 'change'}
                    ],
                    nationid:[
                        {required: true, message: '必须选择民族', trigger: 'change'}
                    ],
                    nativeplace:[
                        { required: true, message: '必须填写籍贯', trigger: 'blur'},
                    ],
                    email: [
                        {required: true, message: '必须填写邮箱', trigger: 'blur'}, {
                            type: "email",
                            message: '电子邮箱格式错误',
                            trigger: 'blur'
                        }
                    ],
                    address:[
                        { required: true, message: '必须填写现居住地址', trigger: 'blur'}
                    ],
                    posid: [
                        {required: true, message: '必须选择职位', trigger: 'change'}
                    ],
                    joblevelid: [
                        {required: true, message: '必须选择职称', trigger: 'change'}
                    ],
                    departmentid: [
                        {required: true, message: '必须选择所属部门', trigger: 'change'}
                    ],
                    phone: [
                        {required: true, validator: checkPhone, trigger: 'blur' }

                    ],
                    tiptopdegree:[
                        { required: true, message: '必须选择学历', trigger: 'change'},
                    ],
                    school:[
                        { required: true, message: "必须填写毕业院校", trigger: 'blur'},
                    ],
                    specialty:[
                        { required: true, message: "必须填写专业", trigger: 'blur'},
                    ],
                    begindate: [
                        {required: true, message: '必须选择入职日期', trigger: 'change'}
                    ],
                    conversiontime: [
                        {required: true, message: '必须选择转正日期', trigger: 'change'}
                    ],
                    begincontract: [
                        {required: true, message: '必须选择合同起始日期', trigger: 'change'}
                    ],
                    endcontract: [
                        {required: true, message: '必须选择合同终止日期', trigger: 'change'}
                    ],
                    idcard: [
                        {
                            required: true,
                            message: '必须填写身份证号码',
                            trigger: 'blur'
                        }, {
                            pattern: /(^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/,
                            message: "请输入正确格式的身份证号码",
                            trigger: "blur"
                        }
                    ],
                    engageform:[
                        { required: true, message: '必须选择聘用方式', trigger: 'change'},
                    ],
                    wedlock:[
                        { required: true, message: '必须选择婚姻状况', trigger: 'change'},
                    ]

                }

            }
        },
        watch:{
            //监听输入框是否清空
            keywords(value) {

                if (value === "") {
                    this.initEmployee();
                }
            }
        },
        mounted() {
            this.initEmployee();
        },
        methods: {

            deleteEmpByIds() {
                let data = "?";
                for (let i = 0; i <this.multipleSelection.length ; i++) {
                    data += "&ids=" + this.multipleSelection[i].id + "&";
                }
                this.deleteRequest("/emp/basic/many" + data).then(resp => {
                    if (resp) {
                        this.initEmployee();
                    }
                });
            },

            /***
             * 高级搜索
             */
            advancedSearch() {
                let beginDate = "";
                let endDate = "";
                //如果没有勾选时间，那么就别转换日期了防止在转换时出现错误
                if (this.rangeSearch.dateArray != "") {
                     beginDate = this.moment(this.rangeSearch.dateArray[0]).format('YYYY-MM-DD HH:mm:ss');
                     endDate = this.moment(this.rangeSearch.dateArray[1]).format('YYYY-MM-DD HH:mm:ss');
               }
                let data = "?politicid=" + this.rangeSearch.politicId +
                            "&nationid=" + this.rangeSearch.nationId +
                            "&posid=" + this.rangeSearch.posId +
                            "&joblevelid=" + this.rangeSearch.jobLevelId +
                            "&departmentid=" + this.rangeSearch.departmentId +
                            "&engageform=" + this.rangeSearch.engageForm +
                            "&beginDate=" + beginDate + "&endDate=" + endDate +
                            "&page=" + this.page + "&siz=" + this.size;
                this.getRequest("/emp/basic/advancedSearch/" + data).then(resp => {
                    if (resp) {
                        //防止高级查询时切换条件后查询出数据少于先前条件，而显示为空
                        if ((resp.object.data === null || resp.object.data.length === 0 )&& resp.object.total != 0) {

                            this.page = 1;
                            this.size = 10;
                            this.advancedSearch();
                            return;
                        } else {
                            this.employeeData = resp.object.data;
                            this.total = resp.object.total;
                            this.rangeSearch.type = "advanced";
                            return;
                        }


                    }else{
                        this.$message.error("查询失败！");
                    }
                });
            },
            showSearchView() {
                this.showRangeSearch = !this.showRangeSearch;
                this.keywordSearchDisabled = !this.keywordSearchDisabled;
                //收起高级查询时清空内容
                this.rangeSearch = {
                    politicId: "",
                    nationId: "",
                    posId: "",
                    jobLevelId: "",
                    dateArray: "",
                    departmentId: "",
                    engageForm: "",
                    departmentName: "",
                    type: ""
                };
                this.initEmployee();
            },
            beforeUpload(file) {
                this.isDisabled = true;
                this.importButtonText = "正在上传";
                this.importButtonIcon = "el-icon-loading";
            },
            onError(err, file, fileList) {
                this.isDisabled = false;
                this.importButtonText = "导入数据";
                this.importButtonIcon = "el-icon-upload2";
                this.initEmployee();
            },
            onSuccess(response, file, fileList) {
                this.isDisabled = false;
                this.importButtonText = "导入数据";
                this.importButtonIcon = "el-icon-upload2";
                this.initEmployee();
            },
            /**
             *
             * 从服务端下载excel文件
             */
            exportData() {
                //windows.open 请访问该文档https://www.cnblogs.com/itworkers/p/11772395.html
                //打开指定的页面的URL。如果没有指定URL，打开一个新的空白窗口
                //_parent - URL加载到父框架
                window.open("/emp/basic/export", "_parent");
            },
            initEmployee() {
                let url = "";
                //查询所有的员工时的分页
                if (this.keywords === null || this.keywords === '') {
                    url = "/emp/basic/?page=" + this.page + "&size=" + this.size;
                } else {
                    //关键字搜索员工时的分页
                    url = "/emp/basic/?page=" + this.page + "&size=" + this.size + "&keywords=" + this.keywords;
                }
                this.getRequest(url).then(resp => {
                    this.loading = false;
                    if (resp) {
                        this.employeeData = resp.object.data;
                        this.total = resp.object.total;
                    }
                });
            },
            initWorkId() {
                this.getRequest("/emp/basic/workid").then(resp => {
                    if (resp) {
                        this.empForm.workid = resp.object;
                    } else {
                        this.$message.error("工号加载失败！");
                    }
                });
            },
            /***
             * 用户点击分页的查询
             * @param currentPage 当前页码
             */
            currentChange(currentPage) {
                this.page = currentPage;
                //不带关键字的分页
                if (this.keywords === null || this.keywords === '') {
                    //如果是高级查询
                    if (this.rangeSearch.type === "advanced") {
                        this.advancedSearch();
                    }else{
                        this.initEmployee();
                    }
                }else {
                    //带关键字的分页
                    this.initEmployee()
                }
            },
            /**
             * 修改员工信息
             */
            showEditEmp(data) {
                this.dialogFormVisible = true;
                this.OperationType = "编辑";
                this.empForm = data;
            },
            deleteEmp(data) {
                this.$confirm('此操作将永久删除【'+data.name+'】员工, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/emp/basic/" + data.id).then(resp => {
                        if (resp) {
                            this.initEmployee();
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            //用户输入框关键字的搜索
            searchEmp() {
                this.initEmployee();
            },
            showAddEmp() {
                this.OperationType = "添加";
                this.dialogFormVisible = true;
                this.initWorkId();
            },
            addEmp() {
                this.formatDate();
                if (this.OperationType === "添加") {
                    console.log(this.$refs.empForm);
                    this.$refs.empForm.validate((valid) => {
                        if (valid) {
                            this.postRequest("/emp/basic/", this.empForm).then(resp => {
                                if (resp) {

                                    this.empForm = {};
                                    this.dialogFormVisible = false;
                                }
                            });
                        } else {
                            this.$message({
                                message: "所有字段必须填写",
                                type: "error",
                                duration: 500
                            });
                            return false;
                        }
                    });
                } else {
                    this.$refs.empForm.validate((valid) => {
                        if (valid) {
                            this.putRequest("/emp/basic/", this.empForm).then(resp => {
                                if (resp) {
                                    this.empForm = {};
                                    this.initEmployee()
                                    this.dialogFormVisible = false;
                                }
                            });
                        } else {
                            this.$message({
                                message: "所有字段必须填写",
                                type: "error",
                                duration: 500
                            });
                            return false;
                        }
                    });

                }

            },
            /**
             * 格式化时间
             */
            formatDate() {
                this.empForm.birthday = this.moment(this.empForm.birthday).format('YYYY-MM-DD HH:mm:ss');
                this.empForm.begindate = this.moment(this.empForm.begindate).format('YYYY-MM-DD HH:mm:ss');
                this.empForm.conversiontime = this.moment(this.empForm.conversiontime).format('YYYY-MM-DD HH:mm:ss');
                this.empForm.begincontract = this.moment(this.empForm.begincontract).format('YYYY-MM-DD HH:mm:ss');
                this.empForm.endcontract = this.moment(this.empForm.endcontract).format('YYYY-MM-DD HH:mm:ss');
            },
            /***
             * 获取所有部门
             */
            initDepartment() {
                //先看看在本地是否存储了部门信息，没有就去服务端去取
                if (!window.sessionStorage.getItem("departments")) {
                    console.log("本地没有数据开始去服务端获取")
                    this.getRequest("/emp/basic/departments/").then(resp => {

                        if (resp) {
                            this.allDepartment = resp.object;
                            window.sessionStorage.setItem("departments", JSON.stringify(resp.object));
                        }
                    });
                } else {
                    console.log("本地获取数据")
                    this.allDepartment = JSON.parse(window.sessionStorage.getItem("departments"));
                }
            },
            /***
             * 获取所有民族
             * 民族下拉列表打开
             * @param flag true为打开，false为关闭
             */
            getAllNations(flag) {
                if (!window.sessionStorage.getItem("nations")) {
                    console.log("本地没有数据开始去服务端获取")
                    if (flag) {
                        this.getRequest("/emp/basic/nations/").then(resp => {
                            if (resp) {
                                this.allNations = resp.object;
                                window.sessionStorage.setItem("nations", JSON.stringify(resp.object));
                            }
                        });
                    }
                } else {
                    console.log("本地获取数据")
                    this.allNations = JSON.parse(window.sessionStorage.getItem("nations"));
                }

            },
            /***
             * 获取所有职位
             * @param flag
             */
            getAllPositions(flag) {
                if (!window.sessionStorage.getItem("positions")) {
                    console.log("本地没有数据开始去服务端获取")
                    if (flag) {
                        this.getRequest("/emp/basic/positions/").then(resp => {
                            if (resp) {
                                this.allPositions = resp.object;
                                window.sessionStorage.setItem("positions", JSON.stringify(resp.object));
                            }
                        });
                    }
                } else {
                    console.log("本地获取数据")
                    this.allPositions = JSON.parse(window.sessionStorage.getItem("positions"));
                }

            },
            /***
             * 获取所有职称
             */
            getAllJobLevels(flag) {
                if (!window.sessionStorage.getItem("joblevels")) {
                    console.log("本地没有数据开始去服务端获取")
                    if (flag) {
                        this.getRequest("/emp/basic/joblevels/").then(resp => {
                            if (resp) {
                                this.allJobLevels = resp.object;
                                window.sessionStorage.setItem("joblevels", JSON.stringify(resp.object));
                            }
                        });
                    }
                } else {
                    console.log("本地获取数据")
                    this.allJobLevels = JSON.parse(window.sessionStorage.getItem("joblevels"));
                }

            },
            /**
             * 获取所有政治面貌
             * @param flag
             */
            getAllPoliticsStatus(flag) {
                if (!window.sessionStorage.getItem("politicsstatus")) {
                    console.log("本地没有数据开始去服务端获取")
                    if (flag) {
                        this.getRequest("/emp/basic/politicsstatus/").then(resp => {
                            if (resp) {
                                this.allPoliticsStatus = resp.object;
                                window.sessionStorage.setItem("politicsstatus", JSON.stringify(resp.object));
                            }
                        });
                    }
                } else {
                    console.log("本地获取数据")
                    this.allPoliticsStatus = JSON.parse(window.sessionStorage.getItem("politicsstatus"));
                }

            },
            selectedDepartment(data) {
                this.empForm.departmentName = data.name;
                this.empForm.departmentid = data.id;
                this.rangeSearch.departmentName = data.name;
                this.rangeSearch.departmentId = data.id;
                this.$refs.department.click();

            }
        }
    }
</script>

<style scoped>
    .table {
        margin-top: 20px;
    }
    .total-page{
        display: flex;
        justify-content: space-between;
        margin-top: 30px;
    }
    .header{
        margin-top: 20px;
        display: flex;
        justify-content: space-between;
    }
   .emp-length{
       width: 215px;

   }
    .showRangeSearch{
        box-shadow: 0 0 25px rgba(0, 0, 0, .2);
        border-radius: 14px;
        margin-top: 10px;
        padding-left: 150px;
        padding: 10px;
    }

</style>