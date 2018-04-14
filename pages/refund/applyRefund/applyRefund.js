var app = getApp();
// var uid = wx.getStorageSync('LoginSessionKey');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {}
  },
  
  formSubmit: function (e) {
    console.log(e);
    var that = this;
    console.log(that);
    wx.request({
      url: 'https://api.chinayunma.com/Ticketorder/refund_post.html',
      data: {
        order_id: that.options.id,
        uid: app.globalData.uid,
        reason: e.detail.value.checkbox
      },
      success: function (res) {
        setTimeout(function (){
          wx.showToast({
            title: '申请退款成功',
            icon: 'success',
            duration: 2000
          })
        },500)
        
        setTimeout(function(){
          wx.redirectTo({
            url: '../../order/waitForPay/waitForPay?id=' + that.options.id,
          })
        },2500)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: 'https://api.chinayunma.com/Ticketorder/apply_refund.html?id=' + options.id,
      success: function (res) {
        that.setData({
          detail: res.data
        })
      }
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