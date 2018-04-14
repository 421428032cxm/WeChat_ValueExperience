var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
     clock: '',
     detail: {},
     verify: [],
     goods: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options);

    wx.request({
      url: 'https://api.chinayunma.com/wxpay/complete.html?order_sn=' + options.order_sn + '&type=1', 
      success: function (res) {
        console.log(res);
        that.setData({
           detail: res.data,
           verify: [].concat(res.data.verify),
           goods: [].concat(res.data.goods)
        })
      }
    })
    // countdown(this);
  },

  //返回首页
  toIndexClick: function () {
      wx.switchTab({
        url: '../../index/index',
      })
  },

  //跳转到我的订单页
  toOrderClick: function () {
    wx.switchTab({
      url: '../../orderList/orderList',
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