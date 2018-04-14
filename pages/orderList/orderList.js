var app = getApp();
var page = 1;   //默认查询第一页的数据
var pages = null;
var stateStatic = 0;  //默认显示全部 
var getUid = wx.getStorageSync('LoginSessionKey');
var finalUid = '';
//加载数据
var loadMore = function (that) {
  if(app.globalData.uid != ""){
    finalUid = app.globalData.uid;
  }else{
    finalUid = getUid;
  }
  
  that.setData({
    hide: false
  });
  
  wx.request({
    url: 'https://api.chinayunma.com/Ticketorder/getOrders.html?uid=' + finalUid + '&page=' + page + '&state=' + stateStatic,
    success: function (res) {
      pages = res.data.pages;
      var list = [];
      for (var i = 0; i < res.data.orders.length; i++) {
        if (res.data.orders[i].refund_state == 1) {
          switch (res.data.orders[i].state) {
            case 10:
              res.data.orders[i].payment = '待付款';
              res.data.orders[i].pay_sn = '#fdab4a';
              res.data.orders[i].common_time = '付款';
              break;
            case 20:
              res.data.orders[i].payment = '待使用'
              res.data.orders[i].pay_sn = '#21bdad';
              res.data.orders[i].common_time = '查看卷码';
              break;
            case 30:
              res.data.orders[i].payment = '使用中'
              res.data.orders[i].pay_sn = '#fd4a8b';
              res.data.orders[i].common_time = '查看卷码';
              break;
            case 40:
              res.data.orders[i].payment = '已完成'
              res.data.orders[i].pay_sn = '#fdab4a';
              break;
            case 50:
              res.data.orders[i].payment = '已取消'
              res.data.orders[i].pay_sn = '#999999';
              break;
            case 60:
              res.data.orders[i].payment = '已过期'
              res.data.orders[i].pay_sn = '#999999';
              break;
          }
        } else if (res.data.orders[i].refund_state == 0) {
          //已退款
          res.data.orders[i].payment = '已退款'
          res.data.orders[i].pay_sn = '#999999';
        } else {
          //退款中
          res.data.orders[i].payment = '退款中'
          res.data.orders[i].pay_sn = '#fdab4a';
        }
      }

      if(stateStatic == 0){
        list = that.data.all;
        for (var i = 0; i < res.data.orders.length; i++) {
          list.push(res.data.orders[i]);
        }
      }else{
        if (res.data.orders.length == 0){
            list = [];
        }else{
          for (var i = 0; i < res.data.orders.length; i++) {
            list.push(res.data.orders[i]);
          }
        }
      }
      //刷新数据
      that.setData({
        all: list
      })
       page++;
    }
  })
    //数据加载/刷新完毕后，移除加载动画
    setTimeout(function(){
      that.setData({
        hide: true
      })
    },200)
}

Page({
  data: {
    hide: false,
    // 页面配置 
    winWidth: 0,
    winHeight: 0,
    // tab切换
    currentTab: 0,
    all: [],
    scrollTop: 0,
    userInfo: {},
  },

  onLoad: function () {
    var that = this;
    getUid = wx.getStorageSync('LoginSessionKey');
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 90;
        that.setData({
          winHeight: calc
        });
      }
    });
    loadMore(that);
  },
  
  //监听页面显示
  onShow: function () {
    var that = this;
    getUid = wx.getStorageSync('LoginSessionKey');
    app.getUserInfo(function (userInfo) {
      //更新数据  
      that.setData({
        userInfo: userInfo,
        nullHide: false
      })
    })
  },

  //付款或查看卷码操作
  detailClick: function (e) {
      var dataId = e.currentTarget.dataset.id;
      var dataState = e.currentTarget.dataset.state;
      var order_sn = e.currentTarget.dataset.out_trade_no;
      var totalCount = e.currentTarget.dataset.count;

      if (dataState == 10){
        wx.navigateTo({
          url: '../payResult/goToPay/goToPay?order_sn=' + order_sn + '&totalCount=' + totalCount,
        })
      }else{
        wx.navigateTo({
          url: '../order/checkVolume/checkVolume?id=' + dataId,
        })
      }
  },
  
  // 滑动切换tab
  bindChange: function (e) {
    page = 1;
    var that = this;
    stateStatic = e.detail.current;
    loadMore(that);
    that.setData({
      all: [],
      currentTab: e.detail.current
    })  
  },
  // 点击tab切换
  swichNav: function (e) {
    page = 1;
    var that = this;
    stateStatic = e.currentTarget.dataset.current;
    loadMore(that);
    that.setData({
      all: [],
      currentTab: e.currentTarget.dataset.current
    })
  },

  // 上拉加载更多
  pullUpLoad: function () {
    var that = this;
    console.log(page);
    console.log(pages);
    if(page < pages + 1 ) {
      loadMore(that);
    }else{
      console.log("到底了！");
    }
  },
  
  //下拉刷新数据
  onPullDownRefresh: function(){
    var that = this; 
    that.setData({
      hide: false
    });
    loadMore(that);
    setTimeout(function () {
      that.setData({
        hide: true
      })
    }, 500)
    wx.stopPullDownRefresh()
  }
})