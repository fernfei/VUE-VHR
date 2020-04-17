<template>
    <div>
        <el-tabs v-model="activeName" type="card" style="margin-top: 20px">
            <el-tab-pane label="部门管理" name="depname"><dep-mana></dep-mana></el-tab-pane>
            <el-tab-pane label="职位管理" name="posmana" ><pos-mana></pos-mana></el-tab-pane>
            <el-tab-pane label="职称管理" name="joblevel"><job-level-mana></job-level-mana></el-tab-pane>
            <el-tab-pane label="奖惩规则" name="ec-mana"><ec-mana></ec-mana></el-tab-pane>
            <el-tab-pane label="权限组" name="permissmana"><permiss-mana></permiss-mana></el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import DepMana from "../../components/sys/basic/DepMana";
    import EcMana from "../../components/sys/basic/EcMana";
    import JobLevelMana from "../../components/sys/basic/JobLevelMana";
    import PermissMana from "../../components/sys/basic/PermissMana";
    import PosMana from "../../components/sys/basic/PosMana";
    export default {
        name: "SysBasic",
        data: function () {
            return {
                activeName: "depname",
            }
        },
        components:{
            "dep-mana": DepMana,
            "ec-mana": EcMana,
            "job-level-mana": JobLevelMana,
            "permiss-mana": PermissMana,
            "pos-mana": PosMana
        }
    }
</script>

<style scoped>

</style>