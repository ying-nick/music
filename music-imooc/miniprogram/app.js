//app.js
App({
	onLaunch: function () {
		this.checkUpdate()
		if (!wx.cloud) {
			console.error('请使用 2.2.3 或以上的基础库以使用云能力')
		} else {
			wx.cloud.init({
				// env 参数说明：
				//   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
				//   此处请填入环境 ID, 环境 ID 可打开云控制台查看
				//   如不填则使用默认环境（第一个创建的环境）
				env: 'cloud1-8g4btmo4df7e108b',
				traceUser: true,
			})
		}
		;(this.globalData = {
			playing: -1,
			openid: -1,
		}),
			this.getOpenId()
	},
	//?传递正在播放的音乐id，作为全局变量
	setPlaying(id) {
		this.globalData.playing = id
	},
	getPlaying() {
		return this.globalData.playing
	},
	//?音乐存储在本地
	getOpenId() {
		wx.cloud
			.callFunction({
				name: 'login',
			})
			.then((res) => {
				const openid = res.result.openid
				// console.log(openid)
				this.globalData.openid = openid
				// console.log(this.globalData.openid)
				// console.log(wx.getStorageInfoSync(openid))
				if (wx.getStorageSync(openid) == '') {
					// console.log(11111)
					wx.setStorageSync(openid, [])
				}
			})
	},
	//?版本更新
	checkUpdate() {
		const updateManager = wx.getUpdateManager()
		//检查版本更新
		updateManager.onCheckForUpdate((res) => {
			if (res.hasUpdate) {
				updateManager.onUpdateReady(() => {
					wx.showModal({
						title: '更新提示',
						content: '还在用旧版本哦，是否需要更新',
						showCancel: true,
						cancelText: '取消',
						cancelColor: '#000000',
						confirmText: '确定',
						confirmColor: '#3CC51F',
						success: (result) => {
							if (result.confirm) {
								//?应用新版本，并重启
								updateManager.applyUpdate()
							}
						},
						fail: () => {},
						complete: () => {},
					})
				})
			}
		})
	},
})
