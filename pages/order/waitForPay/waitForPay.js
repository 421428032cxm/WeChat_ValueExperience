var app = getApp();
var WxParse = require('../../../wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
     detail: {},
     orderStaic: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  
  //立即付款
  payNow: function () {
     var that = this;
     var order_sn = that.data.detail.order.order_sn;
     var totalCount = that.data.detail.order.amount;
     wx.navigateTo({
       url: '../../payResult/goToPay/goToPay?order_sn=' + order_sn + '&totalCount=' + totalCount,
     })
  },
  
  //申请退款
  applyForRefund: function () {
     var that = this;
     wx.request({
       url: 'https://api.chinayunma.com/Ticketorder/order_refund.html?id=' + that.data.detail.order.id,
       success: function (res) {
         console.log(res);
          wx.navigateTo({
             url: '../../refund/applyRefund/applyRefund?id=' + that.data.detail.order.id,
          })
       }
     })
  },

  //查看退款详情
  refundDetail: function () {
     var that = this;
     wx.navigateTo({
       url: '../../refund/refundDetail/refundDetail?id=' + that.data.detail.order.id,
     })
  },

  //取消订单
  cancelOrder: function (e) {
    var that = this;
    wx.request({
      url: 'https://api.chinayunma.com/Ticketorder/order_cancal.html?id=' + that.data.detail.order.id,
      success: function (res) {
        wx.showToast({
          title: '订单已取消',
          icon: 'success',
        })
        //延迟2秒之后 返回我的订单列表页
      setTimeout(function(){
          wx.switchTab({
            url: '../../orderList/orderList',
          })
        },2000)
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
    var that = this;
    var orderStaic = '';
    wx.request({
      url: 'https://api.chinayunma.com/Ticketorder/order_detail.html?id=' + that.options.id,
      success: function (res) {
        var orderInfo = res.data.order;
        var desc_alert = res.data.good.desc_alert;
        WxParse.wxParse('desc_alert', 'html', desc_alert, that, 5);

        if (orderInfo.refund_state == 1) {
          switch (orderInfo.state) {
            case 10:
              orderStaic = 10
              break;
            case 20:
              orderStaic = 20
              break;
            case 30:
              orderStaic = 30
              break;
            case 40:
              orderStaic = 40
              break;
            case 50:
              orderStaic = 50
              break;
            case 60:
              orderStaic = 60
              break;
          }
        } else if (orderInfo.refund_state == 0) {
          orderStaic = 80
        } else {
          orderStaic = 70
        }

        that.setData({
          detail: res.data,
          orderStaic: orderStaic
        })
      }
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
    var that = this;
    var orderStaic = '';
    wx.request({
      url: 'https://api.chinayunma.com/Ticketorder/order_detail.html?id=' + that.options.id,
      success: function (res) {
        var orderInfo = res.data.order;
        var desc_alert = res.data.good.desc_alert;
        WxParse.wxParse('desc_alert', 'html', desc_alert, that, 5);

        if (orderInfo.refund_state == 1) {
          switch (orderInfo.state) {
            case 10:
              orderStaic = 10
              break;
            case 20:
              orderStaic = 20
              break;
            case 30:
              orderStaic = 30
              break;
            case 40:
              orderStaic = 40
              break;
            case 50:
              orderStaic = 50
              break;
            case 60:
              orderStaic = 60
              break;
          }
        } else if (orderInfo.refund_state == 0) {
          orderStaic = 80
        } else {
          orderStaic = 70
        }

        that.setData({
          detail: res.data,
          orderStaic: orderStaic
        })
      }
    })
    wx.stopPullDownRefresh()
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