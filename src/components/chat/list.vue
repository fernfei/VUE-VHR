<template>
  <div id="list">
  	<ul style="padding-left: 0px">
  		<li v-for="user in users" :class="{ active: user.username === currentSession.username }" v-on:click="changeCurrentSession(user)"><!--   :class="[item.id === currentSessionId ? 'active':'']" -->
  			<img class="avatar" :src="user.userface" :alt="user.name">
			<el-badge :is-dot="isDot[currentHr.username + '#' + user.username]"><p class="name">{{user.name}}</p></el-badge>
  		</li>
  	</ul>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: 'list',
  data () {
    return {
      
    }
  },
	computed: mapState([
		'users',
		'currentSession',
		'isDot',
		'currentHr'
	]),
  methods:{
  	changeCurrentSession:function (user) {
  		this.$store.commit('changeCurrentSession',user)
  	}
  }
}
</script>

<style lang="scss" scoped>
#list {
	li {

		padding: 10px 15px;
		list-style: none;
		border-bottom: 1px solid #292C33;
		cursor: pointer;

		&:hover {
			background-color: rgba(255, 255, 255, 0.03);
		}
	}
  li.active {/*注意这个是.不是冒号:*/
			background-color: rgba(255, 255, 255, 0.1);
	}
	.avatar {
		border-radius: 2px;
		width: 30px;
		height: 30px;
		vertical-align: middle;
	}
	.name {
		display: inline-block;
		margin-left: 15px;
		margin-top: 0px;
	}
}
</style>
