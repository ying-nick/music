// components/playlist/playlist.js
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		playlist: {
			type: Object,
		},
	},
	//监控流量数字变化
	observers: {
		['playlist.playCount'](val) {
			// console.log(this)
			this.setData({
				count: this.tranNumber(val, 2),
			})
		},
	},
	/**
	 * 组件的初始数据
	 */
	data: {
		count: 0,
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		//数字以万为单位
		tranNumber(num, point) {
			let numStr = num.toString().split('.')[0]
			if (numStr.length < 6) {
				return numStr
			} else if (numStr.length >= 6 && numStr.length <= 8) {
				//十万流量
				let dnum = numStr.substring(
					numStr.length - 4,
					numStr.length - 4 + point
				)
				return parseFloat(parseInt(num / 10000) + '.' + dnum) + '万'
			} else if (numStr.length >= 8) {
				//亿流量
				let dnum = numStr.substring(
					numStr.length - 8,
					numStr.length - 8 + point
				)
				return parseFloat(parseInt(num / 100000000) + '.' + dnum) + '亿'
			}
		},
	},
})
