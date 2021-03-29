<template>
  <div class="container-box">
    <Breadcrumb class="breadcrumb">
      <BreadcrumbItem>测试列表</BreadcrumbItem>
    </Breadcrumb>
    <div class="iv-header clearfix">
      <Button
        type="error"
        @click="toWarn(table.selectionIDs)"
        :class="operate.multDelete ? '' : 'disabled'"
        >批量删除</Button
      >
      <router-link to="/add">
        <Button type="primary">新增数据</Button>
      </router-link>
      <Button type="primary" @click="operate.fileInput = true">导入数据</Button>
      <Button type="primary">导出数据</Button>
      <div class="iv-search">
        <i-input
          class="search-item"
          clearable
          placeholder="请输入内容"
          v-show="!operate.seniorSearch"
          v-model="table.searchParam.searchStr"
        >
        </i-input>
        <Button v-show="!operate.seniorSearch" @click="search">查询</Button>
        <Button
          :icon="`${
            operate.seniorSearch ? 'md-arrow-round-up' : 'ios-funnel-outline'
          }`"
          @click="operate.seniorSearch = !operate.seniorSearch"
          >{{ operate.seniorSearch ? "收起" : "筛选" }}
        </Button>
      </div>
    </div>
    <div class="iv-senior-search" v-show="operate.seniorSearch">
      <Card :dis-hover="false">
        <div class="iv-s-content">
          <div class="iv-s-item clearfix">
            <span class="iv-s-label">查询条件：</span>
            <div class="iv-s-input">
              <i-input
                class="search-item"
                clearable
                placeholder="查询条件"
                v-model="table.searchParam.searchStr"
              ></i-input>
            </div>
          </div>
          <div class="iv-s-item clearfix">
            <span class="iv-s-label">查询条件：</span>
            <div class="iv-s-input">
              <i-input
                class="search-item"
                clearable
                placeholder="查询条件"
                v-model="table.searchParam.s1"
              ></i-input>
            </div>
          </div>
          <div class="iv-s-item clearfix">
            <span class="iv-s-label">查询条件：</span>
            <div class="iv-s-input">
              <i-input
                class="search-item"
                clearable
                placeholder="查询条件"
                v-model="table.searchParam.s2"
              ></i-input>
            </div>
          </div>
        </div>
        <div class="iv-s-btn">
          <Button @click="loadList()">查询</Button>
          <Button type="primary" @click="emptyInput" ghost>清空搜索条件</Button>
        </div>
      </Card>
    </div>
    <Modal v-model="operate.fileInput" title="导入">
      <Upload
        multiple
        type="drag"
        :format="['xls', 'xlsx']"
        action="//jsonplaceholder.typicode.com/posts/"
      >
        <div style="padding: 20px 0">
          <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
          <p>点击或拖拽文件到这里</p>
        </div>
      </Upload>
      <div slot="footer"></div>
    </Modal>

    <Table
      stripe
      size="small"
      :loading="loading"
      :columns="table.columns"
      :data="table.data"
      @on-sort-change="handleSortChange"
      @on-selection-change="handleSelectionChange"
    ></Table>

    <ivPages v-model="page" v-on:refreshData="loadList"></ivPages>
  </div>
</template>
<script>
import { api_config, common_config } from "@/util/config.js";
import { utils } from "@/util/util.js";
import ivPages from "@/components/iv-pages.vue";
export default {
  components: { ivPages },
  data() {
    return {
      operate: {
        multDelete: false, //显示批量删除
        seniorSearch: false, //显示高级查询
        fileInput: false, //显示导入
      },

      loading: false, //表格是否正在加载数据

      // 分页
      page: {
        pageIndex: parseInt(this.$route.query.pageindex) || 1, //当前页
        current: parseInt(this.$route.query.pageindex) || 1, //当前页码
        pageSize: common_config.list_pagesize, //每页显示个数
        pagesizes: common_config.list_pagesizes, //允许切换的页大小数组
        total: 0, //数据总数
      },

      listOrder: {
        prop: "L_TeaName", //指定默认的排序的列
        order: "asc", //定默认排序的顺序 ascending, descending
      },

      // 表格数据
      table: {
        //查询条件
        searchParam: {
          searchStr: "",
          s1: "",
          s2: "",
        },
        selectionIDs: "", //选中项id集合
        columns: [
          {
            type: "selection",
            width: 50,
            align: "center",
          },
          {
            type: "index",
            width: 60,
            align: "center",
            title: "序号",
          },
          {
            title: "姓名",
            key: "L_TeaName",
            sortable: "custom", //自定义排序
            sortType: "asc", //默认方向
          },
          {
            title: "登陆名",
            key: "L_LoginName",
          },
          {
            title: "最后登陆时间",
            key: "L_LastLoginAddress",
          },
          {
            title: "操作",
            key: "action",
            width: 110,
            align: "center",
            render: (h, params) => {
              return h("div", [
                h(
                  "router-link",
                  { attrs: { to: `/add?id=${params.row.L_Guid}` } },
                  "编辑"
                ),
                h(
                  "a",
                  {
                    on: {
                      click: () => {
                        let row = params.row;
                        //删除
                        this.toWarn(row.L_Guid);
                      },
                    },
                  },
                  "删除"
                ),
              ]);
            },
          },
        ],
        data: [],
      },
    };
  },
  mounted() {
    //加载数据
    // this.loadList();
  },
  methods: {
    /**
     * 加载数据列表
     * @method loadList
     */
    async loadList() {
      let _this = this;

      _this.loading = true;

      //组成统一参数
      var params = Object.assign(_this.table.searchParam, {
        pageindex: _this.page.pageIndex,
        pagesize: _this.page.pageSize,
        prop: _this.listOrder.prop,
        order:
          _this.listOrder.prop == ""
            ? ""
            : _this.listOrder.order == "asc"
            ? "asc"
            : "desc",
      });

      //获取列表
      let r = await _this.$http.get(api_config.module_list, {
        params: params,
      });
      _this.loading = false;

      if (!r || r.body.code != 1) {
        _this.$Message.error(r ? r.body.msg : "获取数据失败，请稍后重试！");
        return false;
      }

      let $data = r.body.data;
      // 渲染数据
      _this.table.data = [...$data.list];
      _this.page.total = $data.total;
      // 渲染数据
      if (_this.page.pageIndex > 1 && !_this.table.data.length) {
        _this.$router.push({ query: utils.query(_this.page.current - 1) });
        _this.$refs.page.$emit("changeCurrent", _this.page.current - 1);
      }
    },
    /**
     * 删除数据
     * @method deleteObjs
     * @param {String} ids 要删除的数据id集合,分割
     */
    async deleteObjs(ids) {
      let _this = this;
      let r = await _this.$http.delete(api_config.module_delete, {
        params: {
          ids: ids,
        },
      });
      if (!r || r.body.code != 1) {
        _this.$Message.error(r ? r.body.msg : "删除失败，请稍后重试");
        return false;
      }

      _this.$Message.success("删除成功!");
      _this.loadList();
    },
    /**
     * 删除数据警告
     * @method deleteObjs
     * @param {String} ids 要删除的数据id集合,分割
     */
    toWarn(ids) {
      let _this = this;
      if (ids == "") {
        return;
      }

      _this.$Modal.confirm({
        title: "提示",
        content: `此操作将永久删除${
          ids.split(",").length >= 2 ? "选中" : "该"
        }数据, 是否继续?`,
        onOk: () => {
          _this.deleteObjs(ids);
        },
        onCancel: () => {},
      });
    },
    /**
     * 当表格的排序条件发生变化的时候会触发该事件
     * @method handleSortChange
     * @param {Json} obj  { column, prop, order }
     */
    handleSortChange(obj) {
      let _this = this;
      _this.listOrder.prop = obj.key;
      _this.listOrder.order = obj.order;
      _this.loadList();
    },
    /**
     * 在多选模式下有效，只要选中项发生变化时就会触发
     * @method handleSelectionChange
     * @param {Json} selection 已选项数据
     */
    handleSelectionChange(selection) {
      let _this = this;

      //显示批量删除
      _this.operate.multDelete = selection.length > 0;

      //选中的 id集合
      _this.table.selectionIDs = "";
      for (let index in selection) {
        _this.table.selectionIDs += selection[index].L_Guid + ",";
      }
    }, //数据清空
    emptyInput() {
      for (const prop in this.table.searchParam) {
        this.table.searchParam[prop] = "";
      }
      this.loadList();
    },
    search() {
      this.$router.push({ query: utils.query(1) });
      this.$refs.page.$emit("changeCurrent", 1);
    },
  },
};
</script>

<style lang="less" scoped>
.iv-senior-search {
  .iv-s-item {
    padding-bottom: 0;
  }
  .search-item {
    margin-bottom: 0;
  }
}
</style>
