const app = getApp()

Page({
  data: {
    username: '',
    password: '',
    confirm: '',
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
  bindConfirmInput: function (e) {
    this.setData({
      confirm: e.detail.value
    });
  },
  register: function () {
    if (this.data.password !== this.data.confirm) {
      this.setData({
        tipText: '密码不一致'
      });
    } else {
      this.requestToRegister();
    }
  },
  requestToRegister: function () {
    const self = this;
    wx.request({
      url: app.globalData.registerUrl,
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
        console.log('register.js: 40 -> success -> ', res);
        if (res.statusCode === 200 && res.data.code === 200) {
          self.setData({
            tipText: '注册成功, 2秒后自动返回登录页面',
          });
          setTimeout(() => {
            wx.navigateBack();
          }, 2 * 1000)
        }
      }
    });
  },

  goToLogin: function () {
    wx.navigateBack();
  }
})
