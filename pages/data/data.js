const wxCharts = require('../../dist/wx-charts/wxcharts-min.js');
const app = getApp();
let pieChart = null;

Page({

  data: {
    typeArray: [
      '针对所有用户 -> 词频',
      '针对单个用户 -> 所有人 -> 词频',
      '针对单个用户 -> 所有组群 -> 词频',
      '针对单个用户 -> 每个组群内的每个人 -> 发言次数',
      '针对单个用户 -> 每个人 -> 词频',
      '针对单个用户 -> 每个组群 -> 词频'
    ],
    objectTypeArray: [
      {
        id: 0,
        name: '针对所有用户 -> 词频',
      },
      {
        id: 1,
        name: '针对单个用户 -> 所有人 -> 词频',
      },
      {
        id: 2,
        name: '针对单个用户 -> 所有组群 -> 词频',
      },
      {
        id: 3,
        name: '针对单个用户 -> 每个组群内的每个人 -> 发言次数',
      },
      {
        id: 4,
        name: '针对单个用户 -> 每个人 -> 词频',
      },
      {
        id: 5,
        name: '针对单个用户 -> 每个组群 -> 词频'
      }
    ],
    typeIndex: 0,

    secondSelectArray: [],
    objectSecondSelectArray: [],
    secondSelectIndex: 0,

    loading: true,

    responseData: [],
  },

  touchHandler: function (e) {
  },

  bindPickerChange: function (e) {
    const self = this;
    const typeIndex = Number(e.detail.value);
    switch (typeIndex) {
      case 0:
      case 1:
      case 2:
        self.drawPieChart(self.objToSeries(self.data.responseData[typeIndex]));
        break;
      case 3:
      case 4:
      case 5:
        self.setSecondSelectData(typeIndex);
        break;
      default:
        break;
    }

    this.setData({
      typeIndex,
    })
  },

  setSecondSelectData: function (type) {
    const self = this;
    const data = self.data.responseData[type];
    const secondSelectArray = [];
    const objectSecondSelectArray = [];
    let index = 0;
    for (const key in data) {
      secondSelectArray.push(key);
      objectSecondSelectArray.push({id: index, name: key});
      index++;
    }
    const key = secondSelectArray[0];
    const obj = data[key];
    self.drawPieChart(self.objToSeries(obj));
    self.setData({
      secondSelectArray,
      objectSecondSelectArray,
    });
  },

  bindSecondSelectChange: function (e) {
    const self = this;
    const secondSelectIndex = Number(e.detail.value);
    self.setData({ secondSelectIndex });
    const typeIndex = self.data.typeIndex;
    const key = self.data.secondSelectArray[secondSelectIndex];
    const obj = self.data.responseData[typeIndex][key];
    self.drawPieChart(self.objToSeries(obj));
  },

  onLoad: function () {
    const self = this;

    this.requestData(0, () => {
      self.drawPieChart(self.objToSeries(self.data.responseData[0]));
    });
    for (let i = 1; i < 6; i++) {
      this.requestData(i);
    }
  },

  requestData: function (type, cb) {
    const self = this;
    wx.request({
      url: app.globalData.dataStatisticsUrl,
      data: {
        userId: app.globalData.userId,
        type,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      dataType: 'json',
      success: function(res) {
        if (res.statusCode === 200) {
          if (res.data.code === 200) {
            const data = res.data.data;

            const thisData = { ...self.data };
            thisData.responseData[type] = data;
            self.setData(thisData);

            cb ? cb() : undefined;
          } else {

          }
        }
      }
    });
  },

  drawPieChart: function (series) {
    // 如果没有数据 显示 no data
    if (series.length === 0) {
      series = [{
        name: 'Do Data',
        data: 1,
      }];
    }
    if (!pieChart) {
      pieChart = new wxCharts({
        animation: true,
        canvasId: 'pieCanvas',
        type: 'pie',
        series,
        width: 300,
        height: 300,
        dataLabel: true,
      });
    } else {
      pieChart.updateData({
        series,
      });
    }

  },

  objToSeries: function (obj) {
    const series = [];
    for (let key in obj) {
      series.push({
        name: key,
        data: obj[key]
      });
    }
    return series;
  },

  onPullDownRefresh: function () {

  },
});

