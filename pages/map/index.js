//index.js
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
//获取应用实例
const app = getApp()

Page({
  data: {
    urlSet: {
      mapSearchUrl: 'search/index'
    },
    searchKey: '',
    mapLatitude: '40.099994',
    mapLongitude: '113.324520',
    currentLat: '23.099994',
    currentLon: '113.324520',
    southwest: {},
    northeast: {},
    circles: [{
      color: '#0000dd33',
      fillColor: '#0000dd33',
      radius: 1000,
      strokeWidth: 0
    }],
    markers: []
  },
  onLoad: function(options) {
    var that = this;
    qqmapsdk = new QQMapWX({
      key: 'GV7BZ-RWP3W-Y52RR-RPYDN-6FWLZ-QXFQT'
    });

    wx.getLocation({
      success: function(res) {
        var latitude = res.latitude
        var longitude = res.longitude
        console.log('location', res)
        that.setData({
          mapLatitude: latitude,
          mapLongitude: longitude,
          currentLat: latitude,
          currentLon: longitude,
          circles: [{
            latitude: latitude,
            longitude: longitude,
            color: '#0000dd33',
            fillColor: '#0000dd33',
            radius: 1000,
            strokeWidth: 0
          }]
        })
      },
    })
  },
  onReady: function (e) {
    this.mapCtx = wx.createMapContext('map')
  },
  regionchange: function(e) {
    var that = this;
    if (e.type == 'end') {
      that.mapCtx.getCenterLocation({
        success: function(res) {
          var latitude = res.latitude
          var longitude = res.longitude
          that.setData({
            currentLat: latitude,
            currentLon: longitude,
            circles: [{
              latitude: latitude,
              longitude: longitude,
              color: '#0000dd33',
              fillColor: '#0000dd33',
              radius: 1300,
              strokeWidth: 0
            }]
          })
        }
      });

      that.mapCtx.getRegion({
        success: function(res) {
          console.log('qqmap_success', res);
          that.setData({
            southwest: res.southwest,
            northeast: res.northeast
          })
        }
      });
    }
  },
  bindKeyInput: function(e) {
    console.log(e);
    this.setData({
      searchKey: e.detail.value
    })
  },
  goMapSearch: function(e) {
    var url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url
    })
  },
  clickSearch: function() {
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

    var rectangle = '' + that.data.southwest.latitude + ',' + that.data.southwest.longitude + ',' + that.data.northeast.latitude + ',' + that.data.northeast.longitude + '';

    // 调用搜索接口
    qqmapsdk.search({
      keyword: keywords,
      location: {
        latitude: that.data.currentLat,
        longitude: that.data.currentLon
      },
      rectangle: rectangle,
      auto_extend: 0,
      success: function(res) {
        console.log('qqmap_success', res);
        var markers = [];
        for (var i = 0; i < res.data.length; i++) {
          markers.push({
            id: res.data[i].id,
            latitude: res.data[i].location.lat,
            longitude: res.data[i].location.lng,
            iconPath: 'http://img.tianxiahuo.cn/public/NetFile/20170713/901268273f91f5774ea87e6ae336c251.png',
            callout: {
              content: res.data[i].title + '\n' + res.data[i].address,
              bgColor: "#ffffff",
              padding: "10px"
            }
          });
        }
        that.setData({
          markers: markers
        })
      },
      fail: function(res) {
        console.log('qqmap_fail', res);
      },
      complete: function(res) {
        //console.log('qqmap_complete', res);
      }
    });
  }
})