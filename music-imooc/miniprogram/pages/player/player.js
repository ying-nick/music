// pages/player/player.js
let music_list = []
let nowIndex = 0
//获取全局唯一的北京音频管理器
var backAudioManager = wx.getBackgroundAudioManager()
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		picUrl: '',
		isPlay: false, //是否播放
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		wx.showLoading({
			title: '歌曲即将播放',
			mask: true,
		})
		// console.log(options)
		nowIndex = options.index
		//获取内存中的歌曲列表
		music_list = wx.getStorageSync('musiclist')
		//获取所选歌曲信息
		this.loadMusicDetail(options.id)
	},
	loadMusicDetail(id) {
		//停止背景音乐
		backAudioManager.stop()
		this.setData({
			isPlay: false,
		})
		let music = music_list[nowIndex]
		// console.log(music)
		wx.setNavigationBarTitle({
			title: music.name,
		})
		this.setData({
			picUrl: music.al.picUrl,
		})
		wx.cloud
			.callFunction({
				name: 'music',
				data: {
					id,
					$url: 'musicUrl',
				},
			})
			.then((res) => {
				// console.log(res)
				//背景音乐播放地址
				backAudioManager.src = res.result.data[0].url
				//音乐名称
				backAudioManager.title = music.name
				//音乐图片
				backAudioManager.coverImgUrl = music.al.picUrl
				//歌手
				backAudioManager.singer = music.ar[0].name
				//专辑名
				backAudioManager.epname = music.al.name
				this.setData({
					isPlay: true,
				})
				wx.hideLoading()
			})
	},
	togglePlay() {
		if (this.data.isPlay) {
			//暂停背景音乐
			backAudioManager.pause()
		} else {
			//背景音乐重启
			backAudioManager.play()
		}
		this.setData({
			isPlay: !this.data.isPlay,
		})
	},
	goPev() {
		nowIndex--
		if (nowIndex < 0) {
			nowIndex = music_list.length - 1
		}
		this.loadMusicDetail(music_list[nowIndex].id)
	},
	goNext() {
		nowIndex++
		if (nowIndex == music_list.length) {
			nowIndex = 0
		}
		this.loadMusicDetail(music_list[nowIndex].id)
	},
})
