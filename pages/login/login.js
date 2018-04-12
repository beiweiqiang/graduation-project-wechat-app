const app = getApp()

Page({
  data: {
    username: '',
    password: '',
    tipText: '',
  },
  onLoad: function () {
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
            wx.navigateTo({
              url: '../data/data',
            })
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
