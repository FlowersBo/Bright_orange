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
    isShow: true,
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
    let {
      orderinfo_id
    } = wx.getStorageSync('pathPartWrap')
    if (num === 0) {
      wx.reLaunch({
        url: '/pages/destination/index',
      })
    } else if (wx.getStorageSync('operate') && num != 0) { //重新开门
      let data = {
        operate: wx.getStorageSync('operate'),
        orderId: orderinfo_id
      };
      mClient.wxRequest(api.openDoor, data)
        .then(res => {
          console.log("开门返回", res);
          const mark = res.data.data;
          // if (res.data.code == "0") {
          let orderinfo_code = res.data.code;
          that.doorFn(orderinfo_code, mark);
          // } else {
          //   wx.showToast({
          //     title: res.data.message,
          //     icon: 'none',
          //     duration: 2000
          //   })
          //   wx.hideLoading();
          // }
        })
        .catch(rej => {
          console.log(rej)
          wx.showToast({
            title: rej.error,
            icon: 'none',
            duration: 2000
          })
        })
    } else {
      wx.reLaunch({
        url: '/pages/destination/index',
      })
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
    const innerAudioContext = wx.createInnerAudioContext();
    innerAudioContext.autoplay = true; //音频自动播放
    if (orderinfo_code == '0') {
      innerAudioContext.src = '/resource/audio/audio.mp3';
      innerAudioContext.onPlay(() => {
        console.log('播放')
      });
      innerAudioContext.onError((res) => { //打印错误
        console.log(res.errMsg);
        console.log(res.errCode); //错误码
      })
      that.setData({
        isFlag: true,
        isShow: true,
        mark: mark
      })
    } else {
      innerAudioContext.src = '/resource/audio/audio1.mp3';
      if (wx.getStorageSync('operate')) {
        that.setData({
          isShow: false
        })
      }
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