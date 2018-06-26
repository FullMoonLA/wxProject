let util = require('../../utils/util.js');
let app = getApp();

Page({
  data: {
    showTopTips: false,
    errorMsg: "",
    isShowToast: false
  },
  onLoad: function () {
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    });
  },
  formSubmit: function (e) {
    // form 表单取值，格式 e.detail.value.name(name为input中自定义name值) ；使用条件：需通过<form bindsubmit="formSubmit">与<button formType="submit">一起使用
    let account = e.detail.value.account;
    let password = e.detail.value.password;
    let subPassword = e.detail.value.subPassword;
    let that = this;
    // 判断账号是否为空和判断该账号名是否被注册
    if ("" === util.trim(account)) {
      util.isError("账号不能为空", that);
      return;
    } else {
      util.clearError(that);
      app.ajax.req('/register/checkLoginName', {
        "loginName": account
      }, function (res) {
        if (!res) {
          util.isError("账号已经被注册过", that);
          return false;
        }
      });
    }
    // 判断密码是否为空
    if ("" === util.trim(password)) {
      util.isError("密码不能为空", that);
      return;
    } else {
      util.clearError(that);
    }
    // 两个密码必须一致
    if (subPassword !== password) {
      util.isError("输入密码不一致", that);
      return;
    } else {
      util.clearError(that);
    }
    // 验证都通过了执行注册方法
    app.ajax.req('/itdragon/register', {
      "account": account,
      "password": password
    }, function (res) {
      // let that = this
      if (true === res) {
        // 显示模态弹窗
        wx.showModal({
          title: '注册状态',
          content: '注册成功，请点击确定登录吧',
          success: function (res) {
            if (res.confirm) {
              // 点击确定后跳转登录页面并关闭当前页面
              wx.redirectTo({
                url: '../logining/logining?account=' + account + '&password?=' + password + ''
              })
            }
          }
        })
      } else {
        // 显示消息提示框
        // wx.showToast({
        //   title: '注册失败',
        //   icon: 'error',
        //   duration: 2000
        // })
        that.setData({
          count: 1500,
          toastText: '注册失败'
        });
        that.showToast();
      }
    });
  },
  // 自定义toast
  showToast: function () {
    let _this = this;
    // toast时间
    _this.data.count = parseInt(_this.data.count) ? parseInt(_this.data.count) : 3000;
    // 显示toast
    _this.setData({
      isShowToast: true,
    });
    // 定时器关闭
    setTimeout(function () {
      _this.setData({
        isShowToast: false
      });
    }, _this.data.count);
  },
});
