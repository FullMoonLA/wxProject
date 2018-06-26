//index.js
//获取应用实例
const app = getApp();
const APP_ID = 'wxfc1b21407fd6879e';
const APP_SECRET = '41f574514bc49545d800d386af11e5a4';
let OPEN_ID = '';
let SESSION_KEY = '';

Page( {
    data: {
        motto: '欢迎登陆老板梦',
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse( 'button.open-type.getUserInfo' ),
    },
    //事件处理函数
    bindViewTap: function () {
      // setTimeout(function () {
        wx.redirectTo({
          url: '../logining/logining'
        })
      // }, 100) 
    },
    onLoad: function () {
        if ( app.globalData.userInfo ) {
            this.setData( {
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            } )
        } else if ( this.data.canIUse ) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                this.setData( {
                    userInfo: res.userInfo,
                    hasUserInfo: true
                } )
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo( {
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    this.setData( {
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    } )
                }
            } )
        }
    },
    getUserInfo: function ( e ) {
        console.log( e );
        //调用应用实例的方法获取全局数据
        app.globalData.userInfo = e.detail.userInfo;
        //更新数据
        this.setData( {
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        } );
        // 获取用户信息
        let that = this;
        wx.login( {
            success: function ( res ) {
                app.post( app.url_jscode2session, { 'js_code': res.code }, function ( resp ) {
                    console.log( 'index.js => getUserInfo => 获取服务器的用户session：' + JSON.stringify(resp.data.data) );
                    wx.setStorageSync( 'logininfo', resp.data.data );
                    that.setData( {
                        openid: res.data.data.openid,
                        session_key: res.data.data.session_key
                    } );
                    wx.redirectTo( {
                        url: '../home/home'
                    } );
                } );
            }
        } )

    }
} );
