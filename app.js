//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  getUserInfo: function (cb) {
    var that = this;
    if (this.globalData.userInfo) {
      console.log("已登录（uid正常）！");
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      console.log("未获取到uid，已重新获取登录！");
      //调用登录接口
      wx.login({
        success: function (result) {
          //发送请求
          if (result.code) {
            //发起网络请求
            wx.request({
              url: 'https://api.chinayunma.com/Wxpay/wxlogin/code/' + result.code,
              success: function (res) {
                console.log(res);
                wx.setStorageSync('LoginSessionKey', res.data);
                that.globalData.uid = res.data;
              }
            })
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }

          //获取用户信息
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo;
              that.globalData.uid = wx.getStorageSync('LoginSessionKey');
              typeof cb == "function" && cb(that.globalData.userInfo)
            },
            fail: function () {
              wx.showModal({
                title: '提示',
                content: '需要获取您的用户信息，确认授权后再进行相关操作',
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    wx.openSetting({
                      success: function (res) {
                        if (!res.authSetting["scope.userInfo"] || !res.authSetting["scope.userLocation"]) {
                          that.globalData.userInfo = res.userInfo;
                          that.globalData.uid = wx.getStorageSync('LoginSessionKey');
                          typeof cb == "function" && cb(that.globalData.userInfo)
                        }
                      }
                    })
                  }
                }
              })
            }
          })
        }
      })
      that.globalData.pleaseLogin = '立即购买';
    }
  },
  globalData: {
    userInfo: null,
    pleaseLogin: '',
    uid: null
  }
})