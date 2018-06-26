// pages/urgentdetail/urgentdetail.js
let app = getApp();
let util = require('../../utils/util.js');
let md5js = require('../../utils/md5.js');
let userData = wx.getStorageSync("user_data") || [];
let token = userData.token;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        orderId:"",
        hidimg:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this
        this.setData({
        orderId: options.order_id
        })
    },

    previewImg: function (e) {
        let imgstr = this.data.details.targetImage.toString();//将存放的图片转换成字符串形式
        let imgArr = imgstr.split(",")//对图片进行分割并将每条记录中的图片存放至对象的数组中
        // let imgNew = [];
        // for (let index in imgArr) {
        //     imgNew.push(imgurl + imgArr[index])
        // }
        console.log(e)
        console.log(imgstr)
        console.log(imgArr)
        
        //获取当前图片的下标
        let index = e.currentTarget.dataset.src;
        //所有图片
        wx.previewImage({
        //当前显示图片
        current: index,
        //所有图片
        urls: this.data.targetImage,
        })
    },
    previewImg2: function (e) {
        let repimgstr = this.data.details.proofImage.toString();//维修后图片
        let repimgArr = repimgstr.split(",")
        if (this.data.details.proofImage == "") {
            this.setData({
                hidimg: true
            })
        }
        console.log(e)
        //获取当前图片的下标
        let index = e.currentTarget.dataset.src;
        //所有图片
        wx.previewImage({
        //当前显示图片
        current: index,
        //所有图片
        urls: repimgArr
        })
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
        let that = this
        that.setData({
        hidimg: false
        })
        console.log(this.data.orderId)
        let orderid = this.data.orderId
        let url = "/mobile/order/common_order/details"
        userData = wx.getStorageSync("user_data") || [];
        token = userData.token
        let sign = md5js.md5("{order_id=" + orderid + "}")
        let data = {
        "order_id": orderid
        }
        console.log("{order_id=" + orderid + "}")
        util.getpublicrequest(url, token, sign, data, function (res) {
        console.log(res.data)
        if (res.data.code == "SUCCESS" && res.data.bizCode == 'OPER_SUCCESS'){
            console.log(res)
            let imgurl = app.domain_img
            let datas = res.data.data
            // console.log("datas:------:", datas)
            // console.log("datas.targetImage:------:", datas.targetImage)
            if (datas.targetImage.indexOf(imgurl) != 0 || datas.proofImage.indexOf(imgurl) != 0) {
            if (datas.proofImage == ""){
                let imgstr = datas.targetImage.toString();
                let imgArr = imgstr.split(",");
                let imgNew = [];
                for ( let index in imgArr ) {
                    imgNew.push(imgurl + imgArr[index])
                }
                // console.log("imgNew.toString():-----" + imgNew.toString());
                // datas.targetImage = imgurl + imgArr[0];
                datas.createTime = util.formatTime(new Date(datas.createTime))
                datas.enterTime = util.formatTime(new Date(datas.enterTime))
                datas.payTime = util.formatTime(new Date(datas.payTime))
                // console.log(imgArr)
                // console.log(imgstr)            
                // console.log(datas.targetImage)
                that.setData({
                details: datas, 
                targetImage: imgNew,
                hidimg: true
                })
            }else{
                let imgstr = datas.targetImage.toString();//将存放的图片转换成字符串形式,报修图片
                let repimgstr = datas.proofImage.toString();//维修后图片
                let imgArr = imgstr.split(",")//对图片进行分割并将每条记录中的图片存放至对象的数组中
                let repimgArr = repimgstr.split(",")
                // datas.targetImage = imgurl + imgArr[0];//获取分割好的数组图片中的第一张并赋值
                let imgNew = [];
                for (let index in imgArr) {
                    imgNew.push(imgurl + imgArr[index])
                }
                datas.proofImage = imgurl + repimgArr[0];
                datas.createTime = util.formatTime(new Date(datas.createTime))// 时间戳转换
                datas.enterTime = util.formatTime(new Date(datas.enterTime))
                datas.payTime = util.formatTime(new Date(datas.payTime))
                //通过that 拿到createTime的值for循环出来
                // console.log(imgArr)
                // console.log(datas.targetImage)
                // console.log(datas.proofImage)
                that.setData({
                    targetImage: imgNew,
                })
            }
            that.setData({
                details: datas, //将改好时间格式与图片遍历出来
            })
            }
        }else{
            console.log("this====="+res.data)
            return false;
        }
        }, function (res) {
            return false;
        })
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