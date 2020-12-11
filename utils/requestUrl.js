const app = getApp();
// const siteRoots = app.data.siteroot;
let ajaxTimes = 0;
const wxRequest = (url, data = {}, method = 'POST') => {
  ajaxTimes++;
  wx.showLoading({
    // mask: true,
    title: '加载中',
  })
  console.log(data);
  let open_id = wx.getStorageSync('open_id');
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      method: method,
      data: data,
      header: {
        'charset': 'utf-8',
        'content-type': 'application/json', // 默认值
        'app-access-token': open_id,
      },
      success: function (resp) {
        console.log(resp);
        if (resp.statusCode === 200) {
          resolve(resp);
        } else {
          reject(resp.errMsg);
        }
        if (!resp.data.message) {
          wx.showToast({
            title: '服务器错误，请稍后重试',
            icon: 'none',
            duration: 1000
          });
        }
      },
      fail: function (err) {
        reject(err)
        console.log("failed");
        wx.showToast({
          title: '请求超时',
          icon: 'none',
          duration: 2000
        });
      },
      complete: (res) => {
        ajaxTimes--;
        if (ajaxTimes === 0) {
          wx.hideLoading()
        }
      }
    })
  })
}
const wxGetRequest = (url, data = {}, method = 'GET') => {
  let param = objectToJsonParams(data);
  console.log(url + param);
  let open_id = wx.getStorageSync('open_id');
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url + param,
      method: method,
      header: {
        'charset': 'utf-8',
        'Content-Type': 'application/json',
        'app-access-token': open_id
      },
      success: function (resp) {
        console.log(resp);
        if (resp.statusCode === 200) {
          resolve(resp);
        } else {
          reject(resp.errMsg);
        }
        if (!resp.data.message) {
          wx.showToast({
            title: '服务器错误，请稍后重试',
            icon: 'none',
            duration: 1000
          });
        }
      },
      fail: function (err) {
        reject(err)
        console.log("failed");
        wx.showToast({
          title: '请求超时',
          icon: 'none',
          duration: 2000
        });
      },
      complete: (res) => {
        ajaxTimes--;
        if (ajaxTimes === 0) {
          wx.hideLoading()
        }
      }
    })
  });
}

//wx login
function login() {
  return new Promise(function (resolve, reject) {
    wx.login({
      success: function (res) {
        if (res.code) {
          resolve(res.code);
        } else {
          reject(res);
        }
      },
      fail: function (err) {
        reject(err);
      }
    });
  });
}

function objectToJsonParams(data = {}) {
  var arr = Object.keys(data);
  console.log(arr)
  // if (arr === 0) {
  if (arr.length === 0) {
    return '';
  } else {
    let params = '?' + JSON.stringify(data).replace(/{/g, '').replace(/}/g, '').replace(/:/g, '=').replace(/\"/g, '').replace(/\,/g, '&');
    return params;
  }
}
module.exports = {
  wxRequest,
  wxGetRequest,
  login
}