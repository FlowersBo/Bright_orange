// pages/bagClaim/index.js
import * as mClient from '../../utils/requestUrl';
import * as api from '../../config/api';
let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isFlag: false,
    btnStatus: [{
        'num': 0,
        'text': '柜门打开成功，请随手关门'
      },
      {
        'num': 1,
        'text': '柜门打开失败，请联系客服'
      }
    ]
  },
  toHome(e) {

    console.log(e);
    let num = e.currentTarget.dataset.num;
    if (num === 0) {
      wx.reLaunch({
        url: '/pages/destination/index',
      })
    } else { //重新开门

    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    const orderinfo_code = options.orderinfo_code;
    const mark = options.mark;
    if (orderinfo_code) {
      that.doorFn(orderinfo_code, mark);
    }
  },
  doorFn: (orderinfo_code, mark) => {
    if (orderinfo_code == '0') {
      const innerAudioContext = wx.createInnerAudioContext();
      innerAudioContext.autoplay = true; //音频自动播放设置
      innerAudioContext.src = '/resource/audio/audio.mp3'; //链接到音频的地址
      innerAudioContext.onPlay(() => {
        console.log('播放')
      }); //播放音效
      innerAudioContext.onError((res) => { //打印错误
        console.log(res.errMsg); //错误信息
        console.log(res.errCode); //错误码
      })
      that.setData({
        isFlag: true,
        mark: mark
      })
    } else {
      that.setData({
        isFlag: false
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})