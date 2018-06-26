// pages/aftersalsedetail/aftersaledetail.js
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
    zero:true,
    one:true,
    two:true,
    three:true,
    four:true,
    five: true,
    starScore:false,
    navbar: ['报修信息', '完修信息'],
    currentTab: 0,
    hidden: true,
    orderId: "",
    Status:"",
    detailsList:[]
  },
  /**
   * 生命周期函数--监听页面加载
   */
    onLoad: function (options) {
        new app.ToastPannel();
        let that = this;
        this.setData({
            orderId: options.orderId
        });
        let orderid = this.data.orderId;
        let userData = wx.getStorageSync("user_data") || [];
        let params = {
            "orderId": orderid
        };
        app.post(app.url_afterOrderDetail, params, function (res) {
            if (res.data.code == "SUCCESS" && res.data.bizCode == 'OPER_SUCCESS') {
                console.log(res);
                let imgurl = app.domain_img;
                let datas = res.data.data;
                if (datas.proofImage.indexOf(imgurl) !== 0 || datas.targetImage.indexOf(imgurl) !== 0) {
                    if (datas.targetImage === "") {
                        let imgstr = datas.proofImage.toString();//将存放的图片转换成字符串形式
                        let imgArr = imgstr.split(",");//对图片进行分割并将每条记录中的图片存放至对象的数组中
                        //   datas.proofImage = imgurl + imgArr[0];//获取分割好的数组图片中的第一张并赋值
                        let imgNew = [];
                        for (let index in imgArr) {
                            imgNew.push(imgurl + imgArr[index])
                        }
                        if (datas.detailsList !== 0) {
                            that.setData({
                                detailsList: datas.detailsList,
                                proofImage: imgNew
                            })
                        }
                        that.setData({
                            details: datas, //将改好时间格式与图片遍历出来
                        })
                    }else{
                        let imgstr = datas.proofImage.toString();//将存放的图片转换成字符串形式
                        let imgArr = imgstr.split(",");//对图片进行分割并将每条记录中的图片存放至对象的数组中
                        let imgNew = [];
                        for (let index in imgArr) {
                            imgNew.push(imgurl + imgArr[index])
                        }
                        // datas.createTime = util.formatTime(new Date(datas.createTime))// 时间戳转换
                        //通过that 拿到createTime的值for循环出来
                        let tarimgstr = datas.targetImage.toString();
                        let tarimgArr = tarimgstr.split(",");
                        datas.targetImage = imgurl + tarimgArr[0];
                        //   console.log(imgArr);
                        //   console.log(datas.proofImage);
                        if (datas.detailsList !== 0) {
                            that.setData({
                                detailsList: datas.detailsList,
                                proofImage: imgNew
                            })
                        }
                        that.setData({
                            details: datas, //将改好时间格式与图片遍历出来
                        })
                    }   
                }
                // if (datas.detailsList != 0){
                //  that.setData({
                //    detailsList: datas.detailsList,
                //  })
                // }
                that.setData({
                    details: datas, //将改好时间格式与图片遍历出来
                    Status: datas.status
                });
                console.log(datas)
            }else{
                console.log(res.data.msg)
                return false;
            }
        }, function (res) {
            return false;
        })
    },

    previewImg: function (e) {
        let imgstr = this.data.details.proofImage.toString();//将存放的图片转换成字符串形式
        let imgArr = imgstr.split(",");//对图片进行分割并将每条记录中的图片存放至对象的数组中
        // console.log(e);
        // console.log(imgstr);
        // console.log(imgArr);
        //获取当前图片的下标
        let index = e.currentTarget.dataset.src;
        //所有图片
        wx.previewImage({
            //当前显示图片
            current: index,
            //所有图片
            urls: this.data.proofImage
        })
    },
    previewImg2:function(e){
        let tarimgstr = this.data.details.targetImage.toString();//将存放的图片转换成字符串形式
        let tarimgArr = tarimgstr.split(",");//对图片进行分割并将每条记录中的图片存放至对象的数组中
        //获取当前图片的下标
        let index = e.currentTarget.dataset.src;
        //所有图片
        wx.previewImage({
            //当前显示图片
            current: index,
            //所有图片
            urls: tarimgArr
        })
    },

    navbarTap: function (e) {//售后报修信息、完修信息切换
        let that = this;
        if (that.data.Status === 1 || that.data.Status === 0) {
            if (e.currentTarget.dataset.idx === 1) {
                that.show("暂无完修信息")
            }
        } else {
            if (that.data.Status === 3){
                let that = this;
                // 星级评分获取
                let userData = wx.getStorageSync("user_data") || [];
                console.log(userData);
                let orderid = this.data.orderId;
                let params = {
                    "order_id": orderid,
                    "order_type":2,
                };
                
                app.post(app.url_orderCriticGet, params, function (res) {
                // util.getpublicrequest(url, token, sign, data, function(res){
                    if (res.data.code === "SUCCESS" && res.data.bizCode === "OPER_SUCCESS"){
                        console.log(res);
                        // let starScore = res.data.data.grade;
                        // for (let i = 0; i < starScore.length; i++){
                        //   starScore[i].pingfenpic = pingxin.pingfen(parseFloat(starScore[i].pingfen));
                        // }
                        that.setData({
                            starScore: res.data.data.grade
                        });
                        if (res.data.data.grade === 1 ){
                            that.setData({
                                one: false
                            })
                        } else if (res.data.data.grade === 2){
                            that.setData({
                                two: false
                            })
                        } else if (res.data.data.grade === 3){
                            that.setData({
                                three: false
                            })
                        } else if (res.data.data.grade === 4) {
                            that.setData({
                                four: false
                            })
                        } else if (res.data.data.grade === 5) {
                            
                        }else{
                            that.setData({
                                zero: false
                            })
                        }
                            console.log(res.data.data.grade)
                    }else{
                        return false;
                    }
                },function(res){})
            }
            this.setData({
                currentTab:1,
                imgs: [],
                currentTab: e.currentTarget.dataset.idx
            })
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
})