// pages/orderList/orderDetail/index.js
let that;
import * as mClient from '../../../utils/requestUrl';
import * as api from '../../../config/api';
import * as util from '../../../utils/util';
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    let id = options.id;
    // id = '1328889292776275968';
    console.log(id);
    if(id){
      that.setData({
        id: id
      })
    }
    if (id) {
      that.orderDetailFn(id);
    }
    const query = wx.createSelectorQuery().in(this)
    query.selectAll('.custom').boundingClientRect(function (res) {
      const customHeight = res[0].height;
      that.setData({
        customHeight: customHeight
      })
    }).exec()
    wx.hideShareMenu();
  },

  //查询计费
  orderDetailFn: (id) => {
    let data = {
      id: id
    };
    mClient.wxGetRequest(api.OrderDetail, data)
      .then(res => {
        console.log("详情返回", res);
        if (res.data.code == "0") {
          let real_fetch = res.data.data;
          if (real_fetch.orderStatus === '1') {
            real_fetch.orderStatus = '使用中'
          } else if (real_fetch.orderStatus === '2') {
            real_fetch.orderStatus = '已完成'
          } else {
            real_fetch.orderStatus = '已取消'
          }
          if (real_fetch) {
            real_fetch.startDate = util.timestampToTimeLong(real_fetch.startDate);
            if (real_fetch.finishDate) {
              real_fetch.finishDate = util.timestampToTimeLong(real_fetch.finishDate);
            }
          }
          that.setData({
            real_fetch: real_fetch
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 1000
          })
          wx.hideLoading();
        }
      })
      .catch(rej => {
        console.log(rej)
        wx.showToast({
          title: rej.error,
          icon: 'none',
          duration: 2000
        })
      })
  },

  refresh() {
    that.setData({
      'pull.isLoading': true,
      'pull.loading': '../../resource/img/pull_refresh.gif',
      'pull.pullText': '正在刷新',
      'push.pullText': '',
    })
    that.orderDetailFn(that.data.id);
    if (that.data) {
      setTimeout(() => {
        that.setData({
          'pull.loading': '../../resource/img/finish.png',
          'pull.pullText': '刷新完成',
          'pull.isLoading': false
        })
      }, 1500)
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