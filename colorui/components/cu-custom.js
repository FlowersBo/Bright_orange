const app = getApp();
Component({
  lifetimes: {
    attached: function () {
      wx.getSystemInfo({
        success: e => {
          app.globalData.screenWidth = e.screenWidth;
          app.globalData.screenHeight = e.screenHeight;
          app.globalData.windowWidth = e.windowWidth;
          app.globalData.windowHeight = e.windowHeight;
          app.globalData.StatusBar = e.statusBarHeight;
          let capsule = wx.getMenuButtonBoundingClientRect();
          // console.log('组件组件组件组件', capsule)
          if (capsule) {
            app.globalData.Custom = capsule;
            app.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
          } else {
            app.globalData.CustomBar = e.statusBarHeight + 50;
          }
        }
      })

      // let capsule = wx.getMenuButtonBoundingClientRect();
    },
  },
  /**
   * 组件的一些选项
   */
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },
  /**
   * 组件的对外属性
   */
  properties: {
    bgColor: {
      type: String,
      default: ''
    },
    isCustom: {
      type: [Boolean, String],
      default: false
    },
    isCustomHome: {
      type: [Boolean, String],
      default: false
    },
    isBack: {
      type: [Boolean, String],
      default: false
    },
    bgImage: {
      type: String,
      default: ''
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
  },
  /**
   * 组件的方法列表
   */
  methods: {
    BackPage() {
      wx.navigateBack({
        delta: 1
      });
    },
    toHome() {
      wx.reLaunch({
        url: '/pages/destination/index',
      })
    }
  }
})