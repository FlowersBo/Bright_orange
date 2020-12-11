// pages/fetchBag/index.js
let that;
import * as mClient from '../../utils/requestUrl';
import * as api from '../../config/api';
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
    const query = wx.createSelectorQuery().in(this)
    query.selectAll('.custom').boundingClientRect(function (res) {
      const customHeight = res[0].height;
      that.setData({
        customHeight: customHeight
      })
    }).exec()
    wx.hideShareMenu();
    console.log('跳转拿到参数', options);
    let pagepath = options.pagepath;
    console.log(pagepath)
    if (pagepath) {
      let path = decodeURIComponent(pagepath);
      console.log('解码', path);
      let pathPartWrap = {};
      const pathPart = path.split('?')[1].split('&');
      console.log('分解', pathPart);
      for (const key in pathPart) {
        let pathPart_item = pathPart[key].split('=');
        console.log(pathPart_item);
        for (const item in pathPart_item) {
          pathPart_item[item] = pathPart_item[item].replace(/\"/g, "");
          pathPartWrap[pathPart_item[0]] = pathPart_item[1];
        }
      }
      console.log(pathPartWrap);
      wx.setStorageSync('pathPartWrap', pathPartWrap);
    }
    let open_id = wx.getStorageSync('open_id');
    if (!open_id) {
      that.wxLogin();
    } else {
      that.orderDetailFn();
    }
  },
  // 登录
  wxLogin: () => {
    mClient.login()
      .then(resp => {
        console.log('code', resp);
        if (resp) {
          let data = {
            js_code: resp
          }
          mClient.wxGetRequest(api.Login, data)
            .then(resp => {
              console.log("授权返回参数", resp);
              if (resp.data.code == "0") {
                wx.setStorageSync('open_id', resp.data.data.openid);
                wx.setStorageSync('sessionKey', resp.data.data.sessionKey);
                that.setData({
                  user_status: resp.data.data.user_status
                })
                that.orderDetailFn();
              } else {
                wx.showToast({
                  title: resp.data.message,
                  icon: 'none',
                  duration: 1000
                })
              }
            })
            .catch(rej => {
              console.log(rej)
            })
        } else {
          console.log('获取用户登录态失败！' + res);
        }
      })
      .catch(rej => {
        console.log(rej)
      })
  },

  //查询计费
  orderDetailFn: () => {
    let data = {
      // id: wx.getStorageSync('orderinfo_id')
      id: '1328889292776275968'
    };
    let real_fetch = {};
    mClient.wxGetRequest(api.OrderDetail, data)
      .then(res => {
        console.log("寄存返回", res);
        if (res.data.code == "0") {
          real_fetch.orderPrice = res.data.data.orderPrice;
          real_fetch.depositDuration = res.data.data.depositDuration;
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

  terminateFn: (ev) => {
    let index = ev.currentTarget.dataset.index;
    let text = '';
    if(index==='0'){
      text = '中途取包'
    }else{
      text = '结束寄存'
    }
    wx.showModal({
      title: '提示',
      content: '确定要'+text+'吗？',
      success(res) {
        if (res.confirm) {
          that.fetchBagFn(index);
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  fetchBagFn: (index) => {
    if (index === '0') {
      console.log(index);
    } else {
      wx.reLaunch({
        url: '../bagClaim/index',
      })
    }
    let data = {

    };
    mClient.wxGetRequest(api.OrderDetail, data)
      .then(res => {
        console.log("开门返回", res);
        if (res.data.code == "0") {

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
    that.orderDetailFn();
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