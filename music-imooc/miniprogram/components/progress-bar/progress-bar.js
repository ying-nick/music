// components/progress-bar/progress-bar.js
let movableAreaWidth = 0
let movableViewWidth = 0
const backAudioManager = wx.getBackgroundAudioManager()
let currentSec = -1 //当前秒数
let dur = 0 //当前音乐总时长
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		isSame: Boolean,
	},

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
			//?判断是否为同一首歌
			if (this.properties.isSame && this.data.showTime.totalTime == '00:00') {
				this.setTime()
			}
			this.getMovableDis()
			this.bindBgmEvent()
		},
	},
	/**
	 * 组件的方法列表
	 */
	methods: {
		//圆点拖动
		Tchange(e) {
			// console.log(e)
			//拖动
			if (e.detail.source == 'touch') {
				//触发拖动歌曲停止
				backAudioManager.pause()
				//给进度条赋值，不会同步到界面
				this.data.go =
					(e.detail.x / (movableAreaWidth - movableViewWidth)) * 100
				this.data.movableDis = e.detail.x
				//?子传父改变播放图标
				this.triggerEvent('chg', {
					isPlay: false,
				})
			}
		},
		//圆点拖动停止
		Tend() {
			dur = backAudioManager.duration
			//设置背景音乐播放调整
			backAudioManager.seek((dur * this.data.go) / 100)
			//设置进度条
			const curTimeFmt = this.timeFormat(
				Math.floor(backAudioManager.currentTime)
			)
			this.setData({
				go: this.data.go,
				movableDis: this.data.movableDis,
				['showTime.currentTime']: `${curTimeFmt.min}:${curTimeFmt.sec}`,
			})
			//?子传父改变播放图标
			this.triggerEvent('chg', {
				isPlay: true,
			})
			//拖动结束歌曲开始
			backAudioManager.play()
		},
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
			backAudioManager.onPlay(() => {
				this.triggerEvent('musicPlay')
			})
			//停止播放事件
			backAudioManager.onStop(() => {})
			//暂停事件
			backAudioManager.onPause(() => {
				this.triggerEvent('musicPause')
			})
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
			backAudioManager.onTimeUpdate(() => {
				//获取当前已经播放时间
				const curTime = backAudioManager.currentTime
				//获取总时长
				const duration = backAudioManager.duration
				//优化setdata刷新频率
				if (curTime.toString().split('.')[0] != currentSec) {
					const curTimeFmt = this.timeFormat(curTime)
					this.setData({
						//进度圆点进度
						movableDis:
							((movableAreaWidth - movableViewWidth) * curTime) / duration,
						//进度条颜色进度
						go: (curTime / duration) * 100,
						['showTime.currentTime']: `${curTimeFmt.min}:${curTimeFmt.sec}`,
					})
					currentSec = curTime.toString().split('.')[0]
					//?歌词时间联动同步，子组件传给另一个子组件
					this.triggerEvent('timeUpdate', {
						curTime,
					})
				}
			})
			//音乐结束时事件
			backAudioManager.onEnded(() => {
				//?触发下一首，子传父事件,绑定的是bind冒号后面的名字，而不是等号后面
				this.triggerEvent('musicEnd')
			})
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
				//单独更改对象内属性
				['showTime.totalTime']: `${durationFmt.min}:${durationFmt.sec}`,
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
