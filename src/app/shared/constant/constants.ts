export const Constants = {

    //Authentication
    login:'auth/login',
    getuser:'auth/me',
    logoout:'auth/logout',
    verify2fa:'user/verify2FA',
    forgotpassword:'auth/forgotpassword',
    resetpassword:'auth/resetpassword/',

    //Exchanges
    // addexchange:'exchange/createexchange',
    exchange:'exchange',
    makedefault:'exchange/makedefault',

    //Security
    qrgenerator:'user/qr2fa',
    status2fa:'user/enable2fa',
    statuspinlock:'user/pinlockEnable',
    lockscreen:'user/lockscreen',
    unlockscreen:'user/disablelockscreen',
    activitylog:'user/loginActivity',
    changepassword:'auth/updatepassword',

    //Spot
    spotaccountbalance:'accountData/accountbalance',
    spotexchanginfo:'spotMarket/spotexchangeinfo',
    spotcurrentprice:'spotMarket/spotcurrentprice',
    spotcreateorder:'spotGrid/create',
    spotcancelorder:'spotTrade/spotcancelorder',
    kucoinorderbookurl:'spotMarket/kucoinspotwspublic',
    spotactivegrid:'spotGrid/active',
    spotgridhistory:'spotGrid/history',
    spotgriddetail:'spotGrid/details/',
    spotgridstop:'spotGrid/stop/',
    spotmarketimport:'spotMarket/spotexchangeinfoendpoint',
    editspotcoinpair:'spotMarket/editspotexchange',
    editsopotactivegrid:'spotGrid/update',

    //FX
    fxaccountbalance:'fxAccount/accountbalance',
    fxcurrentprice:'fxMarket/fxmarkprice',
    fxexchangeinfo:'fxMarket/fxexchangeinfo',
    kucoinfxorderbookurl:'fxMarket/kucoinfxwspublic',
    fxactivegrid:'fxGrid/active',
    fxgridhistory:'fxGrid/history',
    fxgriddetail:'fxGrid/details/',
    fxgridstop:'fxGrid/stop/',
    fxcreateorder:'fxGrid/create',
    fxmarketimport:'fxMarket/fxexchangeinfoendpoint',
    editfxcoinpair:'fxMarket/editfxexchange',
    editfxgrid:'fxGrid/update',

    //Notifications
    readnotification:'user/readnotification',
    allnotification:'user/notificationlist',
    clearnotification:'user/deletenotification',

    //Dashboard
    dashboarddetail:'user/dashboard'
}