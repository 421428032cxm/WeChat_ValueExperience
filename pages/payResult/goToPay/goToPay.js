// pages/payResult/goToPay/goToPay.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalCount: null
  },

  goToPayClick: function (e) {
     console.log(this);
     var that = this;
     wx.request({
       url: 'https://api.chinayunma.com/wxpay/pay.html?uid=' + app.globalData.uid + '&order_sn=' + that.options.order_sn, 
       header: {
         'content-type': 'application/json'
       },
       success: function (res) {
         console.log(res);
         var order_sn = res.data.order_sn;
         wx.requestPayment({
           'timeStamp': res.data.timeStamp,
           'nonceStr': res.data.nonceStr,
           'package': res.data.package,
           'signType': res.data.signType,
           'paySign': res.data.paySign,
           'success': function (res) {
              console.log(res);
              wx.request({
                url: 'https://api.chinayunma.com/wxpay/orderquery.html?out_trade_no=' + order_sn,
                header: {
                  'content-type': 'application/json' // 默认值
                },
                success: function (res) {
                  wx.redirectTo({
                     url: '../success/success?order_sn=' + order_sn,
                  })
                }
              })
           },
           'fail': function (error) {
              console.log(error);
           }
         })

       }
     })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     console.log(options);
     this.setData({
       totalCount: options.totalCount
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