/* 公共常量 */
const common_config = {
    cookie_name_token: "OAuth_SessionID", //存token的cookin名称
    list_pagesize: 10, //每页显示个数
    list_pagesizes: [10, 15, 30, 50, 100], //允许切换的页大小数组
    artDialog_url: 'http://h.yzl.ltd/siteFiles/jQuery/artDialog4.1.7/artDialog.js',
    iframeTools_url: 'http://h.yzl.ltd/siteFiles/jQuery/artDialog4.1.7/plugins/iframeTools.js',
    module_url: 'sitefiles/module.js'
}
/* 接口地址 */
const api_config = {
    common_ssourl: "/api/common/ssourl", //单点登录获取
    common_cuser: "/api/common/cuser", //获取当前用户
    common_export: "/api/BeiKeInfo/exportlist", //导出数据
}

/* 提交表单的规则 */
const rules_Validate = {
    empty: [{
        required: true,
        message: "内容不能为空",
        trigger: "blur"
    }],
    mail: [{
        required: true,
        message: "邮箱不能为空",
        trigger: "blur"
    }, {
        type: "email",
        message: "请输入正确的邮箱",
        trigger: "blur"
    }],
    date: [{
        required: true,
        type: "date",
        message: "请选择日期",
        trigger: "change"
    }],
    array: [{
        required: true,
        type: "array",
        min: 1,
        message: "请选择",
        trigger: "change"
    }]
}
export {
    common_config,
    api_config,
    rules_Validate
}