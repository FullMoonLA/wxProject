// pages/checkcomment/checkcomment.js
const Promise = require('../../utils/es6-promise.min');
const util = require('../../utils/util.js');
const md5js = require('../../utils/md5.js');
const showApi = require('../../component2/toastTest/toastTest');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
    data: {
        zero: true,
        one: true,
        two: true,
        three: true,
        four: true,
        five: true,
        starScore: false,
        order_id: '',
        order_type: '',
        server_id: '',
    },
  /**
   * 生命周期函数--监听页面加载
   */
    onLoad: function (options) {
        let that = this;
        new app.ToastPannel();
        let order_id = options.order_id;
        let order_type = options.order_type;
        let server_id = options.server_id;
        let target_id = server_id;
        let userData = app.getUserData();
        let token = app.getToken();
        console.log('跳转评论携带参数 ==> onloand: ', order_id, order_type, server_id);
        // this.setData({
        //   order_id: order_id,
        //   order_type: order_type,
        //   server_id: server_id
        // });
        let params = {
        'order_id': order_id,
        'order_type': order_type,
        // 'critic_user_id': userData.customer.cusUserId,
        // 'critic_user_type': 1,
        // 'target_id': target_id,
        // 'server_id': server_id,
        };
    
        console.log('提交参数 ==> onloand: ', order_id, order_type, userData.customer.cusUserId,server_id);

        app.post(app.url_orderCriticGet, params, function (res) {
        console.log(res.data);
            if (res.data.code === "SUCCESS" && res.data.bizCode === "OPER_SUCCESS") {
                console.log(res.data)
                let imgurl = app.domain_img
                let datas = res.data.data;
                let str = res.data.data.userView.toString();
                let strs = str.split(",");
                console.log(strs)
                datas.criticTime = util.formatTime(new Date(datas.criticTime))// 时间戳转换
                datas.userView = strs
                let userimg = imgurl + strs[1]
                that.setData({
                    infocomment: datas,
                    userView : userimg,
                    starScore: res.data.data.grade
                });
                if (res.data.data.grade == 1) {
                    that.setData({
                        one: false
                    })
                } else if (res.data.data.grade == 2) {
                    that.setData({
                        two: false
                    })
                } else if (res.data.data.grade == 3) {
                    that.setData({
                        three: false
                    })
                } else if (res.data.data.grade == 4) {
                    that.setData({
                        four: false
                    })
                } else if (res.data.data.grade == 5) {
                    that.setData({
                        five: false
                    })
                } else {
                    that.setData({
                        zero: false
                    })
                }
            } else {
                    console.log(res.data)
                    return false;
            }
        })


    },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})