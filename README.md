### vue.config.js
- 该文件配置了一个请求转发对象，当前端跨域访问后端时该文件会拦截`/`下的请求
转发到目标路径target='localhost:8081'

### util/api.js
- 该文件封了本系统所有HTTP请求时异常的提示信息和成功的提示信息
- 还封装了以key-value（SpringSecurity默认只支持key-value登陆）是请求后端的函数，和json形式的post、get、put、delete、update函数



### 系统菜单项加载成功后，可以存在前端的几个地方
- sessionStorage
- localStorage
- vuex

### store/index.js
该文件是Vuex用来存放后端菜单数据的

### uitls/menus.js
该文件用来请求后端数据并放入router和vuex
同时可以处理后端的数据