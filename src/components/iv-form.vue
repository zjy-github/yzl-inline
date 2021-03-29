<template>
  <div style="padding:50px;">

    <Form ref="formDynamic" :model="formDynamic" :label-width="110" class="clearfix">

      <FormItem v-for="(item, index) in formDynamic.items" :key="index" :label="item.label" :prop="'items.' + index + '.value'" :rules="ruleValidate[item.rule]">
        <Row v-if="item.type == 0">
          <i-col span="24">
            <i-input type="text" v-model="item.value" placeholder="请输入内容"></i-input>
          </i-col>
        </Row>

        <Select v-if="item.type == 1" v-model="item.value" placeholder="Select your city">
          <Option v-for="val in item.options" :key="val" :value="val">{{val}}</Option>
        </Select>

        <Row v-if="item.type == 2">
          <i-col span="24">
            <DatePicker v-model="item.value" format="yyyy-MM-dd" type="daterange" placement="bottom-end" placeholder="Select date"></DatePicker>
          </i-col>
        </Row>

        <Row v-if="item.type == 3">
          <i-col span="24">
            <DatePicker :value="item.value" format="yyyy年MM月dd日" type="date" placeholder="Select date"></DatePicker>
          </i-col>
        </Row>

        <RadioGroup v-if="item.type==4" v-model="item.value">
          <Radio v-for="val in item.Radios" :key="val" :label="val">{{val}}</Radio>
        </RadioGroup>

        <CheckboxGroup v-if="item.type==5" v-model="item.value">
          <Checkbox v-for="val in item.Checkboxs" :key="val" :label="val"></Checkbox>
        </CheckboxGroup>

        <Row v-if="item.type == 6">
          <i-col span="24">
            <i-input type="textarea" :autosize="{minRows: 2,maxRows: 8}" v-model="item.value" placeholder="请输入内容"></i-input>
          </i-col>
        </Row>

        <ivUpload v-if="item.type == 7" :value="item.value" :action="item.action" :multiple="item.multiple" :format="item.format" :maxSize="item.maxSize" :maxLength="item.maxLength"></ivUpload>

        <ivSelectUser  v-if="item.type == 8" v-model="item.value"></ivSelectUser>

        <ivFileUpload  v-if="item.type == 9" v-model="item.value"></ivFileUpload>

      </FormItem>

      <FormItem style="width:100%;">
        <Button type="primary" size="large" @click="handleSubmit('formDynamic')">提交</Button>
      </FormItem>
    </Form>
  </div>
</template>

  <script>
import { rules_Validate } from "@/util/config.js";
import ivUpload from "@/components/iv-upload.vue";
import ivSelectUser from "@/components/iv-selectUser.vue";
import ivFileUpload from "@/components/iv-fileUpload.vue";

export default {
  components: { ivUpload, ivSelectUser, ivFileUpload },

  props: {
    getUrl: { // 父组件传过来的参数
      type: String
    }
  },
  data() {
    return {
      formDynamic: { // 存放动态表格数据
        items: []
      },
      ruleValidate: rules_Validate // 规则
    };
  },
  methods: {
    /**
     * 提交验证
     * @method handleSubmit
     */
    handleSubmit(form) {
      let _this = this;

      _this.$refs[form].validate(valid => {
        if (valid) {
          _this.$Message.success("Success!");
          _this.$emit("childMethod", _this.formDynamic.items); // 验证成功后调用父组件的上传方法
        } else {
          _this.$Message.error("Fail!");
        }
      });
    },

    /**
     * 获取表单数据
     * @method getData
     */
    async getData() {
      let _this = this;

      let r = await _this.$http.get(_this.getUrl, {
        params: {
          id: '3f4809ab-0d1e-42b4-acb6-77e58e67c004'
        }

      });

      if (!r || r.body.code != 1) {
        _this.$Message.error(r ? r.body.msg : "获取数据失败，请稍后重试！");
        return false;
      }

      // let $data = r.body.Data;

      let $data = [
        {
          type: 0, // 0：普通输入框，1：select框 2：起止日期，3：单个日期，4：单选框，5，多选框，6：文本框，7：图片，8：选人，9：附件
          item_prop: "name",
          label: "姓名",
          value_name: "L_TeaName",
          value: "高飞",
          rule: "empty"
        },
        {
          type: 0,
          label: "登录名",
          value_name: "L_LoginName",
          value: "zhm415",
          rule: "empty"
        },
        {
          type: 0,
          label: "邮箱",
          value_name: "L_Email",
          value: "",
          rule: "mail"
        },
        {
          type: 1,
          label: "下拉框",
          value_name: "L_options",
          value: "高飞1",
          options: ["高飞1", "高飞2", "高飞3"],
          rule: "empty"
        },
        {
          type: 2,
          label: "起止日期",
          value_name: "L_doubleTime",
          value: ["2016-01-01", "2016-02-15"],
          rule: "array"
        },
        {
          type: 3,
          label: "单个日期",
          value_name: "L_singleTime",
          value: "2016-01-01",
          rule: "empty"
        },
        {
          type: 4,
          label: "单选框",
          value_name: "L_Radio",
          value: "高飞1",
          Radios: ["高飞1", "高飞2"]
        },
        {
          type: 5,
          label: "多选框",
          value_name: "L_Checkbox",
          value: ["gaofeo1"],
          Checkboxs: ["gaofeo1", "gaofeo2", "gaofeo3"],
          rule: "array"
        },
        {
          type: 6, // 0：普通输入框，1：select框 2：起止日期，3：单个日期，4：单选框，5，多选框，6：文本框，7：图片
          label: "文本框",
          value_name: "L_textarea",
          value: "高飞"
        },
        {
          type: 7,
          label: "上传图片",
          value_name: "L_uploadImg",
          value:
            "https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar",
          action: "",
          multiple: "",
          format: "",
          maxSize: "",
          maxLength: ""
        },
        {
          type: 8,
          label: "选择用户",
          value: {},
        },
        {
          type: 9,
          label: "上传附件",
          value: {},
        }
      ];

      for (let item of $data) {
        _this.formDynamic.items.push(item);
      }

    }
  },

  mounted() {
    this.getData();
  }
};
</script>
  <style>
.ivu-form-item {
  width: 50%;
  float: left;
}

.ivu-date-picker {
  width: 100%;
}
</style>
