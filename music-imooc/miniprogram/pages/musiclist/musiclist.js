// pages/musiclist/musiclist.js
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		musicList: [],
		listInfo: {},
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		wx.showLoading({
			title: '加油中...',
			mask: true,
		})
		// console.log(options)
		wx.cloud
			.callFunction({
				name: 'music',
				data: {
					playlistId: options.playlistId,
					$url: 'musiclist',
				},
			})
			.then((res) => {
				// console.log(res)
				const pl = res.result.playlist
				//获取歌单列表信息
				this.setData({
					musicList: pl.tracks,
					listInfo: {
						coverImgUrl: pl.coverImgUrl,
						name: pl.name,
					},
				})
				this.setMusic(pl.tracks)
				wx.hideLoading()
			})
	},
	setMusic(data) {
		wx.setStorageSync('musiclist', data)
	},
})
