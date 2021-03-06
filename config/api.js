const ApiRootUrl = 'https://api.morninggo.cn/';
// const ApiRootUrl = 'https://w3.morninggo.cn/'; //测试
// const ApiRootUrl = 'http://192.168.126.247:8080/morninggo_app_http_war/';
module.exports = {
    shortUrlDistinguish: ApiRootUrl + 'applets/shortUrlDistinguish', //扫码传参

    Login: ApiRootUrl + 'applets/checkUserByOpenid', //登录授权code

    creatOrder: ApiRootUrl + 'applets/creatOrder', //创建订单

    checkOrder: ApiRootUrl + 'applets/checkOrder', //查询有无订单

    specificationsInfo: ApiRootUrl + 'applets/specificationsInfo', //规格

    PhoneNumber: ApiRootUrl + 'applets/obtainPhone', //授权手机号，获取扫码信息

    chargingRules: ApiRootUrl + 'applets/chargingRules', //计费规则
    paymentAuthorization: ApiRootUrl + 'applets/paymentAuthorization', //授权免密支付
    getUserPermissionsState: ApiRootUrl + 'applets/getUserPermissionsState', //查询状态
    permissionsToken: ApiRootUrl + 'applets/getApplyPermissionsToken', //拉起微信支付分
   
    Location: ApiRootUrl + 'applets/queryNearbyPoints', //位置信息

    OrderList: ApiRootUrl + 'applets/queryOrderList', //订单列表
    OrderDetail: ApiRootUrl + 'applets/queryOrderById', //订单详情

    openDoor: ApiRootUrl + 'applets/openDoor', //开门取包









    Info: ApiRootUrl + 'app/user/info', //用户信息

    VerificationCode: ApiRootUrl + 'app/user/smscode', //验证码

    RefreshAuth: ApiRootUrl + 'app/user/refresh_auth', //刷新授权

}