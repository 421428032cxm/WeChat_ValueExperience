// pages/order/payment/payment.js
var app = getApp();
var WxParse = require('../../../wxParse/wxParse.js');

var total_micro_second = 1800 * 1000;
function countdown(that) {
  that.setData({
    clock: dateformat(total_micro_second)
  });
  if (total_micro_second <= 0) {
    that.setData({
      clock: "已经截止"
    });
    //return;
  }
  setTimeout(function () {
    total_micro_second -= 1000;
    countdown(that);
  }
    , 1000)
}


// 时间格式化输出，如11:03 25:19 每1s都会调用一次
function dateformat(micro_second) {
  // 总秒数
  var second = Math.floor(micro_second / 1000);
  // 天数
  var day = Math.floor(second / 3600 / 24);
  // 小时
  var hr = Math.floor(second / 3600 % 24);
  // 分钟
  var min = Math.floor(second / 60 % 60);
  // 秒
  var sec = Math.floor(second % 60);
  return "请于" + min + "分钟" + sec + "秒内付款";
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    clock: '',  //时钟
    data: {}
  },
  
  formSubmit: function (e) {
    console.log(this);
    console.log(e);
    var that = this;
    var orderData = that.data.data;
    var sms = 0;
    if (e.detail.value.sms == true){
       sms = 1
    }
    wx.request({
      url: 'https://api.chinayunma.com/ticket/order.html?goods_id=' + orderData.order.goods_id + '&goods_count=' + orderData.order.goods_count + '&uid=' + orderData.order.uid + '&user_name=' + orderData.order.user_name + '&tel=' + orderData.order.tel + '&sid=' + orderData.shop.id + '&sname=' + orderData.shop.name + '&sms=' + sms + '&message=' + e.detail.value.message,
      header: {
        'content-type': 'application/json' 
      },
      success: function (res) {
        console.log(res);
        var totalCount = orderData.order.goods_count * orderData.good.price;
        wx.navigateTo({
          url: '../../payResult/goToPay/goToPay?totalCount=' + totalCount + '&order_sn=' + res.data.order_sn + '&uid=' + orderData.order.uid,
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var that = this;
    wx.request({
      url: 'https://api.chinayunma.com/ticket/buy_info.html?goods_id=' + options.goods_id + '&goods_count=' + options.goods_count + '&uid=' + options.uid + '&user_name=' + options.user_name + '&tel=' + options.tel + '&sku_id=' + options.sku_id, 
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res);
        var desc_alert = res.data.good.desc_alert;
        WxParse.wxParse('desc_alert', 'html', desc_alert, that, 5);
        that.setData({
          data: res.data
        })
      }
    })

    // countdown(that);
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