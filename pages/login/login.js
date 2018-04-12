const app = getApp()

Page({
  data: {
    username: '',
    password: '',
    tipText: '',
    isLogin: false,
  },
  onLoad: function () {

  },
  onShow: function () {
    this.checkIsLogin();
  },
  checkIsLogin: function () {
    if (app.globalData.userId !== null) {
      this.setData({
        isLogin: true,
      })
    }
  },
  bindUsernameInput: function (e) {
    this.setData({
      username: e.detail.value
    });
  },
  bindPasswordInput: function (e) {
    this.setData({
      password: e.detail.value
    });
  },
  login: function () {
    const self = this;
    wx.request({
      url: app.globalData.loginUrl,
      data: {
        username: this.data.username,
        password: this.data.password,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      dataType: 'json',
      success: function(res) {
        if (res.statusCode === 200) {
          if (res.data.code === 200) {
            const userId = res.data.data.id;
            app.globalData.userId = userId;
          //  跳转到 数据统计 页面
            console.log('login.js: 43 -> success -> ', userId);
            self.checkIsLogin();
            // wx.switchTab({
            //   url: '../data/data'
            // });
          } else {
            self.setData({
              tipText: res.data.msg,
            });
          }

        }
      }
    });
  },

  goToRegister: function () {
    wx.navigateTo({
      url: '../register/register',
    })
  }
})
