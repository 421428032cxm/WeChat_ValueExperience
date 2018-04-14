var app = getApp();
var WxParse = require('../../wxParse/wxParse.js');

function countdown(that) {
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
    countdown(that);
  }
    , 1000)
}


// 时间格式化输出, 每1s都会调用一次
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
  return "剩余" + day + "天" + hr + "小时" + min + "分钟" + sec + "秒";
}

//时间戳转换日期
function toDate(number) {
  var n = number * 1000;
  var date = new Date(n);
  var Y = date.getFullYear();
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  return (Y + '年' + M + '月' + D + '日')
} 

Page({
  /**
   * 页面的初始数据
   */
  data: {
    hide: false,
    disableBtn: false,   //禁用购买按钮
    detail: {},
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 500,
    navbar: ['店铺详情', '家长须知'],
    currentTab: 0,
    currentShop: 0,
    submit: '',
    buy_end_time: '',
    // 购买数量默认是1  
    num: 1,
    // 使用data数据对象设置样式名  
    minusStatus: 'disabled',
    formSub: '',
    clock: '',
    act_start_time: '',
    act_end_time: '',
    uid: null
  },

  //Tab切换
  navbarTap: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  },

  //显示对话框
  showModal: function (e) {
    this.setData({
      submit: "提交订单",
      formSub: "submit"
    });
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 0)
  },

  //隐藏对话框
  hideModal: function () {
    this.setData({ 
      submit: "立即购买", 
      num: 1,
      formSub: ''
  });
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },

  checkShopClick: function (e) {
    console.log(e);
    var shopIndex = e.currentTarget.dataset.index;
    this.setData({
      currentShop: e.currentTarget.dataset.index
    })
  },

  bindMinus: function () {
    var num = this.data.num;
    // 如果大于1时，才可以减  
    if (num > 1) {
      num--;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },
  /* 点击加号 */
  bindPlus: function () {
    var limit_buy = this.data.detail.limit;
    var num = this.data.num;
    if (num >= this.data.detail.storage){
      num = this.data.detail.storage;
    }else{
      num++;
    }
    //购买数量不得超过限制购买的数量
    if (limit_buy != 0) {
      if (num >= limit_buy) {
        num = limit_buy;
      }
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num < 1 ? 'disabled' : 'normal';
  
    // 将数值与状态写回  
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },
  /* 输入框事件 */
  bindManual: function (e) {
    var num = e.detail.value;
    // 将数值与状态写回  
    this.setData({
      num: num
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.getUserInfo(function (userInfo) {
      //更新数据  
      that.setData({
        userInfo: userInfo
      })
    }) 
    
    var getCommodityId = wx.getStorageSync('LoginSessionKey');
    console.log(getCommodityId);
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        uid: app.globalData.uid
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
          uid: app.globalData.uid
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true,
            uid: app.globalData.uid
          })
        }
      })
    }

    //获取接口数据
   var gc_id = options.id || getCommodityId;
    wx.request({
      url: 'https://api.chinayunma.com/ticket/api_get_goods/id/' + gc_id,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var desc_alert = res.data.desc_alert;
        var alert_content = res.data.alert_content;
        var mobile_content = res.data.mobile_content;
        WxParse.wxParse('desc_alert', 'html', desc_alert, that, 5);
        WxParse.wxParse('alert_content', 'html', alert_content, that, 5);
        WxParse.wxParse('mobile_content', 'html', mobile_content, that, 5);
        that.setData({
           submit: app.globalData.pleaseLogin,
           detail: res.data,
           buy_end_time: res.data.buy_end_time,
           act_start_time: toDate(res.data.act_start_time),
           act_end_time: toDate(res.data.act_end_time)
        })
      }
    })

    setTimeout(function () {
      that.setData({
        hide: true
      })
    }, 500)

    countdown(that)
  },

  onShow: function () {
    
  },
  
  //表单提交
  formSubmit: function (e) {
    var shopIndex = this.data.currentShop;
    var that = this;
    var mobile = e.detail.value.phone;
    var name = e.detail.value.name;
    if (name == '') {
      wx.showToast({
        title: '姓名不能为空',
        icon: 'success',
        image: '',
        duration: 1500
      })
      return false;
    }
     //验证手机号码格式是否正确
    if (mobile.length == 0) {
      wx.showToast({
        title: '请输入手机号！',
        icon: 'success',
        duration: 1500
      })
      return false;
    }
    if (mobile.length != 11) {
      wx.showToast({
        title: '手机号长度有误！',
        icon: 'success',
        duration: 1500
      })
      return false;
    }
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!myreg.test(mobile)) {
      wx.showToast({
        title: '手机号格式不正确！',
        icon: 'success',
        duration: 1500
      })
      return false;
    }

    var sess = app.globalData.uid;
    // 请求后台接口  判断是否可以购买
    wx.request({
      url: 'https://api.chinayunma.com/ticket/buy_post.html', 
      data: {
        goods_id: that.data.detail.id,
        goods_count: e.detail.value.mount,
        uid: sess,
        user_name: e.detail.value.name,
        tel: e.detail.value.phone,
        sku_id: that.data.detail.shop[shopIndex].id
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
         //可以购买 前往订单确认页面
        if(res.data.code == 1){
          wx.navigateTo({
            url: '../order/payment/payment?user_name=' + e.detail.value.name + '&tel=' + e.detail.value.phone + '&goods_count=' + e.detail.value.mount + '&goods_id=' + that.data.detail.id + '&uid=' + sess + '&sku_id=' + that.data.detail.shop[shopIndex].id,
          })
        }
      }
    })
  },

  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    that.setData({
      hide: false
    })
    wx.request({
      url: 'https://api.chinayunma.com/ticket/api_get_goods/id/' + that.options.id,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res);
        var desc_alert = res.data.desc_alert;
        var alert_content = res.data.alert_content;
        var mobile_content = res.data.mobile_content;
        WxParse.wxParse('desc_alert', 'html', desc_alert, that, 5);
        WxParse.wxParse('alert_content', 'html', alert_content, that, 5);
        WxParse.wxParse('mobile_content', 'html', mobile_content, that, 5);
        that.setData({
          submit: app.globalData.pleaseLogin,
          detail: res.data,
          buy_end_time: res.data.buy_end_time,
          act_start_time: toDate(res.data.act_start_time),
          act_end_time: toDate(res.data.act_end_time)
        })
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var that = this;
    return {
      title: '自定义转发标题',
      path: '/pages/detailPage/detailPage?id=' + that.data.detail.id,
      success: function (res) {
        var commodityId = that.data.detail.id;
        wx.setStorageSync('commodityId', commodityId);
      },
      fail: function (res) {
        console.log('fail')
      }
    }
  }
})