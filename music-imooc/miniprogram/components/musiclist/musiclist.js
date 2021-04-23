// components/musiclist/musiclist.js
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		musicList: Array,
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		musicID: -1,
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		onSelect(e) {
			// console.log(e.currentTarget.dataset.musicid)
			const id = e.currentTarget.dataset.musicid
			//事件元,currentTarget绑定事件元素，target当前真正点击的元素
			this.setData({
				musicID: id,
			})
			wx.navigateTo({
				url: `../../pages/player/player?if=${id}`,
			})
		},
	},
})
