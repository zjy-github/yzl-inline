<template>
    <div class="body">
        <div id="wrap">
            <div>
                <img src="../../assets/image/404/404.png" alt="404" />
            </div>
            <div id="text">
                <strong>
                    <span></span>
                    <router-link to="/">返回首页</router-link>
                    <a href="###" @click="$router.back(-1)">返回上一页</a>
                </strong>
            </div>
        </div>

        <div class="below"></div>
        <div class="above"></div>
    </div>
</template>

  <script>
export default {
  data() {
    return {};
  }
};
</script>

<style scoped>
html{overflow: hidden;}
.body{margin: 0; background-color: #67ace4;height: 100%; }
::selection{background: none;}
::-moz-selection{background: none;}
#wrap{margin: 0 auto;width: 399px;padding-top: 100px;}
#text{text-align: center; padding-top: 20px;}
#text strong{display: inline-block; font-size: 14px; font-weight: normal;}
#text strong *{float: left;}
#text span{width: 128px; height: 29px; background: url(../../assets/image/404/info.png) no-repeat;}
#text a{line-height: 14px; color: #fff; text-decoration: none; padding: 6px 14px; margin: 1px 0 0 10px; border: 1px solid #fff; border-radius: 14px;
	user-select: none;
	-webkit-user-select: none;
	-webkit-tap-highlight-color: rgba(0,0,0,0);
	transition: 0.2s ease-out;
	-o-transition: 0.2s ease-out;
	-moz-transition: 0.2s ease-out;
	-webkit-transition: 0.2s ease-out;
}
#text a:hover, #text a:active{background: #fff; color: #000;}
@media screen and (max-width: 414px) {
	#wrap, #wrap img, #text span{width: 200px;}
	#text span{background-position: center; margin-bottom: 16px;}
	#text a:nth-of-type(1){margin-left: 0;}
}
.below, .above{position: absolute; bottom: 0; left: 0;/* z-index: -1;*/ width: 100%;}
.below{height: 173px; background: url(../../assets/image/404/below.png) no-repeat;}
.above{height: 149px; background: url(../../assets/image/404/above.png) no-repeat -60px 0;
}
</style>
