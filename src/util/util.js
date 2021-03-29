/* eslint-disable no-useless-escape */
const api = require('../util/config.js')
let utils = {
    ssourl: "http://zjktgl.zhijiao361.com/",
    //获取cookie、
    getCookie(name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr == document.cookie.match(reg))
            return (arr[2]);
        else
            return null;
    },
    /**
     * @description: 清空无数据参数
     * @param {Object} obj 函数参数
     * @param {Boolean} isJson 是否返回为JSON字符串
     * @return {Object|String} 返回处理后参数
     */
    deleteNotParams(obj, isJson = false) {
        let str = JSON.stringify(obj, (key, val) => (val || val === 0 ? val : undefined))
        return isJson ? str : JSON.parse(str);
    },
    //设置cookie,增加到vue实例方便全局调用
    setCookie(c_name, value, expiredays) {
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + expiredays);
        document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString()) + "; path=/";
    },
    //删除cookie
    delCookie(name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = this.getCookie(name);
        if (cval != null)
            document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
    },
    //创建sourceID
    getid() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            var r = (Math.random() * 16) | 0,
                v = c == "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    },
    //获取url中的参数
    getQueryStringByName(name) {
        var result = location.href.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
        if (result == null || result.length < 1) {
            return "";
        }
        return result[1];
    },
    //验证数据是否为空或空字符
    isNullOrEmpty(str) {
        return str == null || str.toString().trim() == "";
    },
    //验证数据是否为undefined
    isUndefined(str) {
        return typeof (str) == "undefined";
    },
    //验证数据是否为空或空字符
    isEmptyGuid(str) {
        return str == "00000000-0000-0000-0000-000000000000";
    },
    //克隆对象
    clone(origin) {
        // return Object.assign({}, origin);
        // 深拷贝
        return JSON.parse(JSON.stringify(origin));
    },
    /*获取基域名*/
    getBaseDomain() {
        let url = window.location.host;
        if (typeof url == "undefined" ||
            null == url)
            url = window.location.host;

        var index = url.indexOf('.');
        if (index == -1) {
            return "localhost";
        }

        return url.substr(index + 1);
    },
    // 时间格式化
    dateFormat(time, fmt) {
        if (!time || time == "0001-01-01T00:00:00") return '';
        if (typeof time === "string" && time.includes("T")) {
            time = time.replace("T", " ").replace(/\-/g, "/");
        }
        if (typeof time === "string" && time.indexOf(".") !== -1) {
            time = time.split(".")[0];
        }
        time = new Date(time);
        var o = {
            "M+": time.getMonth() + 1,
            "d+": time.getDate(),
            "h+": time.getHours(),
            "m+": time.getMinutes(),
            "s+": time.getSeconds(),
            "q+": Math.floor((time.getMonth() + 3) / 3),
            S: time.getMilliseconds(),
        };

        if (/(y+)/.test(fmt))
            fmt = fmt.replace(
                RegExp.$1,
                (time.getFullYear() + "").substr(4 - RegExp.$1.length)
            );

        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(
                    RegExp.$1,
                    RegExp.$1.length === 1 ?
                        o[k] :
                        ("00" + o[k]).substr(("" + o[k]).length)
                );
        }

        return fmt;
    },
    // 表格操作按钮
    // 颜色只能为红色和蓝色
    // obj {
    //   注：按钮颜色优先 color => state => type
    //   type: Number|| Boolean 0删除(颜色为红色) 1编辑(颜色为蓝色)
    //   way: Function 点击事件
    //   vertical: Number|| Boolean 1表示显示分割线，0为无，一多个节点使用
    //   state: Number|| Boolean 1 按钮置灰，切不可操作
    //   name: String 自定义按钮名称
    //   addIsEditor: Number|| Boolean 1 编辑,如果是编辑则触发函数的时候携带一个type值为1
    //   color: Number|| Boolean 如果传1按钮颜色为黑色，不传则为type的颜色
    // }
    handleButton(h, params, obj) {
        return h('a', [h('a', {
            style: {
                color: obj.color ? '#515A6E' : obj.state ? '#cccccc' : obj.type ? '#008af1' : '#ed3f14',
                display: 'inline-block',
                margin: '0 1px',
                cursor: obj.state ? 'not-allowed' : 'pointer',
            },
            on: {
                click: () => {
                    obj.state ? '' : obj.way(obj.addIsEditor ? 1 : params, params)
                }
            }
        }, obj.name ? obj.name : obj.type ? '编辑' : '删除'), obj.vertical && h('span', {
            style: {
                color: '#515A6E'
            }
        }, '丨')])
    },
    query(page) {
        let vars = {};
        let hash;
        let hashes = location.search.slice(1).split("&");
        for (var i = 0; i < hashes.length; i++) {
            if (hashes[i]) {
                hash = hashes[i].split("=");
                vars[hash[0]] = decodeURIComponent(hash[1]);
            }
        }
        vars.pageindex = page;
        return vars;
    },
    //获取下载附件
    getUrl(vue, data) {
        let { FileName, FileType, FileToken } = data;
        vue.$http
            .post(
                api.api_config.common_DownloadTemp, { FileName, FileType, FileToken }, { responseType: "blob" }
            )
            .then(
                res => {
                    this.download(res.body);
                },
                () => {
                    vue.$Message.error("下载失败，请稍后重试！");
                }
            );
    },
    //下载附件转码
    download(data) {
        if (!data) {
            return;
        }
        let url = window.URL.createObjectURL(new Blob([data]));
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", "教案详情.xlsx");
        document.body.appendChild(link);
        link.click();
    },
};
const city = {
    11: "北京",
    12: "天津",
    13: "河北",
    14: "山西",
    15: "内蒙古",
    21: "辽宁",
    22: "吉林",
    23: "黑龙江 ",
    31: "上海",
    32: "江苏",
    33: "浙江",
    34: "安徽",
    35: "福建",
    36: "江西",
    37: "山东",
    41: "河南",
    42: "湖北 ",
    43: "湖南",
    44: "广东",
    45: "广西",
    46: "海南",
    50: "重庆",
    51: "四川",
    52: "贵州",
    53: "云南",
    54: "西藏 ",
    61: "陕西",
    62: "甘肃",
    63: "青海",
    64: "宁夏",
    65: "新疆",
    71: "台湾",
    81: "香港",
    82: "澳门",
    91: "国外 "
};
// 身份证格式验证
const idNumber = (rule, value, callback) => {
    if (value) {
        if (!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value)) {
            callback(new Error('身份证号格式错误'));
        } else if (!city[value.substr(0, 2)]) {
            callback(new Error('身份证地址编码错误'));
        } else if (value.length == 18) {
            //18位身份证需要验证最后一位校验位
            value = value.split('');
            //∑(ai×Wi)(mod 11)
            //加权因子
            let factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
            //校验位
            let parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
            let sum = 0;
            let ai = 0;
            let wi = 0;
            for (let i = 0; i < 17; i++) {
                ai = value[i];
                wi = factor[i];
                sum += ai * wi;
            }
            let last = parity[sum % 11];
            if (last != value[17]) {
                callback(new Error('身份证校验位错误'));
            } else {
                callback();
            }
        } else {
            callback();
        }
    } else {
        callback();
    }
}
const rules = {
    rule_idNumber: { //身份证验证
        validator: idNumber,
        trigger: "blur"
    },
}
export {
    utils,
    rules,
}
