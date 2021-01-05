// pages/cx/index.js
import * as mClient from '../../utils/requestUrl';
import * as api from '../../config/api';
let that;
var app = getApp()
Page({
  data: {
    isshow: true,
    showCompass: true,
    mapList: [],
    // polyline: [{
    //   points: [{
    //     longitude: 113.3245211,
    //     latitude: 23.10229
    //   }, {
    //     longitude: 113.324520,
    //     latitude: 23.21229
    //   }],
    //   color: '#FF0000DD',
    //   width: 2,
    //   dottedLine: true
    // }],
    // controls: [{
    //   id: 1,
    //   iconPath: '../../resource/img/map.png',
    //   position: {
    //     left: 0,
    //     top: 300 - 1,
    //     width: 50,
    //     height: 50
    //   },
    //   clickable: true
    // }]
  },


  onLoad: function (option) {
    that = this;
    // const eventChannel = this.getOpenerEventChannel();
    // eventChannel.on('acceptData', function (data) {
    //   console.log(data);
    //   let mapid = data;
    // })
    wx.getLocation({
      type: "gcj02",
      success: function (res) {
        console.log(res)
        var latitude = res.latitude;
        var longitude = res.longitude;
        //console.log(res.latitude);
        that.setData({
          latitude: latitude,
          longitude: longitude,
        })
      }
    })
    that.orderListFn();
  },

  // 列表
  orderListFn: () => {
    let {
      latitude,
      longitude
    } = wx.getStorageSync('loaction');
    const data = {
      size: "20",
      current: '1',
      latitude: latitude,
      longitude: longitude
    }
    mClient.wxRequest(api.Location, data)
      .then(res => {
        console.log("返回列表", res);
        if (res.data.code == "0") {
          let mapList = res.data.data.pointList;
          for (const key in mapList) {
            if (mapList.hasOwnProperty(key)) {
              const element = mapList[key];
              element.distance = element.distance.split(".")[0];
              element.iconPath = "../../resource/img/map.png";
              element.width = 30;
              element.height = 30;
              element.callout = {
                content: element.pointname,
                display: 'ALWAYS',
                padding: '4px 10px',
                borderRadius: '20px',
                color: '#fff',
                bgColor: '#1296DB'
              }
            }
          }
          mapList = that.data.mapList.concat(mapList);
          console.log('附近点位列表', mapList);
          that.setData({
            mapList: mapList
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 1000
          })
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

  //显示弹框
  showModal: function (event) {
    console.log(event);
    let markerId = event.markerId;
    for (const key in that.data.mapList) {
      if (that.data.mapList.hasOwnProperty(key)) {
        const element = that.data.mapList[key];
        if(markerId===element.id){
          console.log(element)
          that.setData({
            mapList_item: element
          })
        }
      }
    }

    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  //隐藏对话框
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },

  //跳转导航
  navigationFn: () => {
    let mapList_item = that.data.mapList_item;
    wx.openLocation({
      latitude: mapList_item.latitude,
      longitude: mapList_item.longitude,
      name: mapList_item.pointname,
      scale: 15, //缩放比例
      address: mapList_item.address
    })
  },

  // 跳转点位列表
  nearbyFn: () => {
    wx.navigateTo({
      url: '/pages/nearbyMap/index',
    })
  },

  // 跳转首页
  gotohome:()=>{
    wx.reLaunch({
      url: '../destination/index',
    })
  },
  // opendetail: function (event) {
  //   console.log('-----跳转商品-----');
  //   //console.log(event);
  //   var id = event.currentTarget.dataset.id;
  //   this.setData({
  //     id: id
  //   });
  //   wx.navigateTo({
  //       url: "/pages/detail/detail?id=" + id
  //     }),
  //     console.log(id);
  // },

  // calling: function (event) {
  //   var tel = event.currentTarget.dataset.id.tel;
  //   this.setData({
  //     tel: tel
  //   });
  //   wx.makePhoneCall({
  //     phoneNumber: tel,
  //     success: function () {
  //       console.log("拨打电话成功！")
  //     },
  //     fail: function () {
  //       console.log("拨打电话失败！")
  //     }
  //   })
  // },

  regionchange: (e) => {}
})