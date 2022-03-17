//index.js
var QQMapWX = require('../../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
//获取应用实例
const app = getApp()

Page({
  data: {
    searchKey: '',
    tips: []
  },
  onLoad: function (o) {
    qqmapsdk = new QQMapWX({
      key: 'GV7BZ-RWP3W-Y52RR-RPYDN-6FWLZ-QXFQT'
    });
  },
  bindKeyInput: function(e) {
    console.log(e);
    this.setData({
      searchKey: e.detail.value
    })
  },
  clickSearch: function(e) {
    var that = this;
    var keywords = that.data.searchKey;
    if (keywords == "") {
      //wx.showModal({
      //  title: '请输入搜索内容',
      //  confirmColor: '#e75858',
      //  showCancel: false,
      //})
      return;
    }

    qqmapsdk.getSuggestion({
      keyword: keywords,
      success: function(res) {
        console.log('sucess', res);
      },
      fail: function(res) {
        console.log('fail', res);
      },
      complete: function(res) {
        console.log('complete', res);
        that.setData({
          tips: res.data
        });

      }
    })
  }
})