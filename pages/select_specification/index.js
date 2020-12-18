// pages/select_specification/index.js
let that;
import * as mClient from '../../utils/requestUrl';
import * as api from '../../config/api';
import * as util from '../../utils/util';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    'specification': [{
        'imgs': '../../resource/img/littlebag-s.png',
        'img': '../../resource/img/littlebag.png',
        'name': '小柜',
        'apply': '双肩包、挎包、手提袋等',
        'specifications': '1'
      },
      {
        'imgs': '../../resource/img/middlebag-s.png',
        'img': '../../resource/img/middlebag.png',
        'name': '中柜',
        'apply': '双肩包、挎包、购物袋等',
        'specifications': '2'
      },
      {
        'imgs': '../../resource/img/bigbag-s.png',
        'img': '../../resource/img/bigbag.png',
        'name': '大柜',
        'apply': '30寸以下行李箱、双肩包等',
        'specifications': '3'
      }
    ],
    user_status: '0'
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
    // let result = options.q;
    // if (result) {
    //   let path = decodeURIComponent(result);
    //   console.log('解码', path);
    //   const pathPart = path.split('vd/')[1].split('|');
    //   console.log(pathPart);
    //   wx.setStorageSync('pathPart', pathPart);
    // }
    // let pagepath = 'pages/wxlogin/index?customerId=1338687455984877568&factoryNo=cw100086003&gzh_openid=oTczw5kyRvndorvri7jcG0o2v2fg';
    // options = {
    //   customerId: '1338687455984877568',
    //   factoryNO: 'cw100086003',
    //   gzh_openid: 'oTczw5kSxCwWz4FW4FaT2OKIpz4M'
    // }
    console.log('跳转拿到参数', options);
    let pathPartWrap = options;
    console.log(Object.values(pathPartWrap).length > 0);
    if (Object.values(pathPartWrap).length > 0) {
      // let pathPartWrap = decodeURIComponent(pagepath);
      // const pathPart = path.split('?')[1].split('&');
      // console.log('分解', pathPart);
      // for (const key in pathPart) {
      //   let pathPart_item = pathPart[key].split('=');
      //   console.log(pathPart_item);
      //   for (const item in pathPart_item) {
      //     pathPart_item[item] = pathPart_item[item].replace(/\"/g, "");
      //     pathPartWrap[pathPart_item[0]] = pathPart_item[1];
      //   }
      // }
      wx.setStorageSync('pathPartWrap', pathPartWrap);
      // pathPart_item.parseJSON();
      // let gzh_openid = pathPart[1];
      // let factoryNO = pathPart1[1];
      // console.log(gzh_openid, factoryNO);
      // wx.setStorageSync('factoryNo', factoryNO);
    }
    // let open_id = wx.getStorageSync('open_id');
    that.orderInquire();
    // if (!open_id) {
    that.wxLogin();
    // } else {
    //   that.usableFn();
    // }
  },

  orderInquire: () => {
    let {
      customerId
    } = wx.getStorageSync('pathPartWrap');
    let data = {
      customerId
    };
    mClient.wxGetRequest(api.checkOrder, data)
      .then(res => {
        console.log("是否有订单", res);
        if (res.data.code == "0") {
          let customerId = res.data.data.customerId,
            factoryNO = res.data.data.factoryNO,
            orderinfo_id = res.data.data.orderinfo_id;
          wx.redirectTo({
            url: '/pages/fetchBag/index?customerId=' + customerId + '&factoryNO=' + factoryNO + '&orderinfo_id=' + orderinfo_id
          })
        } else {

        }
      })
      .catch(rej => {

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
                that.setData({
                  user_status: resp.data.data.user_status
                })
                that.usableFn();
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

  //查询可用
  usableFn: () => {
    let {
      factoryNO
    } = wx.getStorageSync('pathPartWrap');
    let data = {
      factoryNo: factoryNO
    };
    mClient.wxGetRequest(api.specificationsInfo, data)
      .then(res => {
        console.log("可用返回", res);
        if (res.data.code == "0") {
          let usableList = res.data.data;
          let specification = that.data.specification;
          specification.forEach(item => {
            usableList.forEach(uItem => {
              if (item.specifications === uItem.specifications) {
                Object.assign(item, uItem)
              }
            })
          })
          // specification = specification.map((item, index) => {
          //   return {
          //     ...item,
          //     ...usableList[index]
          //   };
          // });
          console.log('合并', specification);
          that.setData({
            specification: specification
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

  selectFn: (e) => {
    let specifications = e.currentTarget.dataset.specifications,
      unUsed = e.currentTarget.dataset.unused;
    let pathPartWrap = wx.getStorageSync('pathPartWrap');
    pathPartWrap.specifications = specifications;
    if (unUsed) {
      wx.setStorageSync('pathPartWrap', pathPartWrap);
      // if (that.data.user_status === '0') {
      wx.navigateTo({
        url: '../wxlogin/index',
      })
      // } else {
      //   wx.navigateTo({
      //     url: '../wxPay/index',
      //   })
      // }
    } else {
      wx.showToast({
        title: '该规格暂无可用',
        icon: 'none',
        duration: 2000
      })
    }
  },

  refresh() {
    that.setData({
      'pull.isLoading': true,
      'pull.loading': '../../resource/img/pull_refresh.gif',
      'pull.pullText': '正在刷新',
      'push.pullText': '',
    })
    that.usableFn();
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
    // that.usableFn();
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