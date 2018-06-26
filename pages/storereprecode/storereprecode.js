// pages/storereprecode/storereprecode.js
let util = require('../../utils/util.js');
// let md5js = require('../../utils/md5.js');
const Promise = require('../../utils/es6-promise.min');
let userData = wx.getStorageSync("user_data") || [];
let token = userData.token;
let showApi = require('../../component2/toastTest/toastTest');
let app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        winWidth: 0,
        winHeight: 0,
        currentTab: 0,
        datalists: [],
        // isMonthPay: "",
        isFromlist: true,   // 用于判断datalists数组是不是空数组，默认true，空的数组
        page_num: 1,   // 设置加载的第几次，默认是第一次
        page_size: 10,      //返回数据的个数
        listLoading: false, //"上拉加载"的变量，默认false，隐藏
        listLoadingComplete: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let app = getApp();
        new app.ToastPannel();
        let that = this;
        //获取系统信息
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    winWidth: res.windowWidth,
                    winHeight: res.windowHeight
                });
            }
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
        this.setData({
            page_num: 1,   //第一次加载，设置1
            datalists: [],  //放置返回数据的数组,设为空
            isFromlit: true,  //第一次加载，设置true
            listLoading: true,  //把"上拉加载"的变量设为true，显示
            listLoadingComplete: false //把“没有数据”设为false，隐藏
        })
        this.fetchReplist();
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
        app.onPullDownRefresh()
        this.setData({
            page_num: 1,   //第一次加载，设置1
            datalists: [],  //放置返回数据的数组,设为空
            isFromlit: true,  //第一次加载，设置true
            listLoading: true,  //把"上拉加载"的变量设为true，显示
            listLoadingComplete: false //把“没有数据”设为false，隐藏
        })
        this.fetchReplist();
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
    
    },


    fetchReplist: function () {
        let that = this
        let status = "0";  
        userData = wx.getStorageSync("user_data") || [];
        let storeId = userData.customer.storeId
        let page_num = that.data.page_num;//把第几次加载次数作为参数
        let page_size = that.data.page_size; //返回数据的个数
        let params = {
            "storeId": storeId,
            "status": status,
            "pageNum": page_num,
            "page_size": page_size
        }

        app.post(app.url_afterOrderList, params, function (res) {//获取售后维修列表
            console.log(res)
            if (res.data.code === "SUCCESS" && res.data.bizCode === "OPER_SUCCESS") {
                if (res.data.data.orderList != 0) {
                    let imgurl = app.domain_img
                    let urgimgurl = []
                    // let imgs = JSON.stringify(datas[i].targetImage)
                    let repList = [];
                    that.data.isFromlist ? repList = res.data.data.orderList : repList = that.data.datalists.concat(res.data.data.orderList)
                    let datas = repList
                    //在绑定数据之前处理时间 然后再用setData绑定值
                    for (let i = 0; i < datas.length; i++) {
                        if (datas[i].proofImage.indexOf(imgurl) != 0) {
                            let imgstr = datas[i].proofImage.toString();//将存放的图片转换成字符串形式
                            let imgArr = imgstr.split(",")//对图片进行分割并将每条记录中的图片存放至对象的数组中
                            datas[i].proofImage = imgurl + imgArr[0];//获取分割好的数组图片中的第一张并赋值
                            // datas[i].createTime = util.formatTime( new Date( datas[i].createTime ) )// 时间戳转换
                            //通过that 拿到createTime的值for循环出来
                        }
                    }
                    that.setData({
                        datalists: repList, //将改好时间格式与图片遍历出来
                        listLoading: true,
                        // listLoadingComplete: false,
                    })
                } else {
                    that.setData({
                        listLoadingComplete: true, //把“没有数据”设为true，显示  
                        listLoading: false  //把"上拉加载"的变量设为false，隐藏  
                    });
                }

            } else if (res.data.code === "FAILURE" && res.data.bizCode === "INVALID_TOKEN") {
                that.show(res.data.msg)
                return false;
            } else {
                that.show(res.data.msg)
                return false;
            }
        }, function (res) {
            return false;
        })
    },

    scrolltolower: function () {//上拉加载数据
        let that = this;
        if (that.data.listLoading && !that.data.listLoadingComplete) {
            that.setData({
                page_num: that.data.page_num + 1,  //每次触发上拉事件，把page_num+1
                isFromlist: false  //触发到上拉事件，把isFromlist设为为false
            });
            that.fetchReplist();
        }
    },

    paycancel: function (e) {//售后待服务取消订单
        let status = 0;
        // if (this.data.currentTab == 0) {
        //     status = "1";
        // } else if (this.data.currentTab == 1) {
        //     status = "2";
        // } else if (this.data.currentTab == 2) {
        //     status = "3";
        // }
        // this.setData({
        //     status: status
        // });
        wx.showModal({
            title: '提示',
            content: '确定取消该订单吗？',
            success: function (res) {
                let that = this
                if (res.confirm) {
                    console.log('用户点击确定')
                    console.log(e)
                    userData = wx.getStorageSync("user_data") || [];
                    let orderId = e.currentTarget.dataset.orderid;//获取当前订单ID
                    let customerId = userData.customer.cusUserId;
                    console.log(orderId)
                    let params = {
                        "orderId": orderId,
                        "status": "4",
                        "oldStatus": status,
                    }
                 
                    app.post(app.url_afterOrderUpdata, params, function (res) {//订单状态更新
                        console.log(res.data)
                        if (res.data.code == "SUCCESS" && res.data.bizCode == "OPER_SUCCESS") {
                            wx.startPullDownRefresh();
                            wx.redirectTo({
                                url: './aftersalserepair?currentTab=0',
                            })
                            console.log(res.data)
                        } else {
                            console.log(res.data)
                            return false;
                        }
                    }, function (res) {

                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                    return false;
                }
            }
        })
    },

    box_detail: function (e) {//查看售后订单详情
        // userData = wx.getStorageSync("user_data") || [];
        // token = userData.token
        // console.log(e)
        // let url = '/mobile/order/aftersale_order/details'
        let orderId = e.currentTarget.dataset.orderid;//获取当前订单ID
        // let sign = md5js.md5("{orderId=" + orderId + "}")
        // let data = {
        //     "orderId": orderId
        // }
        // console.log("{orderId=" + orderId + "}")
        wx.navigateTo({
            url: '../aftersaledetail/aftersaledetail?orderId=' + orderId,
        })
     
    },

    payorder: function (e) {//获取二维码
        console.log('aftersalerepair.js => payorder => 打开二维码获取参数: ', e.target.dataset);
        let orderId = e.target.dataset.orderid;
        let serverId = e.target.dataset.serverid;
        let arrivalTime = e.target.dataset.arrivaltime;
        wx.navigateTo({
            url: '../qrcode/qrcode?orderId=' + orderId + '&serverId=' + serverId + '&arrivalTime=' + arrivalTime,
        })
    },

})