<template>
  <div class="fileUpload">
    <Button type="primary" style="butfile" @click="showModel">{{btnName?btnName:'上传文件'}}</Button>
    <div v-if="isShowFile" style="width: 400px;">
      <Tag
        v-for="item in names.filter(item => item)"
        :key="item"
        class="iv-tags-item"
        :name="item"
        closable
        :title="item.substring(item.lastIndexOf('\/') + 1, item.length)"
        @on-close="handleClose"
      >
        <Icon type="ios-folder"></Icon>
        <a
          :href="fileDownloadUrl + item"
          target="_blank"
        >{{item.substring(item.lastIndexOf("\/") + 1, item.length)}}</a>
      </Tag>
    </div>
  </div>
</template>

<script>
import { api_config, common_config } from "@/util/config.js";
import { utils } from "@/util/util.js";

export default {
  props: {
    btnName: {
      type: String
    },
    value: {
      type: Object
    },
    fileExt: {
      // 格式
      type: String
    },
    item: {
      type: Object
    },
    isShowFile: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      url: utils.ssourl,
      artDialog_url: common_config.artDialog_url,
      iframeTools_url: common_config.iframeTools_url,
      names: [],
      fileDownloadUrl: utils.ssourl
    };
  },
  watch: {
    "value": {
      handler:function(e) {
        console.log(e);
        this.names = this.value.values ? this.value.values.split("|") : [],
        console.log(this.names);
      },
      deep:true
    }
  },
  created() {
      console.log('valus',this.names);
  },
  methods: {
    handleClose(event, name) {
      console.log('1',name);
      console.log('2',event);
      let _this = this;
      let index = _this.names.indexOf(name);
      let params = { attmentid: _this.value.attachmentID, topicId: _this.value.topicId }
      _this.names.splice(index, 1);
      _this.value.values = _this.names.join("|");
      _this.item.filesNum = _this.names.length - 1;
      _this.$emit("input", _this.value); // 修改过的值传递到父组件
      _this.$emit("onClose", name, _this.item);
    },
    changeName() {
      this.names = this.value.values ? this.value.values.split("|") : [];
      this.item.filesNum = this.names.length - 1;
    },
    showModel() {
      let _this = this;
      console.log("showModel", this.value);
      _this.item.filesNum = this.names.length - 1;
      this.$emit("onUpload", this.value, this.item);
      $.getScript(_this.url + common_config.module_url, function() {
        let timer = setInterval(() => {
          if (_this.value.sourceID) {
            // 加载module.js成功后回调
            $.yzl.webUploader.init({
              scriptID: "moduleDom", //引用插件js的scriptID，默认为moduleDom
              title: _this.btnName ? _this.btnName : "上传文件", //显示标题
              sourceID: _this.value.sourceID, //空字符，只上传，不操作数据库
              fileNumLimit: 5, //文件总数量, 超出则不允许加入队列
              fileSizeLimit: 500 * 1024 * 1024, //文件总大小限制, 超出则不允许加入队列 //500M
              fileSingleSizeLimit: 100 * 1024 * 1024, //单个文件大小限制, 超出则不允许加入队列 //100M
              ssoUrl: _this.url,
              isDomain: true, //是否跨域，
              /*支持的文件类型*/
              accept: [
                {
                  title: "文件",
                  extensions: _this.fileExt.replace(/\./g, ""),
                  mimeTypes: _this.fileExt
                }
              ],
              //上传成功的回调函数（,上传完成的文件数据,上传失败的文件数据,上传成功的文件）
              successFun: function(completeFiles, errorFiles, successFiles) {
                var val = "";
                $.each(successFiles, function(i, item) {
                  val += item + "|";
                });
                _this.value.values =
                  (_this.value.values ? _this.value.values : "") + val;
                _this.changeName();
                //保存
                _this.$emit("input", _this.value); // 修改过的值传递到父组件
                _this.$emit("success", _this.value);
              }
            });
            clearInterval(timer);
          }
        }, 100);
      });
    }
  },
  mounted() {
    $.getScript(common_config.artDialog_url, function() {
      $.getScript(common_config.iframeTools_url);
    });
    this.item.filesNum = this.names.length - 1;
  }
};
</script>
<style>
.fileUpload {
  display: inline-flex;
  flex-direction: column;
}
.person-item {
  margin: 0 5px;
}
i.ivu-icon-ios-folder {
  vertical-align: middle;
  margin: 0 4px;
}
.iv-tags-item {
  position: relative;
  width: 350px;
  padding-right: 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.fileUpload .ivu-tag .ivu-icon-ios-close-empty {
  position: absolute;
  top: 4px;
  right: 5px;
}
.butfile{
  width: 100px;
  text-align: center;
}
</style>
