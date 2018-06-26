const app = getApp();
const util = require( '../../utils/util.js' );
const md5js = require( '../../utils/md5.js' );
import WxValidate from '../../utils/WxValidate';

Page( {

    data: {
        username: '',
        password: '',
        user_type: '1',
        showTopTips: false, // 消息提示隐藏
        errorMsg: '' // 消息默认为空
    },
    onLoad: function ( options ) {
        let that = this;
        wx.getSystemInfo( {
            success: function ( res ) {
                that.setData( {
                    windowHeight: res.windowHeight,
                    windowWidth: res.windowWidth,
                    // username: options.username,
                    // password: options.password
                } );
            }
        } );
        // 启用表单验证
        this.initValidate();

    },
    /**
     * 初始化表单验证配置
     */
    initValidate: function () {
        // 验证字段的规则
        const rules = {
            username: {
                required: true,
                tel: true
            },
            password: {
                required: true
            }
        };
        // 验证字段的提示信息，若不传则调用默认的信息
        const messages = {
            username: {
                required: '请填写登录手机号码',
                tel: '手机号码有误'
            },
            password: {
                required: '请填写密码'
            }
        };
        this.WxValidate = new WxValidate( rules, messages )

    },
    /**
     * 显示错误提示
     * @param error 错误提示对象
     */
    showModal: function ( error ) {
        this.setData( {
            showTopTips: true,
            errorMsg: error.msg
        } );
    },
    /**
     * input触摸，关闭错误提示信息
     */
    inputFocus: function ( e ) {
        this.setData( {
            showTopTips: false,
            errorMsg: ''
        } );
    },
    bindtaplogin: function ( e ) {
        console.log( '点击了登录按钮' );
    },
    /**
     * 表单提交
     * @param e
     * @returns {boolean}
     */
    formSubmit: function ( e ) {
        let that = this;
        // 传入表单数据，调用验证方法
        if ( !this.WxValidate.checkForm( e ) ) {
            const error = this.WxValidate.errorList[0];
            this.showModal( error );
            return false;
        }

        // 验证通过，执行登录
        let username = e.detail.value.username;
        let password = e.detail.value.password;
        password = md5js.md5( md5js.md5( password ) );
        let user_type = this.data.user_type;
        let sign = md5js.md5( '{username=' + username + ',password=' + password + ',user_type=' + user_type + '}' );

        let reqdata = {
            "sign": sign,
            "params": {
                "username": username,
                "password": password,
                "user_type": user_type
            }
        };

        wx.request( {
            url: app.url_signin,
            data: reqdata,
            method: 'post',
            success: res => {
                let response = res.data;
                let code = response.code;
                let bizCode = response.bizCode;
                let respdata = response.data;

                if ( code === 'FAILURE' ) {
                    if ( bizCode === 'USERNAME_OR_PASSWORD_ERROR' ) {
                        this.showModal( {
                            msg: response.msg
                        } );
                        return false;
                    }
                } else {
                    if ( code === 'SUCCESS' && bizCode === 'OPER_SUCCESS' && respdata != null ) {
                        //存储data至本地
                        wx.setStorageSync( "user_data", respdata );
                        wx.switchTab( {
                            url: '../maintain/maintain',
                            success: function ( e ) {
                                const page = getCurrentPages().pop();
                                if ( page === undefined || page === null ) return;
                                page.onLoad();
                            }
                        } );
                    }
                }
            }
        } );
    }
} );
