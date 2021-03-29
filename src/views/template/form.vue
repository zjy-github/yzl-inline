<template>
  <div>
    <ivForm :getUrl="getUrl" v-on:childMethod="submitOk"></ivForm>
  </div>
</template>

<script>
import ivForm from "@/components/iv-form.vue";
import { api_config } from "@/util/config.js";

export default {
  components: { ivForm },
  data() {
    return {
      getUrl: api_config.module_info, // 获取数据的接口，传入子组件
    };
  },
  methods: {
    submitOk() {
      // todo 验证成功后提交
    },
  },
  mounted() {},
};
</script>