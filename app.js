const http = require( 'utils/util.js' );
const md5js = require( 'utils/md5.js' );
const domain = "https://www.XXX.com";
// const domain ='http://XXX';
// const domain ='https://www.XXX.com';
import { ToastPannel } from './component2/toastTest/toastTest'

App( {
    ToastPannel,
    // wxToast,
    onLaunch: function () {
        let app = this;
        // 展示本地存储能力
        let logs = wx.getStorageSync( 'logs' ) || [];
        logs.unshift( Date.now() );
        wx.setStorageSync( 'logs', logs );
        // 登录
        wx.login( {
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                app.post( app.url_jscode2session, { 'js_code': res.code }, function ( resp ) {
                    console.log( 'app.js => onLaunch => 获取服务器的用户session：' + JSON.stringify( resp.data.data ) );
                    wx.setStorageSync( 'logininfo', resp.data.data );
                } );
            }
        } );
        // 获取用户信息
        wx.getSetting( {
            success: res => {
                if ( res.authSetting['scope.userInfo'] ) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo( {
                        success: res => {
                            // 可以将 res 发送给后台解码出 unionId
                            this.globalData.userInfo = res.userInfo;
                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            if ( this.userInfoReadyCallback ) {
                                this.userInfoReadyCallback( res );
                            }
                        }
                    } )
                }
            }
        } );
    },

    editTabBar: function () {//售后报修页面切换
        let tabbar = this.globalData.tabbar,
            currentPages = getCurrentPages(),
            _this = currentPages[currentPages.length - 1],
            pagePath = _this.__route__;
        (pagePath.indexOf('/') != 0) && (pagePath = '/' + pagePath);
        for (let i in tabbar.list) {
            tabbar.list[1].selected = false;
            (tabbar.list[i].pagePath == pagePath) && (tabbar.list[i].selected = true);
        }
        _this.setData({
            tabbar: tabbar
        });
    },
    globalData: {
        userInfo: null,
        tabbar: {
          color: "#272636",
          selectedColor: "#28B98F",
          backgroundColor: "#F2F2F2",
          borderStyle: "#D4D4D4",
          list: [
            {
              pagePath: "../maintain/maintain",
              text: "报修",
              iconPath: "../../images/jj2_x50.png",
              selectedIconPath: "../../images/jj_x50.png",
              selected: true
            },
            {
              pagePath: "../home/home",
              iconPath: "../../images/geren2_x50.png",
              selectedIconPath: "../../images/geren_x50.png",
              text: "个人中心",
              selected: false
            }
          ],
          position: "bottom"
        }
    },
    ajax: {
        req: http.req,
        getReq: http.getReq
    },

    onPullDownRefresh: function () {
        wx.showNavigationBarLoading(); //在标题栏中显示加载
        setTimeout( () => {
            wx.hideNavigationBarLoading(); //完成停止加载
            wx.stopPullDownRefresh(); //停止下拉刷新
        }, 1500 )
    },
    /**
     * POST 请求封装
     * @param url 请求路径
     * @param params 请求参数
     * @param success 成功回调
     * @param fail 失败回调
     * @param complete 接口调用结束的回调函数（调用成功、失败都会执行）
     */
    post: function ( url, params, success, fail, complete ) {
        let sign = this.getSign( params );
        let token = this.getToken();
        let data = {
            'sign': sign,
            'token': token,
            'params': params
        };
        wx.request( {
            url: url,
            data: data,
            method: 'POST',
            success: success,
            fail: fail,
            complete: complete
        } );
    },
    /**
     * GET 请求封装
     * @param url 请求路径
     * @param params 请求参数
     * @param success 成功回调
     * @param fail 失败回调
     * @param complete 接口调用结束的回调函数（调用成功、失败都会执行）
     */
    get: function ( url, params, success, fail, complete ) {
        let sign = this.getSign( params );
        let token = this.getToken();
        let data = {
            'sign': sign,
            'token': token,
            'params': params
        };
        wx.request( {
            url: url,
            data: data,
            method: 'GET',
            success: success,
            fail: fail,
            complete: complete
        } );
    },
    /**
     * 对json格式的参数进行MD5签名
     * @param params json参数
     * @returns {*} MD5签名
     */
    getSign: function ( params ) {
        let sign = '{';
        for ( let key in params ) {
            sign += key + '=' + params[key] + ',';
        }
        return md5js.md5( sign.substring( 0, sign.lastIndexOf( ',' ) ) + '}' );
    },
    /**
     * 获取服务器登录token
     * @returns {*}
     */
    getToken: function () {
        let ud = wx.getStorageSync( 'user_data' );
        return ud.token;
    },
    /**
     * 获取服务器登录成功后的用户数据
     * @returns {*}
     */
    getUserData: function () {
        return wx.getStorageSync( 'user_data' );
    },

    domain: domain, // 服务器域名
    domain_img: 'https://XXX.com/',
    // domain_img: 'http://www.yhwxxt.cn/',
    domain_dataurlimg:'https://www.XXX.com/equipment/view_no/',
    url_afterQcode: domain + '/mobile/order/aftersale_order/help/scan',
    url_uploadFile: domain + '/mobile/upload/put', // 上传文件
    url_signin: domain + '/mobile/commons/auth/signin', // 登录
    url_isSalesclerk: domain + '/mobile/user/customer/isSalesclerk', // 判断是否是店铺员工
    url_storeDetails: domain + '/mobile/store/details',//店铺详情
    url_commonsList: domain + '/mobile/commons/list',//公共数据列表查询--售后维修类型下拉选择
    url_baiduMapGecoder: 'https://api.map.baidu.com/geocoder/v2/',
    url_jscode2session: domain + '/mobile/commons/auth/jscode2session',
    url_UserCustomerEdit: domain + '/mobile/user/customer/edit',
    url_signout: domain + '/mobile/commons/auth/signout',//退出登录
    url_commonOrderUpdate: domain + '/mobile/order/common_order/update',//普通订单更新
    url_commonOrderAdd: domain + '/mobile/order/common_order/add',//普通订单提交
    url_commonOrderList: domain + '/mobile/order/common_order/list',//普通报修订单列表
    url_commonOrderPay: domain + '/mobile/pay/get',//普通报修支付
    url_afterOrderAdd: domain + '/mobile/order/aftersale_order/add',//售后订单提交
    url_afterOrderUpdata: domain + '/mobile/order/aftersale_order/edit',//售后订单更新
    url_afterOrderList: domain + '/mobile/order/aftersale_order/list',//售后订单列表
    url_afterOrderDetail: domain + '/mobile/order/aftersale_order/details',//售后订单详情
    url_orderCriticAdd: domain + '/mobile/order/order_critic/add',//提交评论
    url_orderCriticGet: domain + '/mobile/order/order_critic/get',//获取评论信息
} );
