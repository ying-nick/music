// components/progress-bar/progress-bar.js
let movableAreaWidth = 0
let movableViewWidth = 0
const backAudioManager = wx.getBackgroundAudioManager()
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {},

	/**
	 * 组件的初始数据
	 */
	data: {
		showTime: {
			currentTime: '00:00',
			totalTime: '00:00',
		},
		movableDis: 0,
		go: 0,
	},
	//组件生命周期函数
	lifetimes: {
		ready() {
			this.getMovableDis()
			this.bindBgmEvent()
		},
	},
	/**
	 * 组件的方法列表
	 */
	methods: {
		getMovableDis() {
			//创建一个查询器实例，在page里用wx，在组件用this
			const query = this.createSelectorQuery()
			//指定节点,获取元素信息
			query.select('.area').boundingClientRect()
			query.select('.mova-view').boundingClientRect()
			//执行上面操作
			query.exec((res) => {
				movableAreaWidth = res[0].width
				movableViewWidth = res[1].width
			})
		},
		bindBgmEvent() {
			//播放事件
			backAudioManager.onPlay(() => {})
			//停止播放事件
			backAudioManager.onStop(() => {})
			//暂停事件
			backAudioManager.onPause(() => {})
			//监听进度条拖动，音频加载
			backAudioManager.onWaiting(() => {})
			//监听音乐进入可以播放状态
			backAudioManager.onCanplay(() => {
				// console.log(backAudioManager.duration)
				if (typeof backAudioManager.duration != 'undefined') {
					this.setTime()
				} else {
					setTimeout(() => {
						this.setTime()
					}, 1000)
				}
			})
			//监听音乐进度，只有小程序前台时才触发
			backAudioManager.onTimeUpdate(() => {})
			//音乐结束时事件
			backAudioManager.onEnded(() => {})
			//出现错误
			backAudioManager.onError((errMsg) => {
				console.log(errMsg)
				wx.wx.showToast({
					title: '罢工啦' + errMsg,
				})
			})
		},
		setTime() {
			//获取歌曲时间，以s为单位
			const duration = backAudioManager.duration
			// console.log(duration)
			//格式化时间
      const durationFmt = this.timeFormat(duration)
      this.setData({

      })
		},
		timeFormat(sec) {
			const min = Math.floor(sec / 60)
			sec = Math.floor(sec % 60)
			return {
				min: this.parse0(min),
				sec: this.parse0(sec),
			}
		},
		//补0
		parse0(sec) {
			return sec < 10 ? '0' + sec : sec
		},
	},
})
