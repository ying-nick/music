// pages/player/player.js
let music_list = []
let nowIndex = 0
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		picUrl: '',
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		// wx.showLoading({
		// 	title: '歌曲即将播放',
		// 	mask: true,
		// })
		// console.log(options)
		nowIndex = options.index
		//获取内存中的歌曲列表
		music_list = wx.getStorageSync('musiclist')
		//获取所选歌曲信息
		this.loadMusicDetail()
	},
	loadMusicDetail() {
		let music = music_list[nowIndex]
		// console.log(music)
		wx.setNavigationBarTitle({
			title: music.name,
		})
		this.setData({
			picUrl: music.al.picUrl,
		})
	},
})
