// "pages/ckeckcomment/ckeckcomment", 
let util = require('../../utils/util.js');
let md5js = require('../../utils/md5.js');
const Promise = require('../../utils/es6-promise.min');
let userData = wx.getStorageSync("user_data")||[];
let token = userData.token;
let app = getApp();
Page({
  data: {
    usdataimg:"",
    userImg: "../../images/default_head@2x.png", // 头像图片路径  
    actionSheetHidden: true, // 是否显示底部可选菜单  
    actionSheetItems: [
      { bindtap: 'changeImage', txt: '修改头像' },
      { bindtap: 'viewImage', txt: '查看头像' }
    ] // 底部可选菜单  
  },
  
  onLoad: function (options) {
    let app = getApp();
    new app.ToastPannel();
    userData = wx.getStorageSync("user_data");
    let that = this;
    if (userData == "" || userData == '[]' || userData == null) {
        // that.show("请重新登录")
      return false;
    }else{
      that.setData({
        usdataimg: userData.customer.image
      })
    }
    wx.getSystemInfo({//获取设备信息
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    });
    // let that = this;
    // userData = wx.getStorageSync("user_data") || [];// 异步获取登录用户本地缓存数据
    // token = userData.token
    // console.log(userData)
    // if (userData == "" || userData == '[]' || userData == null) {
    //   that.setData({
    //     content: "请先登录"
    //   })
    //   that.show(that.data.content)
    //   return false;
    //   } else {
    //     console.log(userData)
    //     console.log(userData.customer.name)
    //     let loginname = userData.customer.name
    //     let loginphone = userData.customer.phone
    //     let loginimg = userData.customer.image
    //     console.log(loginimg)
    //     that.setData({
    //       userImg: 'https://bossdream.oss-cn-shenzhen.aliyuncs.com/' + loginimg,
    //       loginstatu: loginname,
    //       phone: loginphone
    //     })
    //   }
    
    // let that = this;
    // userData = wx.getStorageSync("user_data") || [];// 异步获取登录用户本地缓存数据
    // token = userData.token
    // if (userData == "") {
    //   that.setData({
    //     content: "请先登录"
    //   })
    //   that.show(that.data.content)
    // } else {
    //   let loginname = userData.customer.name
    //   let loginphone = userData.customer.phone
    //   let loginimg = userData.customer.image
    //   console.log(loginimg)
    //   that.setData({
    //     userImg: 'http://www.bossdream.cn/' + loginimg,
    //     loginstatu: loginname,
    //     phone: loginphone
    //   })
    // }



    // if (userData.customer.image == ""){
    //   userImg:[]
    // }else{
    //   that.setData({
    //     userImg: [userData.customer.image]
    //   })
    // }
  },
    onShow:function (){
        let that = this;
        userData = wx.getStorageSync("user_data") || [];// 异步获取登录用户本地缓存数据
        token = userData.token
        if (userData == "" || userData == '[]' || userData == null) {
            that.show("请先登录")
        } else {
            console.log(userData.customer)
            let loginname = userData.customer.name
            let loginphone = userData.customer.phone
            // let loginimg = userData.customer.image
            let loginimg = that.data.usdataimg
            console.log(loginimg)
            that.setData({
                userImg: app.domain_img + loginimg,
                loginstatu: loginname,
                phone: loginphone
            })
            console.log(that.data.userImg)
        }
    },

    onPullDownRefresh: function () {
        app.onPullDownRefresh()
    },

  // 普通
    bindurgent:function(){
        if (userData==""){
            this.show("请先登录")
        }else{
        wx.navigateTo({
            url: '../urgent/urgent',
        })
        }
    },

  // 售后
    bindaftersale:function(){
        if (userData==""){
            this.show("请先登录")
        }else{
        wx.navigateTo({
        url: '../aftersalserepair/aftersalserepair',
        })
        }
    },

    //我的门店维修记录
    reprecord:function(){

        if (userData == "") {
            this.show("请先登录")
        } else {
            wx.navigateTo({
                url: '../storereprecode/storereprecode',
            })
        }
    },

  // 点击头像 显示底部菜单  
  clickImage: function () {
    if(userData==""){
     this.show("请先登录")
    }else{
    let that = this;
    this.setData({
      actionSheetHidden: !that.data.actionSheetHidden
    })
    }
  },
  // 点击其他区域 隐藏底部菜单  
  actionSheetbindchange: function () {
    let that = this;
    that.setData({
      actionSheetHidden: !that.data.actionSheetHidden
    })
  },
  // 上传头像  
  changeImage: function () {
    let that = this;
    wx.chooseImage({
      count: 1, // 默认9  
      sizeType: ['original', 'compressed'], 
      sourceType: ['album', 'camera'], 
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片，只有一张图片获取下标为0  
        let tempFilePaths = res.tempFilePaths[0];
        that.setData({                                                                
          userImg: tempFilePaths,
          actionSheetHidden: !that.data.actionSheetHidden
        })
        console.log(tempFilePaths)
        util.uploadFile('/mobile/upload/put', tempFilePaths, 'files',{
          'token': token,
          "save_dir": 'pic/head',
        }, function (res) {
          wx.showToast({
            title: '上传中...',
            icon: "loading"
          })
          let result = JSON.parse(res)
          that.setData({
            userImg: app.domain_img  + result.data.targetImage,
            usdataimg: result.data.targetImage
          })
          console.log("结果" + result.data.targetImage)
          userData = wx.getStorageSync("user_data")
          console.log(userData)
          let userid = userData.customer.cusUserId
          let image = result.data.targetImage
          wx.setStorageSync("img", image)
          // let cusUserName = userData.customer.name
          // let province = userData.customer.province
          // let city = userData.customer.city
          // let district = userData.customer.district
          // let address = userData.customer.address
          // let email = userData.customer.email
          // let phone = userData.customer.phone
          // let password = userData.customer.password
          console.log(userid)
          console.log(image)
          console.log("{cusUserId=" + userid + ",image=" + image + "}")
          let sign = md5js.md5("{cusUserId=" + userid + "," + "image=" + image + "}")
          // let params = {'cusUserId': userid , 'image':image }
          // app.post(app.url_UserCustomerEdit, params, function (res) {
            
          // },function(res){})
            wx.request({
              url: app.url_UserCustomerEdit,
              data: {
                "sign": sign,
                "token": token,
                "params": {
                  "cusUserId": userid,
                  "image": image
                }
              },
              method: 'post',
              header: {
                'Content-Type': 'application/json' // 默认值
              },
              success: function (res) {
                console.log(res)
                if (res.data.code == "SUCCESS"){
                  let userimg = wx.getStorageSync("img")
                  // let resultimg = usetimg.customer.image
                  console.log(userimg)
                  that.setData({
                    userImg: app.domain_img  + userimg,
                    usdataimg: userimg
                  })
                }else{
                 that.show("上传失败")
                }
              }
              
            })
          //console.log(JSON.stringify(res));
          // let result = JSON.parse(res);
          // let resultimg = result.data.targetImage
          // console.log(result.data.targetImage)
          // if (null != res) {
          //   userData = wx.getStorageSync("user_data")
          //   console.log(userData)
          //  // console.log(res.data)
          //   // let resultimg = userData.customer.image
          //   that.setData({
          //     userImg: 'https://bossdream.oss-cn-shenzhen.aliyuncs.com/' + resultimg
          //   })
          // } else {
          //   // 显示消息提示框  
          //   wx.showToast({
          //     title: '上传失败',
          //     icon: 'error',
          //     duration: 2000
          //   })
          // }
        });
      }
    })
  },
  // 查看原图  
  viewImage: function () {
    let that = this;
    wx.previewImage({
      current: '', // 当前显示图片的http链接  
      urls: [that.data.userImg] // 需要预览的图片http链接列表  
    })
  },

  signout:function(){
    let userData = wx.getStorageSync('user_data')||[];
    // wx.request({
    //   url: 'https://www.yhwxxt.com/mobile/commons/auth/signout',
    //   data: {
    //     "sign": sign,
    //     "token": token,
    //       "params": {
    //         "cusUserId":userID
    //       },
    //     method: 'post',
    //     header: {
    //       'content-type': 'application/json' // 默认值
    //     },
    //     success: function (res) {
    //       console.log(res.data)
    //       wx.showToast({
    //         title: res.data.msg,
    //       })
    //       // wx.redirectTo({
    //       //   url: '../logining/logining',
    //       // })
    //       // wx.clearStorageSync('user_data')
    //     }
    //   }
    // })
    if (userData == ""){
      let that = this
        that.show("请先登录")
    }else{
      let userID = userData.customer.cusUserId;
      let token = userData.token;
      let sign = md5js.md5("{cusUserId=" + userID + "}");
    wx.request({
      url: app.url_signout,
      data: {
        "sign": sign,
        "token": token,
        "params": {
          "cusUserId": userID
        }
      },
      method: 'post',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log("res=====" + JSON.stringify(res))
        console.log(res.data)
        // wx.showToast({
        //   title: res.data.msg,
        // })
        wx.redirectTo({
          url: '../logining/logining',
        })
        wx.clearStorageSync('user_data')
      }
    })
    }
  }
});  