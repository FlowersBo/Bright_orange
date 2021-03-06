// pages/wxlogin/index.js
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
    wx.hideShareMenu();
    wx.removeStorageSync('qrcode');
    console.log('跳转拿到参数', options);
    let qrcode = options.qrcode;
    if (qrcode) {
      wx.setStorageSync('qrcode', qrcode);
    }
    let timestamp = options.timestamp;
    console.log('时间戳', timestamp);
    console.log('缓存时间戳列表', wx.getStorageSync('timestampList'));
    if (timestamp) {
      let timestampList = wx.getStorageSync('timestampList');
      let index = timestampList.indexOf(timestamp);
      console.log('缓存中是否有', index);
      if (index === -1) {
        timestampList.push(timestamp);
        wx.setStorageSync('timestampList', timestampList);
      } else {
        wx.redirectTo({
          url: '/pages/destination/index'
        })
      }
    }
    that.orderInquire();
    // let open_id = wx.getStorageSync('open_id');
    // if (!open_id) {
    that.wxLogin();
    // }
    console.log('跳转拿到参数', options);
    let pathPartWrap = options;
    console.log('缓存', wx.getStorageSync('pathPartWrap'));
    console.log(Object.values(pathPartWrap).length > 0);
    if (Object.values(pathPartWrap).length > 0) {
      console.log(pathPartWrap);
      wx.setStorageSync('pathPartWrap', pathPartWrap);
    }
  },

  orderInquire: () => {
    let {
      customerId,
      factoryNO
    } = wx.getStorageSync('pathPartWrap');
    let data = {
      customerId,
      factoryNO
    };
    mClient.wxGetRequest(api.checkOrder, data)
      .then(res => {
        console.log("是否有订单", res);
        if (res.data.code == "0") {
          let qrcode = wx.getStorageSync('qrcode');
          let customerId = res.data.data.customerId,
            factoryNO = res.data.data.factoryNO,
            orderinfo_id = res.data.data.orderinfo_id;
          if (qrcode) {
            wx.redirectTo({
              url: '/pages/fetchBag/index?customerId=' + customerId + '&factoryNO=' + factoryNO + '&orderinfo_id=' + orderinfo_id
            })
          } else {
            console.log('外部')
            wx.redirectTo({
              url: '/pages/orderList/orderDetail/index?id=' + orderinfo_id,
            })
          }
        }
      })
      .catch(rej => {
        console.log('错误')
        wx.showToast({
          title: rej.error,
          icon: 'none',
          duration: 2000
        })
      })
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
              } else {
                wx.showToast({
                  title: '授权失败',
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // let pages = getCurrentPages();
    // var currPage = pages[pages.length - 2];
    // console.log("上级页面", currPage)
    // var route = currPage.route;
    // console.log("上级页面路由", route);
    // that.setData({
    //   route: route
    // });
  },

  // 授权
  getPhoneNumber: (e) => {
    let {
      customerId,
      factoryNO,
      specifications,
      gzh_openid
    } = wx.getStorageSync('pathPartWrap');
    var iv = e.detail.iv;
    var encryptedData = e.detail.encryptedData;
    // encryptedData = encodeURIComponent(encryptedData);
    wx.getSetting({
      success(res) {
        console.log("已授权", res);
        // if (res.authSetting['scope.userInfo']) {
        // 已经授权，可以直接调用
        if (e.detail.encryptedData) {
          try {
            if (wx.getStorageSync('open_id')) {
              console.log("iv", iv, '\n', "encryptedData", encryptedData)
              // 获取登录用户信息
              const data = {
                encryptedData: encryptedData,
                iv: iv,
                sessionKey: wx.getStorageSync('sessionKey'),
                openid: wx.getStorageSync('open_id'),
                FactoryNO: factoryNO,
                customer_id: customerId,
                specifications,
                gzh_openid
              }

              mClient.wxRequest(api.PhoneNumber, data)
                .then(res => {
                  console.log("授权返回参数", res);
                  if (res.data.code == "0") {
                    let orderinfo_id = res.data.data.orderinfo_id;
                    let pathPartWrap = wx.getStorageSync('pathPartWrap');
                    pathPartWrap.orderinfo_id = orderinfo_id;
                    wx.setStorageSync('pathPartWrap', pathPartWrap);
                    // 跳转开门
                    wx.redirectTo({
                      url: '/pages/wxPay/index',
                    })
                  } else {
                    wx.showToast({
                      title: res.data.message,
                      icon: 'none',
                      duration: 2000
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
            } else {
              console.log('获取用户手机号失败！');
            }
          } catch (e) {
            console.log(e);
          }
        } else {
          //用户按了取消按钮
          wx.showModal({
            title: '提示',
            content: '您点击了拒绝授权，将无法使用小程序，请授权之后再进入',
            showCancel: false,
            confirmText: '返回授权'
          })
        }
      }
    })
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
    console.log("下拉刷新")
    // 显示顶部刷新图标  
    wx.showNavigationBarLoading();
    // 停止下拉动作  
    wx.stopPullDownRefresh();
    if (that.data) {
      // 隐藏导航栏加载框  
      wx.hideNavigationBarLoading();
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  //授权
  // onGotUserInfo: function (e) {
  //   var that = this;
  //   console.log(e)
  //   var result = e.detail.userInfo;
  //   var encryptedData = e.detail.encryptedData;
  //   var iv = e.detail.iv;
  //   console.log("result", result);
  //   if (e.detail.userInfo) {
  //     try {
  //       wx.login({
  //         success: function (res) {
  //           console.log(res);
  //           if (res.code) {
  //             var code = res.code;
  //             // 获取登录用户信息
  //             var dataUrl = '/auth/login';
  //             var param = {
  //               code: code,
  //               encryptedData: encryptedData
  //             }
  //             // wxRequest(dataUrl, param).then(res => {
  //                 console.log("登录返回参数", res);
  //                 if (code) {
  //                   // var userInfo = res.data;
  //                   // console.log("userInfo", userInfo);
  //                   // app.data.userinfo = userInfo;
  //                   // wx.setStorageSync('userInfo', userInfo);
  //                   // that.setData({ userInfo: userInfo});
  //                   //用户已经授权过
  //                   wx.navigateBack({
  //                     delta: 1
  //                   })
  //                 } else {
  //                   wx.switchTab({
  //                     url: '/index/index'
  //                   })
  //                 }
  //             // })
  //           } else {
  //             console.log('获取用户登录态失败！' + res.errMsg);
  //           }
  //         }
  //       });
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   } else {
  //     //用户按了取消按钮
  //     wx.showModal({
  //       title: '提示',
  //       content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入',
  //       showCancel: false,
  //       confirmText: '返回授权',
  //       success: function (res) {
  //         if (res.confirm) {
  //           console.log('用户点击了“返回授权”');
  //         }
  //       }
  //     })
  //   }
  // },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})