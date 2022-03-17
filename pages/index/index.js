//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    topImageCarousel: {
      imgUrls: [
        '/images/Carousel/CII56BJ919BR0001.jpg',
        '/images/Carousel/CJ45OVQ119BR0001.jpg',
        '/images/Carousel/CJ45SKQO19BR0001.jpg'
      ],
      indicatorDots: false,
      autoplay: true,
      interval: 5000,
      duration: 1000
    },
    grids: [{
        title: '日历',
        image: '../../images/icon_tabbar.png',
        url: '../calendar/index'
      },
      {
        title: '打卡',
        image: '../../images/icon_tabbar.png',
        url: '/pages/jkdk/index'
      },
      {
        title: '',
        image: '../../images/icon_tabbar.png',
        url: 'pages/calendar/index'
      },
      {
        title: '',
        image: '../../images/icon_tabbar.png',
        url: 'pages/calendar/index'
      },
      {
        title: '',
        image: '../../images/icon_tabbar.png',
        url: 'pages/calendar/index'
      },
      {
        title: '',
        image: '../../images/icon_tabbar.png',
        url: 'pages/calendar/index'
      },
      {
        title: '',
        image: '../../images/icon_tabbar.png',
        url: 'pages/calendar/index'
      },
      {
        title: '',
        image: '../../images/icon_tabbar.png',
        url: 'pages/calendar/index'
      },
      {
        title: '',
        image: '../../images/icon_tabbar.png',
        url: 'pages/calendar/index'
      },
    ],
  },
  onLoad: function() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  //事件处理函数
  gotoPage: function (e) {
    var url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url
    })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})