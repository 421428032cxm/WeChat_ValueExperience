Page({

  /**
   * 页面的初始数据
   */
  data: {
     detail: {},
     tips: [],
     tipsDes: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var tips = [];
    var tipsDes = []
     wx.request({
       url: 'https://api.chinayunma.com/Ticketorder/refund_detail.html?id=' + options.id, 
       success: function (res) {
         console.log(res);
         if (res.data.state == 10){
            tips = ['审核中', '审核通过', '退款成功'];
            tipsDes = ['退款申请已受理，我们会在一个工作日内完成审核', '审核通过后等待退款处理', '退款成功，请注意查收']
         } else if (res.data.state == 11) {
            tips = ['审核中', '审核通过', '退款成功'];
            tipsDes = ['退款申请已受理，我们会在一个工作日内完成审核', '审核通过后等待退款处理', '退款成功，请注意查收']
         } else{
           tips = ['审核中', '审核未通过', '退款失败'];
           tipsDes = ['退款申请已受理，我们会在一个工作日内完成审核', '审核未通过，请联系客服询问', '退款失败，请联系客服人员']
         }
         that.setData({
           detail: res.data,
           tips: tips,
           tipsDes: tipsDes
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