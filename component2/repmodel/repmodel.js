// component2/repmodel/repmodel.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // dialogHidden:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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

Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },

  properties: {

    dialogHidden: {
      type: Boolean,
      value: true
    },

    determineBtn: {
      type: Boolean,
      value: true,
    },

    // cancleBtn: {
    //   type: Boolean,
    //   value: true,
    // },
  },

  data: {
    // 这里是一些组件内部数据
    onCancleClick: false,
  },
  
  methods:{

    // 这里是一个自定义方法,取消
    // cancleBtn: function () {
    //   let pro = new Properties();
    //   console.log("点击确认按钮")
    //   this.setData({
    //     dialogHidden: true,
    //   })
    // },

    // 确定

    determineBtn: function () {
      // let determineDetail =
      // this.data.inputValue // detail对象，提供给事件监听函数
      // this.triggerEvent('determineevent', determineDetail)
      this.setData({
        dialogHidden: true,
      })
    }
  }
})