// pages/player/player.js
let music_list = []
let nowIndex = 0
//获取全局唯一的背景音频管理器
var backAudioManager = wx.getBackgroundAudioManager()
const app = getApp()

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		picUrl: '',
		isPlay: false, //是否播放
		mucID: 0,
		isLyricShow: false,
		lyric: '',
		isSame: false, //表示是否为同一首歌曲
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
		this.setData({
			mucID: options.id,
		})
		//获取所选歌曲信息
		this.loadMusicDetail(options.id)
	},
	loadMusicDetail(id, chg) {
		if (id == app.getPlaying()) {
			this.setData({
				isSame: true,
			})
		} else {
			this.setData({
				isSame: false,
			})
		}
		if (!this.data.isSame) {
			//停止背景音乐
			backAudioManager.stop()
		}

		this.setData({
			isPlay: false,
		})
		app.setPlaying(id)
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
				//判断音频源是否为空
				if (res.result.data[0].url != null) {
					if (!this.data.isSame) {
						//背景音乐播放地址
						backAudioManager.src = res.result.data[0].url
						// console.log(res.result.data[0].url)
						//音乐名称
						backAudioManager.title = music.name
						//音乐图片
						backAudioManager.coverImgUrl = music.al.picUrl
						//歌手
						backAudioManager.singer = music.ar[0].name
						//专辑名
						backAudioManager.epname = music.al.name
						this.savePlayHistory()
					}

					this.setData({
						isPlay: true,
					})
					wx.hideLoading()
					//加载歌词
					wx.cloud
						.callFunction({
							name: 'music',
							data: {
								id,
								$url: 'lyric',
							},
						})
						.then((res) => {
							// console.log(res)
							let lyric = '佛系歌词，被砍了'
							const lrc = res.result.lrc
							if (lrc) {
								lyric = lrc.lyric
							}
							this.setData({
								lyric,
							})
						})
				} else if (chg) {
					this.goNext()
				} else {
					this.goPev()
				}
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
	//上一首
	goPev() {
		nowIndex--
		if (nowIndex < 0) {
			nowIndex = music_list.length - 1
		}
		this.loadMusicDetail(music_list[nowIndex].id)
		this.setData({
			mucID: music_list[nowIndex].id,
		})
	},
	//下一首
	goNext() {
		nowIndex++
		if (nowIndex == music_list.length) {
			nowIndex = 0
		}
		this.setData({
			mucID: music_list[nowIndex].id,
		})
		this.loadMusicDetail(music_list[nowIndex].id, true)
	},
	chg(e) {
		this.setData({
			isPlay: e.detail.isPlay,
		})
	},
	//?带参数返回上一页
	onUnload: function () {
		var pages = getCurrentPages()
		// console.log(pages)
		var prevPage = pages[pages.length - 2]
		//?上一个页面
		//?直接调用上一个页面的setData()方法，把数据存到上一个页面中去
		prevPage.setData({
			curMusic: this.data.mucID,
		})
	},
	//歌词
	lyricShow() {
		this.setData({
			isLyricShow: !this.data.isLyricShow,
		})
	},
	timeUpdate(e) {
		//?选中子组件,直接调用子组件内部方法传参
		this.selectComponent('.lyric').update(e.detail.curTime)
	},
	//系统按键控制播放暂停按钮变化联动
	musicPlay() {
		this.setData({
			isPlay: true,
		})
	},
	musicPause() {
		this.setData({
			isPlay: false,
		})
	},
	//?保存播放历史
	savePlayHistory() {
		//当前正在播放的歌曲对象
		const music = music_list[nowIndex]
		const openid = app.globalData.openid
		const history = wx.getStorageSync(openid)
		let flg = false
		for (let i = 0; i < history.length; i++) {
			if (history[i].id == music.id) {
				flg = true
				break
			}
		}
		if (!flg) {
			history.unshift(music)
			wx.setStorage({
				key: openid,
				data: history,
			})
		}
	},
})
