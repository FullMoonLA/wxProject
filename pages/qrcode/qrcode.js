// pages/qrcode/qrcode.js
/**
 * https://github.com/demi520/wxapp-qrcode
 */
const QR = require( "../../utils/qrcode.js" );
const Promise = require( '../../utils/es6-promise.min' );
Page( {

    /**
     * 页面的初始数据
     */
    data: {
        codeImg: '',
        orderId:'',
        serverId:'',
        arrivalTime: ''

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function ( options ) {
      let that = this;
      console.log('qrcode.js => onLoad => 携带参数： ', options);
      
      that.setData({
        orderId:options.orderId,
        serverId:options.serverId,
        arrivalTime:options.arrivalTime
      })

      // let orderId = options.orderId;
      // let serverId = options.serverId;
      // let arrivalTime = options.arrivalTime;

      if (that.data.arrivalTime == 0){
        console.log("onshow===00=====" +that.data.arrivalTime)
        let qrcodeParam = 'sign orderId=' + that.data.orderId + ' serverId=' + that.data.serverId;
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
   
      } else if (that.data.arrivalTime != 0){
        console.log("onload===11=====" +that.data.arrivalTime)
        let qrcodeParam = 'orderId=' + that.data.orderId + ' serverId=' + that.data.serverId;

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
    onShow: function (e) {
      let orderId = this.data.orderId;
      let serverId = this.data.serverId;
      let arrivalTime = this.data.arrivalTime;
      if (arrivalTime == 0) {
        console.log("onshow===00=====" + arrivalTime)
        let qrcodeParam = 'sign orderId=' + orderId + ' serverId=' + serverId;
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

      } else if (arrivalTime != 0) {
        console.log("onshow==11====="+ arrivalTime)
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

      }

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
} );