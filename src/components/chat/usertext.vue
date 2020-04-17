<template>
  <div id="uesrtext">
    <textarea placeholder="按 Enter 发送" v-model="content" v-on:keyup="addMessage"></textarea>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: 'uesrtext',
  data () {
    return {
      content:''
    }
  },
  methods: {
  	addMessage (e) {
  		if (/*e.ctrlKey && */e.keyCode ===13 && this.content.length) {
          if (this.$store.state.currentSession === "" || this.$store.state.currentSession === null) {
            this.$message.error("请选择接收消息的好友！");
          } else {
            let msgObject = new Object();
            let user = this.$store.state.currentSession;
            msgObject.to = user.username;
            msgObject.content = this.content;
            this.$store.state.stomp.send("/ws/chat", {}, JSON.stringify(msgObject));
            this.$store.commit('addMessage', msgObject);
            this.content = '';
          }

  		}
  	}
  }
}
</script>

<style lang="scss" scoped>
#uesrtext {
	position: absolute;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 30%;
  border-top: solid 1px #DDD;
  > textarea {
  	padding: 10px;
  	width: 100%;
  	height: 100%;
  	border: none;
  	outline: none;
  }
}
</style>
