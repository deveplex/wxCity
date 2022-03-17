var util = require('../../utils/util.js');
var Bmob = require('../../libs/Bmob-1.6.4.min.js');

//获取应用实例
const app = getApp()
Bmob.initialize("eef84eecdbef365b03a2749c46ad0bce", "6c954959755cbf7dca6896a3d45e2f35");
Page({
  data: {
    objectId: '123456789',
    days: [],
    signUp: [],
    cur_year: 0,
    cur_month: 0,
    weeks_ch: [],
    count: 0
  },
  onLoad: function(options) {
    //Bmob.User.login('xcxtest', '123456789').then(res => {
    //console.log(res);
    //this.setData({
    //  objectId: res.objectId
    //});
    //}).catch(err => {
    //  console.log(err)
    //});

    //获取当前年月 
    const date = new Date();
    const cur_year = date.getFullYear();
    const cur_month = date.getMonth() + 1;
    const weeks_ch = ['日', '一', '二', '三', '四', '五', '六'];
    this.calculateEmptyGrids(cur_year, cur_month);
    this.calculateDays(cur_year, cur_month);
    this.setData({
      cur_year,
      cur_month,
      weeks_ch
    });
    //获取当前用户当前任务的签到状态
    this.onGetSignUp();
  },

  // 获取当月共多少天
  getThisMonthDays: function(year, month) {
    return new Date(year, month, 0).getDate()
  },

  // 获取当月第一天星期几
  getFirstDayOfWeek: function(year, month) {
    return new Date(Date.UTC(year, month - 1, 1)).getDay();
  },

  // 计算当月1号前空了几个格子，把它填充在days数组的前面
  calculateEmptyGrids: function(year, month) {
    var that = this;
    //计算每个月时要清零
    that.setData({
      days: []
    });
    const firstDayOfWeek = this.getFirstDayOfWeek(year, month);
    if (firstDayOfWeek > 0) {
      for (let i = 0; i < firstDayOfWeek; i++) {
        var obj = {
          date: null,
          isSign: false
        }
        that.data.days.push(obj);
      }
      this.setData({
        days: that.data.days
      });
      //清空
    } else {
      this.setData({
        days: []
      });
    }
  },

  // 绘制当月天数占的格子，并把它放到days数组中
  calculateDays: function(year, month) {
    var that = this;
    const thisMonthDays = this.getThisMonthDays(year, month);
    for (let i = 1; i <= thisMonthDays; i++) {
      var obj = {
        date: i,
        isSign: false
      }
      that.data.days.push(obj);
    }
    this.setData({
      days: that.data.days
    });
  },

  //匹配判断当月与当月哪些日子签到打卡
  onJudgeSign: function() {
    var that = this;
    var signs = that.data.signUp;
    var daysArr = that.data.days;
    for (var i = 0; i < signs.length; i++) {
      var current = new Date(signs[i].date);
      var year = current.getFullYear();
      var month = current.getMonth() + 1;
      var day = current.getDate();
      day = parseInt(day);
      for (var j = 0; j < daysArr.length; j++) {
        //年月日相同并且已打卡
        if (year == that.data.cur_year && month == that.data.cur_month && daysArr[j].date == day && signs[i].isSign == true) {
          daysArr[j].isSign = true;
        }
      }
    }
    that.setData({
      days: daysArr
    });
  },

  // 切换控制年月，上一个月，下一个月
  handleCalendar: function(e) {
    const handle = e.currentTarget.dataset.handle;
    const cur_year = this.data.cur_year;
    const cur_month = this.data.cur_month;
    if (handle === 'prev') {
      let newMonth = cur_month - 1;
      let newYear = cur_year;
      if (newMonth < 1) {
        newYear = cur_year - 1;
        newMonth = 12;
      }
      this.calculateEmptyGrids(newYear, newMonth);
      this.calculateDays(newYear, newMonth);
      this.onGetSignUp();
      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      })
    } else {
      let newMonth = cur_month + 1;
      let newYear = cur_year;
      if (newMonth > 12) {
        newYear = cur_year + 1;
        newMonth = 1;
      }
      this.calculateEmptyGrids(newYear, newMonth);
      this.calculateDays(newYear, newMonth);
      this.onGetSignUp();
      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      })
    }
  },

  //获取当前用户该任务的签到数组
  onGetSignUp: function() {
    var that = this;
    //var Task_User = Bmob.Object.extend("task_user");that.data.objectId
    var q = new Bmob.Query('SignDays');
    //q.get('s5nB999O', {
    //  success: function (result) {
    //    that.setData({
    //      signUp: result.get("signUp"),
    //      count: result.get("score")
    //    });
    //    //获取后就判断签到情况
    //    that.onJudgeSign();
    //  },
    //  error: function (object, error) {
    //    console.log(error)
    //  }
    //});

    q.find().then(res => {
      console.log(res)
      var signDays = [];
      var count = 0;
      for (var i = 0; i < res.length; i++) {
        signDays.push({
          date: res[i].signUp.iso,
          isSign: true
        });
        const signDate = new Date(res[i].signUp.iso);
        if (signDate.getFullYear() == this.data.cur_year && (signDate.getMonth() + 1) == this.data.cur_month) {
          count += 1
        }
      }
      that.setData({
        signUp: signDays,
        count: count
      });
      //获取后就判断签到情况
      that.onJudgeSign();
    }).catch(err => {
      console.log(err)
    })
  }
})