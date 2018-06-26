const app = getApp();
const util = require('../../utils/util.js');
const md5js = require('../../utils/md5.js');
const Promise = require('../../utils/es6-promise.min');
const showApi = require('../../component2/toastTest/toastTest');
let userData = wx.getStorageSync("user_data") || [];
let token = userData.token;
Page({
    data: {
        winWidth: 0,
        winHeight: 0,
        currentTab: 0,
        datalists: [],
        urgentList: [], //放置返回数据的数组  
        isFromlist: true,   // 用于判断datalists数组是不是空数组，默认true，空的数组  
        page_num: 1,   // 设置加载的第几次，默认是第一次  
        page_size: 10,      //返回数据的个数  
        listLoading: false, //"上拉加载"的变量，默认false，隐藏  
        listLoadingComplete: false  
    },
    onLoad: function (options) {
        new app.ToastPannel();
        let tab = 0;
        if (options.currentTab) {
            tab = options.currentTab
        }
        console.log(options);
        let that = this;
        //获取系统信息  
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    currentTab: tab,
                    winWidth: res.windowWidth,
                    winHeight: res.windowHeight
                });
            }
        });
    },
    onShow:function(){
        this.setData({
            page_num: 1,   //第一次加载，设置1  
            datalists: [],  //放置返回数据的数组,设为空  
            isFromlit: true,  //第一次加载，设置true  
            listLoading: true,  //把"上拉加载"的变量设为true，显示  
            listLoadingComplete: false //把“没有数据”设为false，隐藏  
        });
        this.fetchlist();  
    },
  
    onPullDownRefresh:function(){//下拉刷新
        app.onPullDownRefresh();
        this.setData({
            page_num: 1,   //第一次加载，设置1  
            datalists: [],  //放置返回数据的数组,设为空  
            isFromlit: true,  //第一次加载，设置true  
            listLoading: true,  //把"上拉加载"的变量设为true，显示  
            listLoadingComplete: false //把“没有数据”设为false，隐藏  
        })
        this.fetchlist();  
    },

    fetchlist:function(){
        let that = this;
        let status = "0";
        if (this.data.currentTab === 0){
            status = "0";
        } else if (this.data.currentTab === 1){
            status = "1";
        } else if (this.data.currentTab === 2) {
            status = "2";
        } else if (this.data.currentTab === 3) {
            status = "3";
        } else if (this.data.currentTab === 4){
            status = "5";
        }
        this.setData({
            status: status
        });
        let url = "/mobile/order/common_order/list";
        let order_by = "create_time DESC";
        let order_by_sign = "create_timeDESC";
        userData = wx.getStorageSync("user_data") || [];
        let customerId = userData.customer.cusUserId;
        let page_num = that.data.page_num,//把第几次加载次数作为参数  
            page_size = that.data.page_size; //返回数据的个数 
            token = userData.token;
            console.log(customerId, page_num, status, page_size)
            util.geturgentlist(url, token,customerId, page_num, page_size, status, order_by_sign, order_by, function (res){//订单状态更新
                console.log(res)
                if (res.code === "SUCCESS" && res.bizCode === 'OPER_SUCCESS'){  
                    if (res.data.pageInfo.list != 0 ){
                        let imgurl = app.domain_img;
                        let urgimgurl = [];
                        // let imgs = JSON.stringify(datas[i].targetImage)
                        let ugList = [];
                        that.data.isFromlist ? ugList = res.data.pageInfo.list : ugList = that.data.datalists.concat(res.data.pageInfo.list)
                        let datas = ugList;
                        console.log(datas);
                        //在绑定数据之前处理时间 然后再用setData绑定值
                        for (let i = 0; i < datas.length; i++) {
                            if (datas[i].targetImage.indexOf(imgurl)!==0){
                                let imgstr = datas[i].targetImage.toString();//将存放的图片转换成字符串形式
                                let imgArr = imgstr.split(",")//对图片进行分割并将每条记录中的图片存放至对象的数组中
                                datas[i].targetImage = imgurl + imgArr[0];//获取分割好的数组图片中的第一张并赋值
                                datas[i].createTime = util.formatTime(new Date(datas[i].createTime))// 时间戳转换
                                //通过that 拿到createTime的值for循环出来
                            }   
                        }
                        that.setData({
                            datalists: ugList, //将改好时间格式与图片遍历出来
                            listLoading: true,
                            // listLoadingComplete: false,
                        })
                    }else {
                        that.setData({
                            listLoadingComplete: true, //把“没有数据”设为true，显示  
                            listLoading: false  //把"上拉加载"的变量设为false，隐藏  
                        });
                    }
                }else if (res.code === "FAILURE" && res.bizCode === "INVALID_TOKEN"){
                    that.show(res.msg)
                    return false;
                } else{
                    //  that.setData({
                    //     listLoadingComplete: true, //把“没有数据”设为true，显示  
                    //     listLoading: false  //把"上拉加载"的变量设为false，隐藏  
                    // });
                    that.show(res.msg)
                    return false;
                }
            })
    },

    scrolltolower:function(){//上拉加载数据
        let that = this;
        if (that.data.listLoading && !that.data.listLoadingComplete) {
            that.setData({
                page_num: that.data.page_num + 1,  //每次触发上拉事件，把page_num+1  
                isFromlist: false  //触发到上拉事件，把isFromlist设为为false  
            });
            this.fetchlist();
        }
    },

    /** 
     * 滑动切换tab 
     */
    bindChange: function (e) {
        let that = this;
        that.setData({ currentTab: e.detail.current });
        //   this.setData({
        //     page_num: 1,   //第一次加载，设置1  
        //     datalists: [],  //放置返回数据的数组,设为空  
        //     isFromlit: true,  //第一次加载，设置true  
        //     listLoading: true,  //把"上拉加载"的变量设为true，显示  
        //     listLoadingComplete: false //把“没有数据”设为false，隐藏  
        //   });
        //   this.fetchlist();
        if (this.data.currentTab == 0) {
            this.setData({
                page_num: 1,   //第一次加载，设置1  
                datalists: [],  //放置返回数据的数组,设为空  
                isFromlit: true,  //第一次加载，设置true  
                listLoading: true,  //把"上拉加载"的变量设为true，显示  
                listLoadingComplete: false //把“没有数据”设为false，隐藏  
            })
            this.fetchlist();  
        } else if(this.data.currentTab == 1){
            this.setData({
                page_num: 1,   //第一次加载，设置1  
                datalists: [],  //放置返回数据的数组,设为空  
                isFromlit: true,  //第一次加载，设置true  
                listLoading: true,  //把"上拉加载"的变量设为true，显示  
                listLoadingComplete: false //把“没有数据”设为false，隐藏  
            })
            this.fetchlist();
        } else if (this.data.currentTab == 2) {
            this.setData({
                page_num: 1,   //第一次加载，设置1  
                datalists: [],  //放置返回数据的数组,设为空  
                isFromlit: true,  //第一次加载，设置true  
                listLoading: true,  //把"上拉加载"的变量设为true，显示  
                listLoadingComplete: false //把“没有数据”设为false，隐藏  
            })
            this.fetchlist();
        } else if (this.data.currentTab == 3) {
            this.setData({
                page_num: 1,   //第一次加载，设置1  
                datalists: [],  //放置返回数据的数组,设为空  
                isFromlit: false,  //第一次加载，设置true  
                listLoading: true,  //把"上拉加载"的变量设为true，显示  
                listLoadingComplete: false //把“没有数据”设为false，隐藏  
            })
            this.fetchlist();
        } else if (this.data.currentTab == 4) {
            this.setData({
                page_num: 1,   //第一次加载，设置1  
                datalists: [],  //放置返回数据的数组,设为空  
                isFromlit: false,  //第一次加载，设置true  
                listLoading: true,  //把"上拉加载"的变量设为true，显示  
                listLoadingComplete: false //把“没有数据”设为false，隐藏  
            })
            this.fetchlist();
        }
    },
  /** 
   * 点击切换tab 
   */
    swichNav: function (e) {
        console.log(e);
        let that = this;
        token = userData.token;
        if (this.data.currentTab === e.currentTarget.dataset.current) {
        //点击的是同一个，则不操作  
            return false;
        } else {
            that.setData({
                currentTab: e.currentTarget.dataset.current
            })
        }  
    },
    box_detail:function(e){
        let that = this;
        userData = wx.getStorageSync("user_data") || [];
        token = userData.token;
        console.log(e);
        let url = '/mobile/order/common_order/details';
        let orderId = e.currentTarget.dataset.orderid;//获取当前订单ID
        let sign = md5js.md5("{order_id="+ orderId + "}");
        let data = {
            "order_id": orderId
        };
        console.log("{order_id=" + orderId + "}");
        util.getpublicrequest(url, token, sign, data, function (res) {
            if (res.data.code === "SUCCESS" && res.data.bizCode === 'OPER_SUCCESS') {
                console.log(res);
                wx.navigateTo({
                    url: '../urgentdetail/urgentdetail?order_id=' + orderId,
                });
                let result = res.data.data;//将键值对放入返回的对象中
                result.orderType = "1";
            }else{
                console.log(res.data);
                return false;
            }
        },function(res){
            return false;
        })
  },

    paycancel: function (e) {//普通报修待支付--取消订单  
        console.log(e);
        let status = "";
        if (this.data.currentTab === 0) {
            status = "0";
        } else if (this.data.currentTab === 1) {
            status = "1";
        } else if (this.data.currentTab === 2) {
            status = "2";
        } else if (this.data.currentTab === 3) {
            status = "3";
        }  else {
            status = "5";
        }
        this.setData({
            status: status
        });
        wx.showModal({
        title: '提示',
        content: '确定取消该订单吗？',
        success: function (res) {
            let that = this;
            if (res.confirm) {
                // console.log('用户点击确定');
                // console.log(e);
                userData = wx.getStorageSync("user_data") || [];
                token = userData.token;
                let url = "/mobile/order/common_order/update";
                let orderId = e.currentTarget.dataset.orderid;//获取当前订单ID
                let customerId = userData.customer.cusUserId;
                console.log(orderId);
                let data = {
                    "customer_id": customerId,
                    "status_old": status,
                    "status": "4",
                    "order_id": orderId,
                };
                // console.log("{customer_id=" + customerId + ",status_old=" + status + ",status=4" + ",order_id=" + orderId + "}")
                let sign = md5js.md5("{customer_id=" + customerId + ",status_old=" + status + ",status=4" + ",order_id=" + orderId + "}")
                util.getpublicrequest(url, token, sign, data, function (res) {//普通报修状态跟新
                    console.log(res.data);
                    if (res.data.code === "SUCCESS" && res.data.bizCode === 'OPER_SUCCESS') {
                        wx.startPullDownRefresh();
                        wx.redirectTo({
                            url: './urgent?currentTab=0',
                        })
                    } else {
                        console.log(res.data);
                        return false;
                    }
                }, function (res) { })
            } else if (res.cancel) {
                console.log('用户点击取消');
                return false;
            }
        }
        })  
  },

  payorder:function(e){//普通报修待支付--立即支付
    let status = "";
    if (this.data.currentTab === 0) {
        status = "0";
    } else if (this.data.currentTab === 1) {
        status = "1";
    } else if (this.data.currentTab === 2) {
        status = "2";
    } else if (this.data.currentTab === 3) {
        status = "3";
    } else {
        status = "5";
    }
    this.setData({
      status: status
    });
    console.log(e);
    let logininfo = wx.getStorageSync('logininfo');
    userData = wx.getStorageSync("user_data") || [];
    // let result = JSON.parse(JSON.stringify(res.data))
    let openId = logininfo.openid;
    let orderType = "1";
    let orderId = e.currentTarget.dataset.orderid;
    console.log(openId);
    console.log(orderId);

    let params ={
      "order_id": orderId,
      "order_type": orderType,
      "pay_type": "2",
      "app_type": "3",
      "openid": openId
    };

    // let url = "/mobile/pay/get";
    // let sign = md5js.md5("{order_id=" + orderId + ",order_type=" + orderType + ",pay_type=2,app_type=3,openid=" + openId + "}");
    // token = userData.token;
    // console.log(token);

    // util.getpublicrequest(url, token, sign, data, function (res) {//普通订单支付请求
    app.post(app.url_commonOrderPay, params, function (res) {
        if (res.data.code = "SUCCESS" && res.data.bizCode === 'OPER_SUCCESS'){
            let mchid = 1486982342;
            let jsonObj = JSON.parse(JSON.stringify(res.data));
            // console.log(jsonObj);
            // console.log(jsonObj.data.paySignOrPrepayid);
            let packages = jsonObj.data.paySignOrPrepayid;
            let noncestrs = Math.random().toString(36).substr(2, 15);
            let timestamps = Date.parse(new Date());
            timestamps = timestamps / 1000;
            // console.log("当前时间戳为：" + timestamps);
            let stringA = 'appId=wxfc1b21407fd6879e' + '&nonceStr=' + noncestrs + '&package=prepay_id=' + packages + '&signType=MD5&timeStamp=' + timestamps + "&key=yuhaohulianwangkejiyouxiangongsi"
            let paysign = md5js.md5(stringA).toUpperCase();
            wx.requestPayment({
                'timeStamp': timestamps.toString(),
                'nonceStr': noncestrs,
                'package': 'prepay_id=' + packages,
                'signType': 'MD5',
                'paySign': paysign,
                'success': function (res) {
                    console.log(res);
                    userData = wx.getStorageSync("user_data") || [];
                    token = userData.token;
                    let url = "/mobile/order/common_order/update";
                    let orderId = e.currentTarget.dataset.orderid;//获取当前订单ID
                    let customerId = userData.customer.cusUserId;
                    // console.log(orderId);
                    let data = {
                        "customer_id": customerId,
                        "status_old": status,
                        "status": "1",
                        "order_id": orderId,
                    };
                    // console.log("{customer_id=" + customerId + ",status_old=" + status + ",status=1" + ",order_id=" + orderId + "}")
                    let sign = md5js.md5("{customer_id=" + customerId + ",status_old=" + status + ",status=1" + ",order_id=" + orderId + "}")
        
                    util.getpublicrequest(url, token, sign, data, function (res) {//普通报修订单状态更新
                        console.log(res);
                        //  let that = this;
                        //  that.setData({ 
                        //    status: "0",
                        //    currentTab: "1",
                        //  });
                        if (res.data.code === "SUCCESS" && res.data.bizCode === 'OPER_SUCCESS'){
                            wx.startPullDownRefresh();
                            wx.redirectTo({
                            url: './urgent?currentTab=1',
                            })
                        }else{
                            this.show(res.data.msg)
                            console.log(res.data);
                            return false;
                        }
                    }, function (res) {
                        return false;
                    });
                        console.log(res)
                },
                'fail': function (res) {
                    console.log(res)
                },
                'complete': function (res) {
                    console.log(res)
                }
            })   
        }else{
            this.shoe(res.data.msg)
            console.log(res.data)
        }
    },function(res){
        this.show(res.data.msg)
        return false;
    })
  },


    urgent_comfir:function(e){//普通报修待确认——确认订单
        let that = this;
        let order_id = e.currentTarget.dataset.orderid;
        let server_id = e.currentTarget.dataset.serverid;
        let customer_id = userData.customer.cusUserId;
        let status_old = 3;
        let status = 5;

        console.log('parans => ', token,order_id, customer_id);

        let params = {
            'order_id': order_id,
            'customer_id': customer_id,
            'status_old':status_old,
            'status': status
        };

        app.post(app.url_commonOrderUpdate, params, function ( res ) {
            if (res.data.code === 'SUCCESS' && res.data.bizCode === 'OPER_SUCCESS') {
                wx.showToast({
                    title: res.data.msg,
                    icon: 'success',
                    duration: 500
                });
                wx.navigateTo({
                    url: '../comment/comment?order_id=' + order_id +'&order_type=1&server_id='+ server_id,
                });
            }else{
                console.log(res.data);
                return false;
            }
        });
    },

    checkcomment:function(e){//查看评价
        let that = this;
        let order_id = e.currentTarget.dataset.orderid;
        let server_id = e.currentTarget.dataset.serverid;
        let customer_id = userData.customer.cusUserId;
        wx.navigateTo({
            url: '../checkcomment/checkcomment?order_id=' + order_id + '&order_type=1&server_id=' + server_id,
        })
    },
    comment:function(e){//评价订单
        let that = this;
        let order_id = e.currentTarget.dataset.orderid;
        let server_id = e.currentTarget.dataset.serverid;
        let customer_id = userData.customer.cusUserId;
        let status_old = 5;
        let status = 5;
        console.log('params => ', token, order_id, customer_id, server_id);
        let params = {
            'order_id': order_id,
            'customer_id': customer_id,
            'status_old': status_old,
            'status': status
        };
        app.post(app.url_commonOrderUpdate, params, function (res) {
        if (res.data.code === 'SUCCESS' && res.data.bizCode === 'OPER_SUCCESS') {
            wx.showToast({
                title: res.data.msg,
                icon: 'success',
                duration: 500
            });
            wx.navigateTo({
                url: '../comment/comment?order_id=' + order_id + '&order_type=1&server_id=' + server_id,
            });
        }else{
            console.log(res.data);
            return false;
        }
        });
    }
}) 