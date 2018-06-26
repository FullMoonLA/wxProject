// component2/qrcode/qrcode.js
// pages/qrcode/qrcode.js
/**
 * https://github.com/demi520/wxapp-qrcode
 */
const QR = require("../../utils/qrcode.js");
const Promise = require('../../utils/es6-promise.min');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    codeImg: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    console.log('qrcode.js => onLoad => 携带参数： ', options);

    let orderId = options.orderId;
    let serverId = options.serverId;

    let qrcodeParam = 'orderId=' + orderId + ' serverId=' + serverId;

    let size = {};
    try {
      let res = wx.getSystemInfoSync();
      console.log(res);
      let scale = 750 / 400;//不同屏幕下canvas的适配比例；设计稿是750宽
      // 正方形
      size.w = res.windowWidth / scale;
      size.h = res.windowHeight / scale;

      new Promise(function (resolve, reject) {
        //调用插件中的draw方法，绘制二维码图片
        QR.api.draw(qrcodeParam, 'qrcode', size.w, size.h);
        resolve();
      }).then(function () {
        wx.canvasToTempFilePath({
          canvasId: 'qrcode',
          success: function (res) {
            let tempFilePath = res.tempFilePath;
            console.log('qrcode.js => onLoad => 缓存订单二维码路径： ' + tempFilePath);
            that.setData({
              codeImg: tempFilePath,
              // canvasHidden:true
            });
          },
          fail: function (res) {
            console.log('qrcode.js => onLoad => 获取缓存订单二维码路径失败： ' + res);
          }
        });
      });

    } catch (e) {
      console.log('qrcode.js => onLoad => 设备信息获取失败 => ' + e);
    }

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
});

// Component({
//   properties: {
//     codeHidden: {
//       type: Boolean,
//       value: true
//     },
//   },
//   methods: {
//     codecancle: function () {
//       this.setData({
//         codeHidden:true
//       })
//     }
//   }
// })
