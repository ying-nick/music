// pages/profile-playhistory/profile-playhistory.js
const app = getApp()

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		musiclist: [],
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		const openid = app.globalData.openid
		const playlist = wx.getStorageSync(openid)
		if (playlist.length == 0) {
			//?判断跳转
			wx.showModal({
				title: '还未听歌？赶紧去试试',
				content: '',
				showCancel: true,
				cancelText: '取消',
				cancelColor: '#000000',
				confirmText: '确定',
				confirmColor: '#3CC51F',
				success: (result) => {
					if (result.confirm) {
						//?tab页面跳转
						wx.switchTab({
							url: '/pages/playlist/playlist',
						})
					} else {
						wx.navigateBack()
					}
				},
			})
		} else {
			//?storage里面存储的musiclist替换成播放历史的musiclist
			wx.setStorageSync('musiclist', playlist)
			this.setData({
				musiclist: playlist,
			})
		}
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {},
})
