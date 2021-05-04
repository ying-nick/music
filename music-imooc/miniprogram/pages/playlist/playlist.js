// pages/playlist/playlist.js
const db = wx.cloud.database()
const max = 15
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		swiperImgUrls: [],
		playlist: [],
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.getSwiper()
		this.getList()
	},
	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {
		this.setData({
			playlist: [],
		})
		this.getList()
		this.getSwiper()
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {
		this.getList()
	},
	getSwiper() {
		db.collection('swiper')
			.get()
			.then((res) => {
				this.setData({
					swiperImgUrls: res.data,
				})
			})
	},

	getList() {
		wx.showLoading({
			title: 'fighting...',
		})
		wx.cloud
			.callFunction({
				name: 'music',
				data: {
					start: this.data.playlist.length,
					count: max,
					$url: 'playlist',
				},
			})
			.then((res) => {
				// console.log(res)
				this.setData({
					playlist: this.data.playlist.concat(res.result.data),
				})
				wx.stopPullDownRefresh()
				wx.hideLoading()
			})
	},
})
