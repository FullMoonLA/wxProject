import WxValidate from '../../utils/WxValidate'
const Promise = require( '../../utils/es6-promise.min' );
const util = require( '../../utils/util.js' );
const md5js = require( '../../utils/md5.js' );
const app = getApp();
let validateComm = '';
let validateAfter = '';
Page( {
    /**
     * 页面的初始数据
     */
    data: {
    //   repChildid:"",
        params: {},
      pickable:false,
      hidequ:true,
      isHidden: true,
      cancleBtn: false,
      disablesub:false,
      tabbar: {},
      repprovince: "",
      repcity: "",
      repdescripts: "",
      repaddress: "",
      isload: 0,
      phone: "",
      price: "",
      imgs: [],
      urlArr: [],
      result: {},
      navbar: ['普通维修', '售后维修'],
      currentTab: 0,
      item: '../../images/add_x134.png',
      storeId:"",
      casArray: [],
      casArray2: [],
      casArray3: [],
      casIndex: "",
      casIndex2: "",
      casIndex3: "",
      repChildId: "",
      levelId: "",
      disable: false,
      disable_1: false,
      hidden: true,
      longitude: "",
      latitude: "",
      userInfo: {},
      hasLocation: false,
      img: "",
      orderType: '1',
      appType: '1'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function ( e ) {    // 页面加载用户数据
      this.setData({
        currentTab: 0
      })
        // 登录
        wx.login( {
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                app.post( app.url_jscode2session, { 'js_code': res.code }, function ( resp ) {
                    console.log( 'maintain.js => onLoad => 获取服务器的用户session：' + JSON.stringify( resp.data.data ) );
                    wx.setStorageSync( 'logininfo', resp.data.data );
                } );
            }
        } );
        let logininfo = wx.getStorageSync( 'logininfo' );
        let userData = app.getUserData();
        let token = userData.token;
        new app.ToastPannel();
        this.initValidateComm();
        // this.initValidateAfter();
        if (userData == "" || userData == '[]' || userData == null){
            return false;
        }else{
            this.setData({
            phone: userData.customer.phone,
            })
        }
    },

    onShow: function () {
        let that = this;
        console.log(that.data.hidequ)
        let userData = app.getUserData();
        let token = userData.token;
        console.log( userData );
        let timestamps = Date.parse( new Date() ) / 1000;
        that.setData({
            disablesub: false,
            isHidden:true,
            // pickable: false,
        })
        if ( userData == '' || userData == '[]' || userData == null ) {
            that.setData( {
                content: "请先登录"
            } );
            that.show( that.data.content );
        } else {
            if ( that.data.isload === 0 ) {
                that.setData( {
                    phone: userData.customer.phone,
                    isload: 1
                } );
            }
            // if (that.data.hidequ == "false") {
            //   that.setData({
            //     pickable: true,
            //     // disable: true
            //   })
            // }
            // else {
            //   that.setData({
            //     // disable: false,
            //     pickable: false
            //   })
            // }
            let cusUserId = userData.customer.cusUserId;
            let params = { 'cusUserId': cusUserId };
            app.post( app.url_isSalesclerk, params, function ( res ) {//判断是否店铺员工
                console.log(res.data)
                let resultres = res.data;
                if (resultres.code == "NO_DATA" && resultres.bizCode == "OPER_FAILURE") {
                    return false;
                } else if (resultres.code === "FAILURE" && resultres.bizCode == "INVALID_TOKEN") {
                    that.show(resultres.msg)
                } else if (resultres.code == "SUCCESS" && resultres.bizCode == "OPER_SUCCESS") {
                    if (resultres.msg == "true"){
                        let repairsList = wx.setStorageSync('repairsList', resultres.data);
                        // console.log("res=====" + JSON.stringify(resultres.data.repairsList));
                        //获取用户店铺信息
                        let storerep = userData.customer.storeId;
                        let params = { 'storeId': storerep };
                        app.post(app.url_storeDetails, params, function (res) {//获取店铺详情
                            if (res.data.code == "SUCCESS" && res.data.bizCode == "OPER_SUCCESS") {
                                wx.setStorageSync("storeId", res.data.data.storeId);
                                that.setData({
                                storeId: storerep,
                                repprovince: res.data.data.province,
                                repcity: res.data.data.city,
                                repdistrict: res.data.data.district,
                                repaddress: res.data.data.address,
                                });
                            } else {
                                return false;
                            }
                        });
                    }
           
                }
            } );
        }

    },
    onPullDownRefresh: function () {//下拉刷新
      this.setData({
        price:"",
        descriptions:"",
        item:"",
        hidequ:true,
        casIndex:"",
        casIndex2:"",
        casIndex3:"",
        repdescripts:""
      })
        app.onPullDownRefresh()
    },
    // 普通售后导航栏切换
    navbarTap: function ( e ) {
        let _this = this;
        let userData = app.getUserData();
        if (userData == '' || userData == '[]' || userData == null ) {
            _this.show("请先登录")
        } else {

            if ( e.currentTarget.dataset.idx === 1 ) {
                let cusUserId = userData.customer.cusUserId;
                let params = { 'cusUserId': cusUserId };

                app.post( app.url_isSalesclerk, params, function ( res ) {//获取售后维修类型下拉列表

                    if (res.data.code == "SUCCESS" && res.data.bizCode == "OPER_SUCCESS") {
                        let resultres = res.data;

                        if ( resultres.msg === 'false' ) {
                            _this.show("非门店员工不可进行售后报修");
                        } else if ( resultres.code === "FAILURE" ) {
                            _this.show("身份验证过期请重新登录");
                        } else if (resultres.msg == 'true') {
                            _this.setData( {
                                orderType: '2',
                                currentTab: e.currentTarget.dataset.idx,
                                casArray: resultres.data.repairsList,
                                imgs: []
                            } );

                            if (_this.data.casIndex == "") {//判断维修类型是否有值
                                _this.setData({
                                    disable: true
                                });
                            }
                            if(_this.data.casIndex2 ==""){
                                _this.setData({
                                    disable_1:true
                                })
                            }

                        }
                    } else if (res.data.code == "NO_DATA" && res.data.bizCode == "OPER_FAILED"){
                        if (res.data.msg === 'false'){
                            _this.show("非门店员工不可进行售后报修")
                        } 
                    }
                } );
            } else {
                if ( _this.data.currentTab === 1 ) {
                    _this.setData( {
                        orderType: '2',
                    } )
                    // return false;
                } else {
                    _this.setData( {
                        orderType: '1',
                    } )
                }
                    _this.setData( {
                        currentTab: e.target.dataset.idx,
                        price: "",
                        descriptions: "",
                        hidequ: true,
                        pickable:false,
                        disable:false,
                        casIndex: "",
                        casIndex2: "",
                        casIndex3: "",
                        repdescripts: "",
                        imgs: []
                    } )
            }
            // console.log(_this.data.pickable, _this.data.disable, _this.data.hidequ)
        }
    },

  // 扫描设备二维码
    repscanqcode :function(e){
      let that = this;
      let shows;
      let dataurl = app.domain_dataurlimg;
      wx.scanCode({
        success: (res) => {
            if (res.result.indexOf(dataurl)){//判断扫描的二维码是否有效
                that.show('当前二维码无效');
                that.setData({
                    hidequ:true
                })
            }else{//二维码有效时
                // that.setData({
                //   pickable: true,
                //   disable: true
                // })
                that.setData({
                    hidequ: false,
                    pickable: true,
                    disable: true
                })
                let regStr = res.result.match(/EQU(\S*)/g);
                let resNum = regStr[0];
                let storeId = this.data.storeId;
                console.log(regStr[0], storeId)
                let params = {
                    "storeId": storeId,
                    "equNum": resNum
                }
                console.log('storeId'+storeId,'equNum'+resNum)
                app.post(app.url_afterQcode, params, function (res) {//扫描二维码获取维修类型及维修项目
                if (res.data.code == "SUCCESS" && res.data.bizCode == "OPER_SUCCESS"){
                    let result =res.data.data
                    // console.log(result.repairs.repairsName, result.repairChild.repChildName)
                    let reptype = result.repairs.repairsName
                    let repsubtype = result.repairChild.repChildName
                    let repChildid = result.repairChild.repChildId
                    console.log(result)
                    that.setData({
                        showequ: regStr,
                        repChildId: result.repairChild.repChildId,
                        // repairsId: result.repairs.repairsId,
                        // repChildid: result.repairChild.repChildId,
                        casIndex: reptype,
                        casIndex2: repsubtype,
                        // hidequ: false,
                    })
                
                    let code = "7";
                    let params = {
                        "code": code,
                        "parentId": repChildid
                    }
                    app.post(app.url_commonsList, params, function (res) {//扫描二维码获得报修时效列表
                        if (res.data.code == "SUCCESS" && res.data.bizCode == "OPER_SUCCESS") {
                            console.log(repChildid);
                            that.setData({
                                repChildId: repChildid,
                                casArray3: res.data.data,
                                // pickable: true,
                                // disable: true
                            })
                            // if (that.data.hidequ == "false") {
                            //   that.setData({
                            //     pickable: true,
                            //     disable: true
                            //   })
                            // }
                        } else {
                            // that.show(res.data.msg)
                        }
                    }, function (res) {
                        return false;
                    });
                } else if (res.data.code == "FAILED"){
                    return false;
                }else {
                    // that.show(res.data.msg)
                }
                
                },function(res){})
                // that.setData({
                //   show: regStr,
                //   hidequ: false
                // })
                // console.log(that.data.pickable, that.data.disable, that.data.hidequ)
            }
            console.log(res)
          
            // console.log(that.data.pickable,that.data.disable,that.data.hidequ)
            this.shows = "结果:" + res.result + "二维码类型:" + res.scanType + "字符集:" + res.charSet + "路径:" + res.path;
        },
        fail: (res) => {
          that.show('获取失败')
        },
        complete: (res) => {
        //   console.log(that.data.pickable,that.data.disable,that.data.hidequ)
        }
      })  
    },

    Picker1:function(e){//维修类型点击事件
        let that = this
        console.log(that.data.pickable,that.data.disable,that.data.hidequ)
        if (!that.data.hidequ) {//判断设备编码显示时的操作
            that.setData({
                pickable: true,
                disable: true
            })
        } 
        else if (that.data.hidequ){
            that.setData({
                disable: false,
                pickable: false
            })
        }
    },

    // 维修类型下拉选择项
    bindCasPickerChange_1: function ( e ) {
        let that = this;
        let index = e.detail.value;
        let currentId = this.data.casArray[index].repairsId; // 这个id就是选中项的id
        that.setData( {
            casIndex: e.detail.value,
            casIndex2: "",
            casIndex3: "",
            disable_1: true
        } );
       
        let code = "6";
        let params = {
          "code": code,
          "parentId": currentId
        }
        app.post(app.url_commonsList, params, function ( res ) {
            if (res.data.code == "SUCCESS" && res.data.bizCode == "OPER_SUCCESS") {
                that.setData( {
                    casArray2: res.data.data
                } )
                console.log( res.data )
            }else{
                // that.show(res.data.msg)
                return false;
            }
        }, function ( res ) {
          // that.show(res.data.msg)
          return false;
        } );
    },

    Picker2: function ( e ) {//子维修类型点击事件
        let _this = this;
        if ( this.data.casIndex == "" ) {
            _this.setData( {
                disable: true
            } );
            _this.show("请选择维修类型");
            return false;
        } else {
           if(!_this.data.hidequ){//设备编码显示时
                _this.setData({
                    pickable:true,
                    disable:true
                })
            }else{
                _this.setData({
                    disable: false,
                    pickable:false
                })
            }
          
        }
        // console.log(_this.data.pickable, _this.data.disable, _this.data.hidequ)
    },
    
    bindCasPickerChange_2: function ( e ) {//子维修类型下拉选择-- 请求维修项目列表
        // console.log( 'picker发送选择改变，携带值为', e.detail.value );
        let that = this;
        that.setData( {
            casIndex2: e.detail.value,
            casIndex3: ""
        } );
        // if ( that.data.casIndex == "" ) {
        //     that.setData( {
        //         content: "请选择维修类型",
        //         disable: true
        //     } );
        //     that.show( that.data.content );
        //     return false;
        // } else {
        //     that.setData( {
        //         disable: false
        //     } );
        let index2 = e.detail.value;
        let thisId = this.data.casArray2[index2].repChildId; // 这个id就是选中项的id
        let code = "7";
        // util.repPickerChange( url, code, thisId,
        let params = {
            "code": code,
            "parentId": thisId
        }
        app.post(app.url_commonsList, params, function ( res ) {
            if (res.data.code == "SUCCESS" && res.data.bizCode == "OPER_SUCCESS") {
                console.log(thisId);
                that.setData({
                    repChildId: thisId,
                    casArray3: res.data.data
                })
            }else{
                // that.show(res.data.msg)
            }
        }, function ( res ) {
        } );
        // }
    },

    Picker3: function ( e ) {//报修时效点击事件
        let _this = this;
        if ( this.data.casIndex2 == "" ) {
            _this.setData( {
                disable_1: true
            } );
            _this.show("请选择维修项目" );
            return;
        } else {
            _this.setData( {
                disable_1: false
            } )
        }
    },
    bindCasPickerChange_3: function ( e ) {//报修时效下拉选择
        let that = this;
        // if ( this.data.casIndex2 == "" ) {
        //     that.setData( {
        //         content: "请选择维修项目",
        //         disable_1: true
        //     } );
        //     that.show( that.data.content );
        //     return false;
        // } else {
        let index3 = e.detail.value;
        let thisId3 = this.data.casArray3[index3].levelId; // 这个id就是选中项的id
        console.log( thisId3 );
        that.setData( {
            levelId: thisId3,
            casIndex3: e.detail.value,
            // disable_1: false
        } );
        // }
    },

    onMyEvent: function (e) {
        let that = this;
        console.log("e.detail :", e.detail)
        that.setData({
            isHidden: true,
        })
    },
  
    showdialog:function(){
        let that = this;
        that.setData({
            isHidden: false,
        })
    },

    // 普通维修获取详细地址
    // 获取地址
    getLocation: function ( e ) {
        console.log( e );
        let that = this;
        wx.getLocation( {
            success: function ( res ) {
                console.log( res );
                that.setData( {
                    location: {
                        logitude: res.longitude,
                        latitude: res.latitude
                    }
                } )
            },
        } )
    },

    // 打开地图
    openLocation: function ( e ) {
        let value = e.detail.value;
        wx.openLocation( {
            latitude: Number( value.longitude ),
            longitude: Number( value.latitude ),
        } )
    },
    // 选择位置
    chooseLocation: function ( e ) {
        console.log( e );
        let that = this;
        wx.chooseLocation( {
            success: function ( res ) {
                console.log( res );
                that.setData( {
                    hasLocation: true,
                    location: {
                        longitude: res.longitude,
                        latitude: res.latitude,
                        name: res.name
                    }
                } );
                let longitude = res.longitude;
                let latitude = res.latitude;
                that.loadCity( longitude, latitude );
                that.setData( {
                    longitude: res.longitude,
                    latitude: res.latitude
                } );

            },
        } )
    },

    // 选择位置显示省市区
    loadCity: function ( longitude, latitude ) {
        let _this = this;
        wx.request( {
            url: 'https://api.map.baidu.com/geocoder/v2/?ak=zCXYvBYKTfUiZTrLtXy6hZp3Yd7cbpLZ&location=' + latitude + ',' + longitude + '&output=json',
            data: {},
            header: {
                'Content-Type': 'application/json'
            },
            success: function ( res ) {
                console.log( "省市区" + res.data );
                let location = res.data.result.addressComponent;
                let province = location.province;
                let city = location.city;
                let district = location.district;
                _this.setData( {
                    province: province,
                    city: city,
                    district: district
                } );
            },
            fail: function () {
                _this.setData( {
                    province: "",
                    city: "",
                    district: ""
                } );
            }
        } );
    },

    //上传图片
    uploadImages: function () {
        // wx.showToast({
        //     title: '上传中...',
        //     icon:"loading"
        // })
        wx.showToast({
            title: '提交中...',
            icon: "loading",
        })
        let that = this;
        let token = app.getToken();
        let filePaths = that.data.imgs;
        let urlArr = that.data.urlArr;
        console.log( urlArr );
        let promise = Promise.all( filePaths.map( ( filePath, index ) => {
            return new Promise( function ( resolve, reject ) {
                wx.uploadFile( {
                    url: app.url_uploadFile,
                    filePath: filePath,
                    name: 'files',
                    header: { 'Content-Type': 'multipart/form-data' },
                    formData: {
                        'token': token,
                        'save_dir': 'pic/order',
                    },
                    success: function ( res ) {
                        console.log( JSON.parse( res.data ).data.targetImage );
                        urlArr.push( JSON.parse( res.data ).data.targetImage );
                        resolve();
                    },
                    fail: function ( err ) {
                        reject( new Error( 'failed to upload file' ) );
                    }
                } );
            } );
        } ) );
        return promise
    },

    // 维修图片上传
    chooseImg: function (e) {
        let userData = app.getUserData();
        let token = userData.token;
        let that = this;
        wx.chooseImage({
            // count: 5, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                let tempFilePaths = res.tempFilePaths;
                let imgs = that.data.imgs;
                for (let i = 0; i < tempFilePaths.length; i++) {
                    if (imgs.length >= 4) {
                        that.setData({
                            imgs: imgs,
                            content: "最多上传4张图片"
                        });
                        that.show(that.data.content);
                        return false;
                    } else {
                        imgs.push(tempFilePaths[i]);
                    }
                }
                that.setData({
                    imgs: imgs
                });
            }
        });
    },

    addOrder: function ( e ) {//维修订单提交
        let that = this;
        let userData = app.getUserData();
        let token = userData.token;
        console.log( 'maintian.js -> addOrder -> token -> ' + token );
        // let location = wx.getStorageSync("location");
        // let logininfo = wx.getStorageSync( 'logininfo' );

        let target_image = this.data.urlArr.toString();
        console.log( 'target_img: ' + target_image );
        const formdata = e.detail.value;
        console.log( formdata )
        if ( that.data.currentTab === 0 ) {
            let phone = formdata.phone;
            let province = this.data.province;
            let city = this.data.city;
            let district = this.data.district;
            let name = formdata.address;//获取标签name为address的值
            let price = formdata.price;
            let descriptions = formdata.descriptions;
            let lng = this.data.longitude;
            let lat = this.data.latitude;
            let favoreId = userData.customer.cusUserId;

            // let sign = md5js.md5( "{district=" + district + "," + "phone=" + phone + "," + "city=" + city + "," + "address=" + name + "," + "price=" + price + "," + "target_image=" + target_image + "," + "longitude=" + lng + "," + "latitude=" + lat + "," + "description=" + descriptions + "," + "customer_id=" + favoreId + "," + "province=" + province + "}");
            let params = {
                "district": district,
                "phone": phone,
                "city": city,
                "address": name,
                "price": price,
                "target_image": target_image,
                "longitude": lng,
                "latitude": lat,
                "description": descriptions,
                "customer_id": favoreId,
                "province": province
            };
            // let url = "/mobile/order/common_order/add";
            // util.getpublicrequest( url, token, sign, data, function ( res ) {
            app.post(app.url_commonOrderAdd, params, function (res) {//普通报修提交接口
                console.log(res.data)
                if (res.data.code == "SUCCESS" && res.data.bizCode == "OPER_SUCCESS"){
                    wx.showToast({
                        title: '提交中...',
                        icon:"loading"
                    })
                    let logininfo = wx.getStorageSync( 'logininfo' );
                    let openId = logininfo.openid;
                    console.log( "提交请求成功返回数据" + JSON.stringify( res.data ) );
                    let result = JSON.parse( JSON.stringify( res.data ) );
                    let orderType = "1";
                    let orderId = result.data.orderId;
                    // console.log( openId );
                    // console.log( orderId );
                    // console.log("{order_id=" + orderId + ",order_type=" + orderType + ",pay_type=2,app_type=3,openid=" + openId + "}")
                    // let sign = md5js.md5( "{order_id=" + orderId + ",order_type=" + orderType + ",pay_type=2,app_type=3,openid=" + openId + "}");
                    // let url = "/mobile/pay/get";
                    let params = {
                        "order_id": orderId,
                        "order_type": orderType,
                        "pay_type": "2",
                        "app_type": "3",
                        "openid": openId
                    };
                    // util.getpublicrequest( url, token, sign, data, function ( res ) {
                    app.post(app.url_commonOrderPay, params, function (res) {//普通报修支付请求接口
                        if (res.data.code == "SUCCESS" && res.data.bizCode == "OPER_SUCCESS") {
                        //  that.setData({
                        //    price: "",
                        //    descriptions: "",
                        //    item: "",
                        //    hidequ: true,
                        //    casIndex: "",
                        //    casIndex2: "",
                        //    casIndex3: "",
                        //    repdescripts: ""
                        //  })
                            console.log(res);
                            that.setData({
                                urlArr: [],
                                disablesub: true
                            })
                            let jsonObj = res.data ;
                            console.log( jsonObj );
                            console.log(res.data)
                            console.log( jsonObj.data.paySignOrPrepayid );
                            let packages = jsonObj.data.paySignOrPrepayid;
                            let noncestrs = Math.random().toString( 36 ).substr( 2, 15 );
                            let timestamps = Date.parse( new Date() );
                            timestamps = timestamps / 1000;
                            let stringA = 'appId=wxfc1b21407fd6879e' + '&nonceStr=' + noncestrs + '&package=prepay_id=' + packages + '&signType=MD5&timeStamp=' + timestamps + "&key=yuhaohulianwangkejiyouxiangongsi";
                            let paysign = md5js.md5( stringA ).toUpperCase();

                            wx.requestPayment( {
                                'timeStamp': timestamps.toString(),
                                'nonceStr': noncestrs,
                                'package': 'prepay_id=' + packages,
                                'signType': 'MD5',
                                'paySign': paysign,
                                'success': function ( res ) {
                                    wx.navigateTo( {
                                        url: '../urgent/urgent?currentTab=1',
                                    } );
                                    console.log( res )
                                },
                                'fail': function ( res ) {
                                    wx.navigateTo( {
                                        url: '../urgent/urgent?currentTab=0',
                                    } );
                                    console.log( res )
                                },
                                'complete': function ( res ) {
                                    console.log( res );
                                    that.setData( {
                                        price: "",
                                        descriptions: "",
                                        imgs: []
                                    } )
                                }
                            } )
                        }else{
                            // that.show(res.data.msg)
                        }
                    }, function () {
                        return false;
                    } )
                }else{
                   
                    // that.show(res.data.msg)
                }
            }, function () {
                return false;
            } )
        } else if ( that.data.currentTab === 1 ) {//售后报修订单提交
            let protime = this.data.levelId
            // let repdescripts = params.repdescripts
            let phone = formdata.phone;
            let repprovince = this.data.repprovince;
            let repcity = this.data.repcity;
            let repdescripts = formdata.repdescripts;
            let repaddress = formdata.repaddress;
            let cusUserId = userData.customer.cusUserId
            let storeId = userData.customer.storeId
            console.log(protime, phone, repprovince, repcity, repdescripts, repaddress, cusUserId, storeId)
            if(that.data.hidequ){
                let repsubtype = this.data.repChildId
                console.log(repsubtype)
                // let protime = this.data.levelId
                // // let repdescripts = params.repdescripts
                // let phone = e.detail.value.phone;
                // let repprovince = this.data.repprovince;
                // let repcity = this.data.repcity;
                // let repdescripts = e.detail.value.repdescripts;
                // let repaddress = e.detail.value.repaddress;
                // let cusUserId = userData.customer.cusUserId
                // let storeId = userData.customer.storeId
                let data ={
                    "cusUserId": cusUserId,
                    "storeId": storeId,
                    "repChildId": repsubtype,
                    "levelId": protime,
                    "phone": phone,
                    "description": repdescripts,
                    "proofImage": target_image
                }
                that.setData({
                    params:data
                })
            }else {
                let repsubtype = that.data.repChildId;
                let equnumber = that.data.showequ[0];
                console.log(repsubtype, equnumber)
                let data = {
                    "cusUserId": cusUserId,
                    "storeId": storeId,
                    "repChildId": repsubtype,
                    "levelId": protime,
                    "phone": phone,
                    "description": repdescripts,
                    "proofImage": target_image,
                    "equNum": equnumber
                };
                that.setData({
                    params:data
                })
            }
           
            // let params = {
            //   "cusUserId": cusUserId,
            //   "storeId": storeId,
            //   "repChildId": repsubtype,
            //   "levelId": protime,
            //   "phone": phone,
            //   "description": repdescripts,
            //   "proofImage": target_image
            // };
            let param = this.data.params
            console.log(param)
            app.post(app.url_afterOrderAdd, this.data.params, function (res) {//售后报修订单添加
                // wx.showToast({
                //     title: '提交中...',
                //     icon: "loading",
                // })
                console.log(res.data)
                if (res.data.code == "SUCCESS" && res.data.bizCode == "OPER_SUCCESS") {
                    that.setData({
                        urlArr: [],
                        disablesub: true
                    })
                    wx.navigateTo({
                        url: '../aftersalserepair/aftersalserepair',
                    })
                    console.log(res.data)
                    that.setData({
                        casIndex: "",
                        casIndex2: "",
                        casIndex3: "",
                        repdescripts: "",
                        imgs: [],
                        hidequ: true,
                    })
                } else {
                    that.show(res.data.msg)
                    // return false;
                    // that.show(res.data.msg)
                }
            },function(res){
                return false;
                // that.show("失败")  
                // that.show(res.data.msg)
            })
        }
    },

  
    //提交表单
    formSubmit: function ( e ) {
        let that = this;
        // let formData = e.detail.value//获取表单所有input的值
        let userData = app.getUserData();
        let token = userData.token;
        let location = wx.getStorageSync( "location" );
        let logininfo = wx.getStorageSync( 'logininfo' );
        if (userData == '' || userData == '[]' || userData == null  ) {
            that.show("请先登录");
            return false;
        }
        if ( that.data.currentTab === 0 ) {
            // 传入表单数据，调用验证方法
            if ( !validateComm.checkForm( e ) ) {
                const error = validateComm.errorList[0];
                this.showModal( error );
                return false
            } else if (that.data.imgs.length <= 0) {// 验证是否选择了图片
                // that.showModal({ msg: '请至少上传1张维修目标图片' });
                that.show("请至少上传1张维修目标图片")
                return false;
            } else {
                let that = this;
                // 到此 所有的都验证通过
                // 使用then()将异步转换为同步
                that.uploadImages().then(function () {
                    that.addOrder(e);
                }).catch(function (err) {
                    console.log(err);
                });
            }
        } else if ( that.data.currentTab === 1 ) {
            // // 传入表单数据，调用验证方法
            // if (!validateAfter.checkForm(e)) {
            //   const error = validateAfter.errorList[0];
            //   this.showModal(error);
            //   return false
            // }
            if (this.data.casIndex === '') {
                that.show("请选择维修类型")
            } else if (this.data.casIndex2 === '') {
                that.show("请选择维修项目")
            } else if (this.data.casIndex3 === '') {
                that.show("请选择报修时效")
            } else if (e.detail.value.repdescripts === '') {
                that.show("请填写维修说明")
            } else if (that.data.imgs.length <= 0) {// 验证是否选择了图片
                // that.showModal({ msg: '请至少上传1张维修目标图片' });
                that.show("请至少上传1张维修目标图片")
                return false;
            }
            else {
                let that = this;
                // 到此 所有的都验证通过
                // 使用then()将异步转换为同步
                that.uploadImages().then(function () {
                    that.addOrder(e);
                }).catch(function (err) {
                    console.log(err);
                });
            }
        }
    }, function ( error ) {
        console.log( error );
    },


    // 删除图片
    deleteImg: function ( e ) {
        let imgs = this.data.imgs;
        let index = e.currentTarget.dataset.index;
        imgs.splice( index, 1 );
        this.setData( {
            imgs: imgs
        } );
    },
    // 预览图片
    previewImg: function ( e ) {
        //获取当前图片的下标
        let index = e.currentTarget.dataset.index;
        //所有图片
        let imgs = this.data.imgs;
        wx.previewImage( {
            //当前显示图片
            current: imgs[index],
            //所有图片
            urls: imgs
        } )
    },


    initValidateComm() {
        // 验证字段的规则
        const rules = {
            phone: {
                required: true,
                tel: true
            },
            address: {
                required: true,
            },
            price: {
                required: true,
                min: 0.01,
                max: 999999
            },
            descriptions: {
                required: true,
                minlength: 2,
                maxlength: 140
            }
        };

        // 验证字段的提示信息，若不传则调用默认的信息
        const messages = {
            phone: {
                required: '请输入手机号码',
                tel: '手机号码格式错误!'
            },
            address: {
                required: "请选择详细地址"
            },
            price: {
                required: '请填写维修费用',
                min: '请输入正确的维修费用, 且至少 0.01 元',
                max: '维修费用不得大于 999999.00 元'
            },
            descriptions: {
                required: '请录入报修说明',
                minlength: '报修说明至少2个字符',
                maxlength: '报修说明不得多于140个字符'
            }
        };

        // 创建实例对象
        validateComm = new WxValidate( rules, messages );
        // 自定义验证规则
    },

    // initValidateAfter() {
    //     // 验证字段的规则
    //     const rules = {
    //         casIndex: {
    //             required: true
    //         },
    //         casIndex2: {
    //             required: true
    //         },
    //         casIndex3: {
    //             required: true
    //         },
    //         phone: {
    //             required: true,
    //             tel: true
    //         },
    //         repprovince: {
    //             required: true
    //         },
    //         // repcity:{
    //         //   required: true
    //         // },
    //         // repdistrict:{
    //         //   required: true
    //         // },
    //         repaddress: {
    //             required: true,
    //         },
    //         descriptions: {
    //             required: true,
    //             minlength: 2,
    //             maxlength: 140
    //         }
    //     };
    //     // 验证字段的提示信息，若不传则调用默认的信息
    //     const messages = {
    //         casIndex: {
    //             required: "请选择维修类型"
    //         },
    //         casIndex2: {
    //             required: "请选择维修项目"
    //         },
    //         casIndex3: {
    //             required: "请选择报修时效"
    //         },
    //         phone: {
    //             required: '请输入手机号码',
    //             tel: '手机号码格式错误!'
    //         },
    //         repprovince: {
    //             required: "请选择维修地址"
    //         },
    //         repaddress: {
    //             required: "请选择详细地址"
    //         },
    //         repdescripts: {
    //             required: '请录入报修说明',
    //             minlength: '报修说明至少2个字符',
    //             maxlength: '报修说明不得多于140个字符'
    //         }
    //     };
    //     // 创建实例对象
    //     validateAfter = new WxValidate( rules, messages );
    //     // 自定义验证规则
    // },

    showModal( error ) {
        // wx.showModal({
        //   content: error.msg,
        //   showCancel: false
        // });
        this.setData( {
            content: error.msg,
            isHide: false
        } );
        this.show( this.data.content )
    },
    clearinform: function ( e ) {
        console.log( '正在修改 => ' + JSON.stringify( e ) );
    }

} );