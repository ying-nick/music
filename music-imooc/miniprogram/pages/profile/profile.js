// pages/profile/profile.js

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

  },
  onTapQrCode () {
    wx.showLoading({
      title: 'building~~~',
      mask: true,
    });
    wx.cloud.callFunction({
      name: 'getQrCode',
      
    }).then(res => {
      wx.previewImage({
        current: res.result,
        urls: [res.result],
      });
      wx.hideLoading();
    })
  }
  
})