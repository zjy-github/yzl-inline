<template>
    <div>
        <div class="demo-upload-list" v-for="item in uploadList" :key="item.url">
            <template v-if="item.status === 'finished'">
                <img :src="item.url">
                <div class="demo-upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
                    <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                </div>
            </template>
            <template v-else>
                <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
            </template>
        </div>

        <Upload ref="upload" :show-upload-list="false" :default-file-list="defaultList" :on-success="handleSuccess" :format="['jpg','jpeg','png']" :max-size="2048" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" :before-upload="handleBeforeUpload" multiple type="drag" action="//jsonplaceholder.typicode.com/posts/" style="display: inline-block;width:58px;">
            <div style="width: 58px;height:58px;line-height: 70px;">
                <Icon type="ios-cloud-upload" size="30"></Icon>
            </div>
        </Upload>

        <Modal title="View Image" v-model="visible">
            <img :src="'https://o5wwk8baw.qnssl.com/' + imgName + '/large'" v-if="visible" style="width: 100%">
        </Modal>
    </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String
    },
    action: "",
    multiple: "",
    format: "",
    maxSize: "",
    maxLength: ""
  },
  data() {
    return {
      defaultList: [
        {
          name: "a42bdcc1178e62b4694c830f028db5c0",
          url: ""
        }
      ],
      imgName: "",
      visible: false,
      uploadList: []
    };
  },
  watch: {
    
  },
  methods: {
    // 预览
    handleView(name) {
      this.imgName = name;
      this.visible = true;
    },
    // 删除
    handleRemove(file) {
      const fileList = this.$refs.upload.fileList;
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
    },

    handleSuccess(res, file) {
      file.url =
        "https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar";
      file.name = "7eb99afb9d5f317c912f08b5212fd69a";
    },

    // 格式不对提示
    handleFormatError(file) {
      this.$Notice.warning({
        title: "上传出错提示",
        desc: file.name + "格式不对"
      });
    },
    // 文件过大提示
    handleMaxSize(file) {
      this.$Notice.warning({
        title: "上传出错提示",
        desc: file.name + "文件太大"
      });
    },

    // 文件数量检测
    handleBeforeUpload(file) {
      const check = this.uploadList.length < 5;
      if (!check) {
        this.$Notice.warning({
          title: "上传数量超出限制"
        });
      }

      return check;
    }
  },

  mounted() {
    this.uploadList = this.$refs.upload.fileList;
    this.defaultList[0].url = this.value;
  }
};
</script>

<style>
.demo-upload-list {
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}
.demo-upload-list img {
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
</style>

