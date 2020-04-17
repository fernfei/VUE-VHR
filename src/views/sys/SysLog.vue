<template>
    <div>
        <div>
            <div class="searchBox">
                <el-input class="searchUser"
                          clearable
                          v-model="keywords"
                          @keydown.enter.native="searchUser"
                          placeholder="可以通过搜索用户名来查询用户的操作记录..."
                          prefix-icon="el-icon-search"
                          size="small"></el-input>
                <el-button class="buttonUser"
                           type="primary"
                           icon="el-icon-search"
                           size="small"
                           @click="searchLog">搜索</el-button>
            </div>
            <div></div>
        </div>
        <div>
            <el-table
                    :data="logData"
                    stripe
                    style="width: 40%">
                <el-table-column
                        prop="id"
                        label="编号"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="hr.name"
                        label="操作员"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="operate"
                        label="操作内容"
                        width="230">
                </el-table-column>
                <el-table-column
                        prop="adddate"
                        label="操作日期"
                        width="200">
                </el-table-column>
            </el-table>

        </div>
        <div style="margin-top: 20px;">
            <el-pagination
                    background
                    @current-change="currentChange"
                    layout="prev, pager, next"
                    :total="total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
        name: "SysLog",
        data() {
            return {
                keywords: "",
                page: 1,
                size: 10,
                logData: [],
                total: 0
            }
        },
        watch: {
            keywords(val) {
                if (val === null || val === "") {
                    this.initLog(this.page,this.size);
                }
            }
        },
        mounted() {
            this.initLog(this.page,this.size);
        },
        methods:{
            initLog(page,size) {
                if (this.keywords === null || this.keywords === "") {
                    this.getRequest("/sys/log/?page=" + page + "&size=" + size ).then(resp => {
                        if (resp) {
                            this.logData = resp.object.data;
                            this.total=resp.object.total
                        }
                    });
                }else{
                    this.getRequest("/sys/log/?page=" + page + "&size=" + size + "&keywords=" + this.keywords).then(resp => {
                        if (resp) {
                            this.logData = resp.object.data;
                        }
                    });
                }
            },
            searchLog() {
                this.initLog(this.page,this.size)
            },
            currentChange(currentPage) {
                this.initLog(currentPage, this.size);
            }
        }
    }
</script>

<style scoped>
    .searchBox {
        margin: 30px 0;
    }
.searchUser{
    width: 400px;
}
</style>