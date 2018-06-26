module.exports = {
  showZanToast(title, timeout) {
    let zanToast = this.data.zanToast || {};
    clearTimeout(zanToast.timer);

    // 弹层设置~
    zanToast = {
      show: true,
      title
    };
    this.setData({
      zanToast
    });

    let timer = setTimeout(() => {
      this.clearZanToast();
    }, timeout || 3000);

    this.setData({
      'zanToast.timer': timer
    });
  },

  clearZanToast() {
    let zanToast = this.data.zanToast || {};
    clearTimeout(zanToast.timer);

    this.setData({
      'zanToast.show': false
    });
  }
};
