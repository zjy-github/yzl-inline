<template>
  <div class="container-box">
    <Breadcrumb class="breadcrumb">
      <BreadcrumbItem to="list">测试列表</BreadcrumbItem>
      <BreadcrumbItem>添加</BreadcrumbItem>
    </Breadcrumb>
    <div style="padding: 50px">
      <Form ref="form" :model="form" :label-width="110" class="clearfix">
        <FormItem
          label="姓名"
          prop="L_TeaName"
          :rules="{ required: true, message: '姓名不能为空', trigger: 'blur' }"
        >
          <Row>
            <i-col span="24">
              <i-input
                type="text"
                v-model="form.L_TeaName"
                placeholder="请输入姓名"
              ></i-input>
            </i-col>
          </Row>
        </FormItem>
        <FormItem
          label="登陆名"
          prop="L_LoginName"
          :rules="[{ required: true, message: '登陆名不能为空' }]"
        >
          <Row>
            <i-col span="24">
              <i-input
                type="text"
                v-model="form.L_LoginName"
                placeholder="请输入登陆名"
              ></i-input>
            </i-col>
          </Row>
        </FormItem>
        <FormItem
          label="用户名"
          prop="L_UserName"
          :rules="[{ required: true, message: '用户名不能为空' }]"
        >
          <Row>
            <i-col span="24">
              <i-input
                type="text"
                v-model="form.L_UserName"
                placeholder="请输入用户名"
              ></i-input>
            </i-col>
          </Row>
        </FormItem>
        <FormItem
          label="登录密码"
          prop="L_PassWord"
          :rules="[{ required: true, message: '登录密码不能为空' }]"
        >
          <Row>
            <i-col span="24">
              <i-input
                type="text"
                v-model="form.L_PassWord"
                placeholder="请输入登录密码"
              ></i-input>
            </i-col>
          </Row>
        </FormItem>
        <FormItem style="width: 100%">
          <Button type="primary" size="large" @click="handleSubmit('form')"
            >提交</Button
          >
        </FormItem>
      </Form>
    </div>
  </div>
</template>

<script>
import { api_config } from "@/util/config.js";
export default {
  data() {
    return {
      id: this.$route.query.id || "",
      form: {},
    };
  },
  methods: {
    /**
     * 验证表单数据
     * @method handleSubmit
     */
    handleSubmit(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.dataEdit();
        }
      });
    },
    /**
     * 修改或编辑表单数据
     * @method dataEdit
     */
    async dataEdit() {
      let _this = this;

      let r = await _this.$http[_this.id ? "put" : "post"](
        api_config.module_info + _this.id,
        _this.form
      );

      if (!r || !r.body.Result) {
        _this.$Message.error(r ? r.body.msg : "修改数据失败，请稍后重试！");
        return false;
      }

      _this.$Message.success("编辑成功");
    },

    /**
     * 获取表单数据
     * @method getData
     */
    async getData() {
      let _this = this;

      let r = await _this.$http.get(api_config.module_info + _this.id);

      if (!r || r.body.code != 1) {
        _this.$Message.error(r ? r.body.msg : "获取数据失败，请稍后重试！");
        return false;
      }

      let $data = r.body.data;

      _this.form = $data;
    },
  },

  mounted() {
    if (this.id) {
      // 判断是否是编辑还是新增
      this.getData();
    }
  },
};
</script>

<style>
.ivu-form-item {
  width: 50%;
  float: left;
}
</style>
