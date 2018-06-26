
let md5js = require('./md5.js');
let userData = wx.getStorageSync("user_data") || [];
let token = userData.token;
let app = getApp();
let Promise = require('./es6-promise.min');

function formatTime(date) {
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    let hour = date.getHours()
    let minute = date.getMinutes()
    let second = date.getSeconds()
    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
}

//注册
const rootDocment = "https://www.bossdream.com";
// const rootDocment ="http://192.168.101.200:8080";
// const rootDocment ='https://www.yhwxxt.com';
function req(url, data, cb) {
    wx.request({
        url: rootDocment + url,
        data: data,
        method: 'post',
        header: { 'Content-Type': 'application/json' },
        success: function (res) {
            return typeof cb == "function" && cb(res.data)
        },
        fail: function () {
            return typeof cb == "function" && cb(false)
        }
    })
}

function wxPromisify(fn) {
    return function (obj = {}) {
        return new Promise((resolve, reject) => {
        obj.success = function (res) {
            resolve(res)
        }

        obj.fail = function (res) {
            reject(res)
        }

        fn(obj)
        })
    }
}

//上传文件  
function uploadFile(url, filePath, name, formData, cb) {
    console.log('a=' + filePath)
    wx.uploadFile({
        url: rootDocment + url,
        filePath: filePath,
        name: name,
        header: {
            'content-type': 'multipart/form-data'
        }, // 设置请求的 header  
        formData: formData, // HTTP 请求中其他额外的 form data  
        success: function (res) {
            if (res.statusCode == 200 && !res.data.result_code) {
                console.log(res)
                return typeof cb == "function" && cb(res.data)
            } else {
                return typeof cb == "function" && cb(false)
            }
        },
        fail: function () {
            return typeof cb == "function" && cb(false)
        }
    })
}

// 去前后空格
function trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
}

// 提示错误信息
function isError(msg, that) {
    that.setData({
        showTopTips: true,
        errorMsg: msg
    })
}

// 清空错误信息
function clearError(that) {
    that.setData({
        showTopTips: false,
        errorMsg: ""
    })
}
// 获取普通报修订单列表
function geturgentlist(url, token, customer_id, page_num, page_size, status, order_by_sign, order_by, callback){
    let sign = md5js.md5("{customer_id=" + customer_id + ",status=" + status + ",page_num=" + page_num + ",page_size=" + page_size + ",order_by=" + order_by_sign + "}")
    wx.request({
        url: rootDocment + url,
        data:{
            "sign": sign,
            "token": token,
            "params": {
                "customer_id": customer_id,
                "status": status,
                "page_num": page_num,
                "page_size": page_size,
                "order_by": order_by
            }
        },
        method: 'post',
        header: {
            'content-type': 'application/json' // 默认值
        },
        success: function (res) {
            if (res.statusCode == 200) {
                callback(res.data);
            }  
        }
    })
}

// 维修类型下拉选择
function repPickerChange(url,code,currentId,success,fail){
    let sign = md5js.md5("{code=" + code + ",parentId=" + currentId + "}")
    wx.request({
    url: rootDocment + url,
    data: {
        "sign": sign,
        "params": {
        "code": code,
        "parentId": currentId
        }
    },
    method: 'post',
    header: {
        'content-type': 'application/json' // 默认值
    },
    success: success,
    fail: fail
    })
}

// 公共接口
function getpublicrequest(url,token,sign,data,success,fail){
    wx.request({
        url: rootDocment + url,
        data: {
            "sign": sign,
            "token": token,
            "params": data
        },
        method: 'post',
        header: {
            'content-type': 'application/json' // 默认值
        },
        success:success,
        fail:fail
    })
}

 //星级评分
//  function pingfenxing(pingfen) {
//    let that = this,　　//这里是图片的路径，自己需要改
//      data = {
//        ling: "images/star_icon.png",
//        zheng: "images/star_icon2.png",
//       //  ban: "img/pingfen1.png"
//      },
//      nums = [];//这里是返回图片排列的顺序的数组，这里要注意在页面使用的时候图片的路径，不过使用网络图片无所谓　　　　if((pingfen/0.5)%2==0){//如果评分为整数，如4.0、5.0
//    for (let i = 0; i < 5; i++) {
//      if (i < pingfen) {
//        nums.push(data.zheng);
//      } else {
//        nums.push(data.ling);
//      }
//    }
//   //      }else{//评分不为整数，如3.5、2.5
//   //        for(let i= 0;i<5;i++){
//   //    if (i < pingfen - 0.5) {
//   //      nums.push(data.zheng);//先把整数分离出来，如：3.5，这里就是先把3分离出来，把代表1的图片放进去
//   //    } else if (i == (pingfen - 0.5)) {
//   //      nums.push(data.ban);//把小数的部分分离出来，如：3.5里的0.5，把代表0.5的图片放进去
//   //    } else {
//   //      nums.push(data.ling);//然后剩下的就是没有满的用代表0的图片放进去，如：3.5，里面放进去了3个代表1的图片，然后放入了1个代表0.5的图片，最后还剩一个图片的位置，这时候就放代表0的图片
//   //    }
//   //  }
//   //        }
//    return num;
//  }

module.exports = {
  // pingfen: pingfenxing,
    formatTime: formatTime,
    req: req,
    trim: trim,
    isError: isError,
    clearError: clearError,
    uploadFile: uploadFile,
    wxPromisify: wxPromisify,
    geturgentlist: geturgentlist,
    getpublicrequest: getpublicrequest,
    repPickerChange: repPickerChange,
}