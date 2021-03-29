<template>
  <div class="ivSelectUser" style="width: 100%;">
    <Button type="primary" @click="showModel">{{title}}</Button>
    <div v-if="value.TeacherName.length" class="tag">
      <Tag
        v-for="(name, i) in value.TeacherName.filter(name=>name)"
        :key="i"
        closable
        @on-close="deleteTag(name, i)"
      >{{name}}</Tag>
    </div>
  </div>
</template>

<script>
import { api_config, common_config } from "@/util/config.js";
import { utils } from "@/util/util.js";

export default {
  props: {
    value: {
      type: Object
    },
    choiceUserType: {
      type: Number
    }
  },
  computed: {},
  data() {
    return {
      title: this.value.title || "选择用户",
      url: utils.ssourl,
      artDialog_url: common_config.artDialog_url,
      iframeTools_url: common_config.iframeTools_url,
      userNames: ""
    };
  },
  methods: {
    /**
     * 弹出选人dialog
     * @method showModel
     */
    showModel() {
      let _this = this;
      $.getScript(_this.url + common_config.module_url, function() {
        // 加载module.js成功后回调
        // 选人控件类型,1教师，2学生，3班级，4课程，5教室，6部门，7系部
        switch (_this.choiceUserType) {
          case 1:
            _this.selectTeacher();
            break;
          case 2:
            _this.selectStudent();
            break;
          case 3:
            _this.selectClass();
            break;
          case 4:
            _this.selectCourse();
            break;
          case 5:
            _this.selectRoom();
            break;
          case 6:
            _this.selectDept(0);
            break;
          case 7:
            _this.selectDept(1);
            break;
        }
      });
    },
    /**
     * 选择教师
     * @method selectTeacher
     */
    selectTeacher() {
      let _this = this;
      let ids = [];
      $.yzl.selectTeacher.init({
        title: _this.value.title || "选择教师", //显示标题
        checkedIDs: _this.value.values ? _this.value.values.split("|")[0] : "", //默认选中的教师id集合,分割
        noLoadIDs: _this.value.noLoadIDs || "", //默认不加载的教师id集合,分割
        ssoUrl: _this.url,
        isDomain: true, //demo不跨域，
        /*点击确定时的回调函数，checkedIDs为选中的教师id集合*/
        callbackOKFun: function(userIDs, deptIDs, userNames, deptNames) {
          _this.value.values = `${userIDs}|${userNames}`;
          _this.value.TeacherName = userNames.split(",");
          _this.$forceUpdate();
          //保存
          _this.$emit("input", _this.value); // 修改过的值传递到父组件
          _this.$emit("refreshData", _this.value);
        }
      });
    },
    /**
     * 选择学生
     * @method selectStudent
     */
    selectStudent() {
      $.yzl.selectTeacher.init({
        userType: 1, //选择学生
        title: "选择学生", //显示标题
        loadClassIDs: "", //要加载的班级id,类型为学生时可用来加载对应班级的学生,分割
        checkedIDs: "", //默认选中的学生id集合,分割
        isCanSelectDept: true, //是否支持选择班级
        noLoadIDs: "", //默认不加载的学生id集合,分割
        isDomain: true, //demo不跨域，
        /*点击确定时的回调函数*/
        callbackOKFun: function(userIDs, deptIDs, userNames, deptNames) {
          //保存
          _this.value.values = `${userIDs}|${userNames}`;
          //保存
          _this.$emit("input", _this.value); // 修改过的值传递到父组件
        }
      });
    },
    /**
     * 选择班级
     * @method selectClass
     */
    selectClass() {
      $.yzl.selectClass.init({
        title: "选择班级", //显示标题
        loadClassIDs: "", //要加载的专业id
        checkedIDs: "", //默认选中的班级id集合,分割
        noLoadIDs: "", //默认不加载的班级id集合,分割
        gState: 0, //班级毕业状态 0不限 1未毕业 2已毕业
        isDomain: true, //跨域，
        /*点击确定时的回调函数*/
        callbackOKFun: function(ids, names) {
          //保存
          alert("班级id:" + ids + "\n班级名称:" + names);
        }
      });
    },
    /**
     * 选择课程
     * @method selectCourse
     */
    selectCourse() {
      $.yzl.selectCourse.init({
        title: "选择课程", //显示标题
        loadClassIDs: "", //要加载的系部id
        checkedIDs: "", //默认选中的课程id集合,分割
        noLoadIDs: "", //默认不加载的课程id集合,分割
        isDomain: true, //跨域，
        /*点击确定时的回调函数，checkedIDs为选中的课程id集合*/
        callbackOKFun: function(ids, names) {
          //保存
          alert("课程id:" + ids + "\n课程名称:" + names);
        }
      });
    },
    /**
     * 选择教室
     * @method selectRoom
     */
    selectRoom() {
      $.yzl.selectRoom.init({
        title: "选择教室", //显示标题
        loadClassIDs: "", //要加载的系部id
        checkedIDs: "", //默认选中的教室id集合,分割
        noLoadIDs: "", //默认不加载的教室id集合,分割
        isDomain: true, //跨域，
        /*点击确定时的回调函数，checkedIDs为选中的教室id集合*/
        callbackOKFun: function(ids, names) {
          //保存
          alert("教室id:" + ids + "\n教室名称:" + names);
        }
      });
    },
    /**
     * 选择部门 || 选择系部
     * @method selectDept
     * @param {String} type 0部门 1系部
     */
    selectDept(type) {
      $.yzl.selectDept.init({
        scriptID: "moduleDom", //引用插件js的scriptID，默认为moduleDom
        title: "选择部门", //显示标题
        type: 0, //0部门 1系部
        checkedIDs: "", //默认选中的部门id集合,分割
        noLoadIDs: "", //默认不加载的部门id集合,分割
        isDomain: true, //demo不跨域，
        /*点击确定时的回调函数*/
        callbackOKFun: function(deptIDs, deptNames) {
          //保存
          alert("部门id:" + deptIDs + "\n部门姓名:" + deptNames);
        }
      });
    },
    //删除已选中项目
    deleteTag(name, index) {
      this.value.TeacherName.splice(index, 1);
      let $values = this.value.values.split("|")[0].split(",");
      $values.splice(index, 1);
      this.value.values =
        this.value.TeacherName.length == 0 || this.value.TeacherName.length == 1
          ? ""
          : `${$values.join(",")}|${this.value.TeacherName.join(",")}`;
      this.$forceUpdate();
      this.$emit("input", this.value); // 修改过的值传递到父组件
      this.$emit("refreshData", this.value);
    }
  },
  mounted() {
    $.getScript(common_config.artDialog_url, function() {
      $.getScript(common_config.iframeTools_url);
    });
  }
};
</script>

<style>
.ivSelectUser .person-item {
  margin: 0 5px;
}
/* .ivSelectUser .ivu-tag .ivu-icon-ios-close-empty {
  position: relative;
  top: 1px;
} */
</style>
