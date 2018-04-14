var app = getApp();
function countdownTop(that) {
  var EndTime = that.data.buy_end_time || [];
  var NowTime = new Date().getTime();
  var total_micro_second = EndTime * 1000 - NowTime || [];
  // console.log('剩余时间：' + total_micro_second);
  // 渲染倒计时时钟
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
    countdownTop(that);
  }
    , 1000)
}

// 时间格式化输出
function dateformat(micro_second) {
  // 总秒数
  var second = Math.floor(micro_second / 1000);
  // 天数
  var day = Math.floor(second / 3600 / 24);
  // 小时
  var hr = Math.floor(second / 3600 % 24) < 10 ? '0' + Math.floor(second / 3600 % 24) : Math.floor(second / 3600 % 24);
  // 分钟
  var min = Math.floor(second / 60 % 60) < 10 ? '0' + Math.floor(second / 60 % 60) : Math.floor(second / 60 % 60);
  // 秒
  var sec = Math.floor(second % 60) < 10 ? '0' + Math.floor(second % 60) : Math.floor(second % 60);
  return "仅剩" + day + "天" + hr + "小时" + min + "分钟" + sec + "秒";
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hide: false,     //加载动画的显示与隐藏
    nullHide: true,
    classify: [],    //顶部导航分类
    recommend: [],   //热门推荐
    more: [],        //超值体验
    top: {},         //
    goods: [],
    winHeight: "",//窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    buy_end_time: '',
    clock: '',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 获取数据接口
    wx.request({
      url: 'https://api.chinayunma.com/ticket/api_ticket_list',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        //超值体验  最多只展示4个
        var more_arr = [];
        more_arr = res.data.more;
        that.setData({
          top: res.data.top,
          recommend: [].concat(res.data.recommend),
          more: [].concat(more_arr),
          classify: [].concat(res.data.classify),
          goods: [].concat(res.data.goods),
          buy_end_time: res.data.top.buy_end_time
        })
      }
    })
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 180;
        that.setData({
          winHeight: calc
        });
      }
    });

    //加载动画
    setTimeout(function () {
      that.setData({
        hide: true
      })
    }, 500);
    countdownTop(that)
  },

  //监听页面显示
  onShow: function () {
    var that = this;
    app.getUserInfo(function (userInfo) {
      //更新数据  
      that.setData({
        userInfo: userInfo,
        nullHide: false
      })
    }) 
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    app.getUserInfo(function (userInfo) {
      //更新数据  
      that.setData({
        userInfo: userInfo,
        nullHide: false
      })
    })  
    wx.showNavigationBarLoading();
    var that = this;
    that.setData({
      hide: false
    })
    wx.request({
      url: 'https://api.chinayunma.com/ticket/api_ticket_list',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        //超值体验  最多只展示4个
        var more_arr = [];
        more_arr = res.data.more;
        that.setData({
          top: res.data.top,
          recommend: [].concat(res.data.recommend),
          more: [].concat(more_arr),
          classify: [].concat(res.data.classify),
          goods: [].concat(res.data.goods),
          buy_end_time: res.data.top.buy_end_time
        })
      },
      complete: function() {
        wx.hideNavigationBarLoading();
      }
    })
    setTimeout(function () {
      that.setData({
        hide: true
      })
    }, 500)
    wx.stopPullDownRefresh()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '自定义转发标题',
      path: '/pages/index/index',
      success: function (res) {
        console.log('success')
      },
      fail: function (res) {
        console.log('fail')
      }
    }
  },

  onHide: function () {
    
  }
})