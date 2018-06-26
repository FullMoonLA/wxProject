// pages/comment/comment.js
const Promise = require('../../utils/es6-promise.min');
const util = require('../../utils/util.js');
const md5js = require('../../utils/md5.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_id: '',
    order_type: '',
    server_id: '',
    stars:"../../images/star_icon.png",
    star: 0,
    starMap: [
      '1',
      '2',
      '3',
      '4',
      '5',
    ],
  },
  myStarChoose(e) {
    let star = parseInt(e.target.dataset.star) || 0;
    this.setData({
      star: star,
    });
    console.log(star)
  },
    formSubmit:function( e ){//提交评价
      let that = this;
      let userData = app.getUserData();
      let token = app.getToken();
      let order_id = this.data.order_id;
      let order_type = this.data.order_type;
      let server_id = this.data.server_id;
      let target_id = server_id;
      let grade = this.data.star;
      let content = e.detail.value.content;

      let params = {
          'order_id': order_id,
          'order_type': order_type,
          'critic_user_id': userData.customer.cusUserId,
          'critic_user_type': 0,
          'server_id': server_id,
          'target_id': target_id,
          'user_view': userData.customer.name + ',' + userData.customer.image,
          'grade': grade,
          'content': content
      };

      console.log('提交参数 ==> onloand: ', order_id, order_type, server_id);

        app.post(app.url_orderCriticAdd, params, function ( res ) {
          console.log(res.data);
            if (res.data.code === "SUCCESS" && res.data.bizCode === "OPER_SUCCESS"){
                if(that.data.order_type == 1){
                wx.redirectTo({
                    url: '../urgent/urgent?currentTab=4',
                })
                } else if (that.data.order_type == 2){
                wx.redirectTo({
                    url: '../aftersalserepair/aftersalserepair?currentTab=2',
                })
                }
            }else{
                console.log(res.data)
                that.show("提交评论失败")
                return false;
            }
        })
    },

  /**
   * 生命周期函数--监听页面加载
   */
    onLoad: function (options) {
        new app.ToastPannel();
        let order_id = options.order_id;
        let order_type = options.order_type;
        let server_id = options.server_id;

        console.log('跳转评论携带参数 ==> onloand: ', order_id, order_type, server_id);

        this.setData({
            order_id: order_id,
            order_type: order_type,
            server_id: server_id
        });
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

  chooseicon: function (e) {
    let strnumber = e.target.dataset.id;
    let _obj = {};
    _obj.curHdIndex = strnumber;
    this.setData({
      tabArr: _obj
    });
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