<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { utils } from "@/util/util.js";
import { common_config, api_config } from "@/util/config.js";

export default {
  name: "App",
  data() {
    return {};
  },
  methods: {
    //登录
    async login() {
      let _this = this;
      utils.ssourl = decodeURIComponent(
        localStorage.getItem(common_config.cookie_name_token + "_ssourl")
      );

      //设置基域名
      document.domain = utils.getBaseDomain();

      //获取页面是否有token
      let token = utils.getQueryStringByName("sid");
      if (utils.isNullOrEmpty(token)) {
        //获取用户cookie
        token = _this.getToken();
      }

      //都没有，说明没登陆
      if (utils.isNullOrEmpty(token)) {
        //登录
        _this.toLoginsso();
        return;
      }

      //设置最新获取的token
      utils.setCookie(common_config.cookie_name_token, token, null);
      //token有，验证
      let r = await _this.$http.get(api_config.common_cuser);
      if (!r || r.body.code != 1) {
        //清除原token
        utils.delCookie(common_config.cookie_name_token);
        //登录
        _this.toLoginsso();
        return;
      }

      //验证通过
      //设置当前最新的token
      utils.setCookie(common_config.cookie_name_token, token, null);
    },
    //跳转到单点登录页面
    async toLoginsso() {
      let _this = this;

      let r = await _this.$http.get(api_config.common_ssourl);
      if (!r || r.body.code != 1) {
        _this.$Message.error(r ? r.body.msg : "数据获取失败");
        return false;
      }

      //存在localStorage
      localStorage.setItem(
        common_config.cookie_name_token + "_ssourl",
        r.body.data
      );

      window.location.href =
        r.body.data +
        "/login.aspx?redirecturl=" +
        encodeURIComponent(window.location.href);
      return;
    },
    //获取当前token
    getToken() {
      return utils.getCookie(common_config.cookie_name_token);
    }
  },
  mounted() {
    //登录
    this.login();
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
}

a {
  text-decoration: none;
}

body {
  margin: 0px;
  padding: 0px;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, SimSun, sans-serif;
  font-size: 14px;
  background: #fff;
  -webkit-font-smoothing: antialiased;
}

ol,
ul {
  list-style: none;
}

.clearfix:after {
  content: ".";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}

html,
body,
#app {
  height: 100%;
}

.container-box {
    position: relative;
    background: #fff;
    padding: 5px 20px 80px 20px;
    border-radius: 10px;
}

.breadcrumb {
    padding: 20px !important;
    color: #262626 !important;
}

.ivu-tooltip-rel {
  display: block;
}
.projectItem .codemirror {
  padding: 12px 0;
  overflow-y: initial;
  width: 90%;
  height: 100%;
}
.uploadLine {
  height: 100%;
  border-left: 1px solid #e8eaec;
  position: absolute;
  left: 6px;
  top: 0;
}
.projectItem {
  display: flex;
  margin-bottom: 10px;
}
.projectItem .itemTitle {
  display: inline-block;
  width: 50px;
  margin-right: 5px;
}
.uploadItem {
  position: relative;
  padding-bottom: 25px;
}
.round {
  width: 13px;
  height: 13px;
  background-color: #fff;
  border-radius: 50%;
  border: 1px solid #2d8cf0;
  position: absolute;
  z-index: 9;
}
.uploadItemTitle {
  position: absolute;
  top: -8px;
  left: 20px;
}
.ivu-tag .ivu-tag-text {
  width: auto;
  margin-right: 0;
}
</style>
