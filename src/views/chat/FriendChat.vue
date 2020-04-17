<template>
    <div id="char">
        <div class="sidebar">
            <card></card>
            <list></list>
        </div>
        <div class="main">
            <message></message>
            <usertext></usertext>
        </div>
    </div>
</template>

<script>

    import card from '../../components/chat/card'
    import list from '../../components/chat/list.vue'
    import message from '../../components/chat/message'
    import usertext from '../../components/chat/usertext'
    export default {
        name: "FriendChat",
        data() {
            return {};
        },
        mounted:function() {
            /***
             * vue store存储commit 和dispatch的区别？
             *
             *     dispatch：含有异步操作，
             *
             *    存储:
             *
             *    this.$store.dispatch('setTargetUser',friend);
             *    取值:
             *
             *    this.$store.getters.targetUser;
             *
             *
             *    commit：同步操作，
             *
             *    存储:
             *
             *    this.$store.commit('setTargetUser',friend);
             *    取值:
             *
             *    this.$store.state.setTargetUser
             */
            this.$store.dispatch('initData');
        },
        components:{
            card,
            list,
            message,
            usertext
        }
    }
</script>

<style scoped>
    #char {
        margin: 20px auto;
        width: 800px;
        height: 600px;
        overflow: hidden;
        border-radius: 10px;
        box-shadow: 0 0 25px rgba(0, 0, 0, .2);
    }
    .sidebar, .main {
        height: 100%;
    }
    .sidebar {
        float: left;
        color: #f4f4f4;
        background-color: #2e3238;
        width: 200px;
    }
    .main {
        position: relative;
        overflow: hidden;
        background-color: #eee;
    }

</style>