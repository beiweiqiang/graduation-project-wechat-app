const app = getApp();

Page({

  data: {
    userId: app.globalData.userId,

    inputValue: '',
    robotOutput: '',
  },

  bindKeyInput: function(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  submitQuestion: function () {
    const self = this;
    wx.request({
      url: app.globalData.tulingUrl,
      data: self.requestFormat(self.data.inputValue),
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      dataType: 'json',
      success: function(res) {
        console.log('chat.js: 29 -> success -> ', res);
        if (res.statusCode === 200) {
          if (res.data.code === 200) {

          } else {
          }
        }
      }
    });
  },

  requestFormat: function (question) {
    return {
      "reqType":0,
      "perception": {
        "inputText": {
          "text": question,
        },
        "selfInfo": {
          "location": {
            "city": "广州",
            "province": "",
            "street": ""
          }
        }
      },
      "userInfo": {
        "apiKey": app.globalData.apiKey,
        "userId": app.globalData.userId,
      }
    };
  },

  onLoad: function () {

  },
  onShow: function () {
    if (app.globalData.userId === null) {
      wx.switchTab({
        url: '../login/login'
      });
    }
  }
});

