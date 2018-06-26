let util = require( '../../utils/util.js' );
let md5js = require( '../../utils/md5.js' );
let userData = wx.getStorageSync( "user_data" ) || [];
let token = userData.token;
let showApi = require( '../../component2/toastTest/toastTest' );
let app = getApp();
Page( {
    data: {
        winWidth: 0,
        winHeight: 0,
        currentTab: 0,
        datalists: [],
        isMonthPay:"",
        isFromlist: true,   // 用于判断datalists数组是不是空数组，默认true，空的数组
        page_num: 1,   // 设置加载的第几次，默认是第一次
        page_size: 10,      //返回数据的个数
        listLoading: false, //"上拉加载"的变量，默认false，隐藏
        listLoadingComplete: false
    },
    onLoad: function ( options ) {
        let app = getApp();
        new app.ToastPannel();
        let that = this;
        let tab = 0;
        if (options.currentTab) {
            tab = options.currentTab;
            that.setData({
                currentTab: options.currentTab
            })
        }
        //获取系统信息
        wx.getSystemInfo( {
            success: function ( res ) {
                that.setData( {
                    winWidth: res.windowWidth,
                    winHeight: res.windowHeight
                } );
            }
        } );
    },

    onShow: function () {
        this.setData( {
            page_num: 1,   //第一次加载，设置1
            datalists: [],  //放置返回数据的数组,设为空
            isFromlit: true,  //第一次加载，设置true
            listLoading: true,  //把"上拉加载"的变量设为true，显示
            listLoadingComplete: false //把“没有数据”设为false，隐藏
        } )
        this.fetchReplist();
    },

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

    fetchReplist: function () {
        let that = this
        let status = "";
        if ( this.data.currentTab == 0 ) {
            status =  "1";
        } else if ( this.data.currentTab == 1 ) {
            status = "2";
        } else {
            status = "3";
        }
        that.setData( {
            status: status
        } );
        userData = wx.getStorageSync( "user_data" ) || [];
        // token = userData.token;
        // let url = "/mobile/order/aftersale_order/list"
        // let storeId = userData.customer.storeId
        let customerId = userData.customer.cusUserId;
        let page_num = that.data.page_num;//把第几次加载次数作为参数
        let page_size = that.data.page_size; //返回数据的个数
        // let sign = md5js.md5( "{cusUserId=" + customerId + ",status=" + status + ",pageNum=" + page_num + ",page_size=" + page_size + "}" )
        let params = {
            "cusUserId": customerId,
            "status": status,
            "pageNum": page_num,
            "page_size": page_size
        }
        // console.log( "{cusUserId=" + customerId + ",status=" + status + ",pageNum=" + page_num + ",page_size=" + page_size + "}" )
        // util.getpublicrequest( url, token, sign, data, function ( res ) {//获取售后维修列表
        app.post(app.url_afterOrderList, params, function (res) {//获取售后维修列表
            console.log( res )
            // if (res.data.code == "SUCCESS" && res.data.bizCode == "OPER_SUCCESS"){
            if (res.data.code === "SUCCESS" && res.data.bizCode === "OPER_SUCCESS" ) {
                if (res.data.data.orderList != 0){
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
                }else {
                    that.setData({
                        listLoadingComplete: true, //把“没有数据”设为true，显示  
                        listLoading: false  //把"上拉加载"的变量设为false，隐藏  
                    });
                }
 
            } else if (res.data.code === "FAILURE" && res.data.bizCode === "INVALID_TOKEN") {
                that.show(res.data.msg)
                return false;
            }else{
                that.show(res.data.msg)
                // that.setData({
                //     listLoadingComplete: true, //把“没有数据”设为true，显示
                //     listLoading: false  //把"上拉加载"的变量设为false，隐藏
                // })
                return false;
            }
        }, function ( res ) {
          return false;
        } )
    },

    scrolltolower: function () {//上拉加载数据
        let that = this;
        if ( that.data.listLoading && !that.data.listLoadingComplete ) {
            that.setData( {
                page_num: that.data.page_num + 1,  //每次触发上拉事件，把page_num+1
                isFromlist: false  //触发到上拉事件，把isFromlist设为为false
            } );
            that.fetchReplist();
        }
    },
    /**
     * 滑动切换tab
     */
    bindChange: function ( e ) {
        let that = this;
        that.setData( { currentTab: e.detail.current } );
        if ( that.data.currentTab == 0 ) {
            that.setData( {
                page_num: 1,   //第一次加载，设置1
                datalists: [],  //放置返回数据的数组,设为空
                isFromlit: true,  //第一次加载，设置true
                listLoading: true,  //把"上拉加载"的变量设为true，显示
                listLoadingComplete: false //把“没有数据”设为false，隐藏
            } )
            that.fetchReplist();
        } else if ( that.data.currentTab == 1 ) {
            that.setData( {
                page_num: 1,   //第一次加载，设置1
                datalists: [],  //放置返回数据的数组,设为空
                isFromlit: true,  //第一次加载，设置true
                listLoading: true,  //把"上拉加载"的变量设为true，显示
                listLoadingComplete: false //把“没有数据”设为false，隐藏
            } )
            that.fetchReplist();
        } else {
            that.setData( {
                page_num: 1,   //第一次加载，设置1
                datalists: [],  //放置返回数据的数组,设为空
                isFromlit: true,  //第一次加载，设置true
                listLoading: true,  //把"上拉加载"的变量设为true，显示
                listLoadingComplete: false //把“没有数据”设为false，隐藏
            } )
            that.fetchReplist();
        }
    },
    /**
     * 点击切换tab
     */
    swichNav: function ( e ) {
        console.log( userData )
        console.log( e )
        let that = this;
        token = userData.token;
        if ( this.data.currentTab === e.currentTarget.dataset.current ) {
            //点击的是同一个，则不操作
            return false;
        } else {
            that.setData( {
                currentTab: e.currentTarget.dataset.current
            } )
        }
    },

    paycancel: function ( e ) {//售后待服务取消订单
        let status = "";
        if ( this.data.currentTab == 0 ) {
            status = "1";
        } else if ( this.data.currentTab == 1 ) {
            status = "2";
        } else if ( this.data.currentTab == 2 ) {
            status = "3";
        }
        this.setData( {
            status: status
        } );
        wx.showModal( {
            title: '提示',
            content: '确定取消该订单吗？',
            success: function ( res ) {
                let that = this
                if ( res.confirm ) {
                    console.log( '用户点击确定' )
                    console.log( e )
                    userData = wx.getStorageSync( "user_data" ) || [];
                    // token = userData.token;
                    // let url = "/mobile/order/aftersale_order/edit"
                    let orderId = e.currentTarget.dataset.orderid;//获取当前订单ID
                    let customerId = userData.customer.cusUserId;
                    console.log( orderId )
                    let params = {
                        "orderId": orderId,
                        "status": "4",
                        "oldStatus": status,
                    }

                    app.post(app.url_afterOrderUpdata, params, function (res) {//订单状态更新
                        console.log( res.data )
                        if (res.data.code == "SUCCESS" && res.data.bizCode == "OPER_SUCCESS") {
                            wx.startPullDownRefresh();
                            wx.redirectTo( {
                                url: './aftersalserepair?currentTab=0',
                            } )
                            console.log( res.data )
                        } else {
                            console.log( res.data )
                            return false;
                        }
                    }, function ( res ) {
                        
                    } )
                } else if ( res.cancel ) {
                    console.log( '用户点击取消' )
                    return false;
                }
            }
        } )
    },

    after_confirm: function ( e ) {//售后报修待确认——确认订单
        let that = this
        let order_id = e.currentTarget.dataset.orderid;
        let server_id = e.currentTarget.dataset.serverid;
        let customer_id = userData.customer.cusUserId;
        let status_old = 2;
        let status = 3;
        console.log('params => ', token, order_id, customer_id);

        let params = {
            'orderId': order_id,
            'status': status,
            'oldStatus': status_old,
        };

        if (e.currentTarget.dataset.ismonthpay == 1) {

            app.post(app.url_afterOrderUpdata, params, function (res) {
                console.log(res.data)
                if (res.data.code === 'SUCCESS' && res.data.bizCode === 'OPER_SUCCESS') {
                    wx.navigateTo({
                        url: '../comment/comment?order_id=' + order_id + '&order_type=2&server_id=' + server_id,
                    });
                } else {
                    console.log(res.data)
                    that.show(res.data.msg)
                    return false;
                }
            },function(res){
                return false;
            });//售后维修订单状态更新


        }else{
            if (e.currentTarget.dataset.totalPrice == 0){
                app.post(app.url_afterOrderUpdata, params, function (res) {
                    console.log(res.data)
                    if (res.data.code === 'SUCCESS' && res.data.bizCode === 'OPER_SUCCESS') {
                        wx.navigateTo({
                            url: '../comment/comment?order_id=' + order_id + '&order_type=2&server_id=' + server_id,
                        });
                    } else {
                        console.log(res.data)
                        that.show(res.data.msg)
                        return false;
                    }
                }, function (res) {
                    return false;
                });//售后维修订单状态更新
            }else {
                let logininfo = wx.getStorageSync('logininfo');
                let openId = logininfo.openid;
                let orderType = "2";
                let params = {
                "order_id": order_id,
                "order_type": orderType,
                "pay_type": "2",
                "app_type": "3",
                "openid": openId
                };

                app.post(app.url_commonOrderPay, params, function (res) {//支付请求接口
                    let jsonObj = JSON.parse(JSON.stringify(res.data));
                    console.log(jsonObj);
                    console.log(jsonObj.data.paySignOrPrepayid);
                    let packages = jsonObj.data.paySignOrPrepayid;
                    let noncestrs = Math.random().toString(36).substr(2, 15);
                    let timestamps = Date.parse(new Date());
                    timestamps = timestamps / 1000;
                    let stringA = 'appId=wxfc1b21407fd6879e' + '&nonceStr=' + noncestrs + '&package=prepay_id=' + packages + '&signType=MD5&timeStamp=' + timestamps + "&key=yuhaohulianwangkejiyouxiangongsi";
                    let paysign = md5js.md5(stringA).toUpperCase();

                    wx.requestPayment({
                        'timeStamp': timestamps.toString(),
                        'nonceStr': noncestrs,
                        'package': 'prepay_id=' + packages,
                        'signType': 'MD5',
                        'paySign': paysign,
                        'success': function (res) {
                            // wx.navigateTo({
                            //     url: '../aftersalserepair/aftersalserepair?currentTab=2',
                            // });
                            wx.navigateTo({
                                url: '../comment/comment?order_id=' + order_id + '&order_type=2&server_id=' + server_id,
                            });
                            console.log(res)
                        },
                        'fail': function (res) {
                            wx.navigateTo({
                                url: '../aftersalserepair/aftersalserepair?currentTab=1',
                            });
                            console.log(res)
                        },
                        'complete': function (res) {
                        }
                    })
                }, function (res) {
                    return false;
                })
            }
        }

    },

    box_detail: function ( e ) {//查看售后订单详情
        userData = wx.getStorageSync( "user_data" ) || [];
        token = userData.token
        console.log( e )
        let url = '/mobile/order/aftersale_order/details'
        let orderId = e.currentTarget.dataset.orderid;//获取当前订单ID
        let sign = md5js.md5( "{orderId=" + orderId + "}" )
        let data = {
            "orderId": orderId
        }
        console.log( "{orderId=" + orderId + "}" )
        wx.navigateTo( {
            url: '../aftersaledetail/aftersaledetail?orderId=' + orderId,
        } )

    },

    payorder: function ( e ) {//获取二维码
        console.log('aftersalerepair.js => payorder => 打开二维码获取参数: ', e.target.dataset );
        let orderId = e.target.dataset.orderid;
        let serverId = e.target.dataset.serverid;
        let arrivalTime = e.target.dataset.arrivaltime;
        wx.navigateTo( {
            url: '../qrcode/qrcode?orderId=' + orderId + '&serverId=' + serverId + '&arrivalTime=' + arrivalTime,
        } )
    },

    checkcomment: function (e) {//查看订单评论
        let that = this
        let order_id = e.currentTarget.dataset.orderid;
        let server_id = e.currentTarget.dataset.serverid;
        let customer_id = userData.customer.cusUserId;
        wx.navigateTo({
            url: '../checkcomment/checkcomment?order_id=' + order_id + '&order_type=2&server_id=' + server_id,
        })
    },

    comment: function (e) {//评论订单
      let that = this
      let order_id = e.currentTarget.dataset.orderid;
      let server_id = e.currentTarget.dataset.serverid;
        wx.navigateTo({
            url: '../comment/comment?order_id=' + order_id + '&order_type=2&server_id=' + server_id,
        });
    }
} )