// components/lyric/lyric.js
let lyricHeight = 0
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		isLyricShow: {
			type: Boolean,
			value: false,
		},
		lyric: String,
	},
	//属性监听器
	observers: {
		//监听歌词
		lyric(lrc) {
			// console.log(lrc)
			if (lrc == '佛系歌词，被砍了') {
				this.setData({
					lrcList: [
						{
							lrc,
							time: 0,
						},
					],
					nowLrc: -1,
				})
			} else {
				//转化歌词
				this.parseLrc(lrc)
			}
		},
	},
	/**
	 * 组件的初始数据
	 */
	data: {
		lrcList: [],
		nowLrc: 0, //当前歌词索引
		scrollTop: 0, //滚动条滚动高度
	},
	lifetimes: {
		ready() {
			//获取当前手机信息
			wx.getSystemInfo({
				success(res) {
					// console.log(res)
					//求出给个rpx大小，并算出当前高度px
					lyricHeight = (res.screenWidth / 750) * 64
					// console.log(lyricHeight)
				},
			})
		},
	},
	/**
	 * 组件的方法列表
	 */
	methods: {
		parseLrc(sLrc) {
			let line = sLrc.split('\n')
			let lrcList = []
			// console.log(line)
			line.forEach((item) => {
				//match() 方法可在字符串内检索指定的值，或找到一个或多个正则表达式的匹配
				let time = item.match(/\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g)
				if (time != null) {
					// console.log(time)
					let lrc = item.split(time)[1]
					let timeReg = time[0].match(/(\d{2,}):(\d{2})(?:\.(\d{2,3}))?/)
					// console.log(timeReg)
					//把时间转成秒
					let timeSec =
						parseInt(timeReg[1]) * 60 +
						parseInt(timeReg[2]) +
						parseInt(timeReg[3]) / 1000
					lrcList.push({
						lrc,
						time: timeSec,
					})
				}
			})
			this.setData({
				lrcList,
			})
		},

		update(curTime) {
			// console.log(curTime)
			let lrcList = this.data.lrcList
			if (lrcList == 0) {
				return
			}
			//歌曲时间超过歌词时间
			if (curTime > lrcList[lrcList.length - 1].time) {
				if (this.data.nowLrc != -1) {
					this.setData({
						nowLrc: -1,
						scrollTop: lrcList.length * lyricHeight,
					})
				}
			}
			for (let i = 0, len = lrcList.length; i < len; i++) {
				if (curTime <= lrcList[i].time) {
					this.setData({
						nowLrc: i - 1,
						scrollTop: (i - 1) * lyricHeight,
					})
					break
				}
			}
			// console.log(this.data.scrollTop)
		},
	},
})
