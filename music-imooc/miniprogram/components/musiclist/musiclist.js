// components/musiclist/musiclist.js
const app = getApp()
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
    musicList: Array,
    musicID: Number,
	},

	/**
	 * 组件的初始数据
	 */
	data: {
    // musicID: -1,
    playingId: -1
	},
  pageLifetimes: {
    show() {
      this.setData({
        playingId: parseInt(app.getPlaying())
      })

    }
  },
	/**
	 * 组件的方法列表
	 */
	methods: {
		onSelect(e) {
			// console.log(e.currentTarget.dataset.musicid)
			const ds = e.currentTarget.dataset
			const id = ds.musicid
			//?事件元,currentTarget绑定事件元素，target当前真正点击的元素
			/* this.setData({
				musicID: id,
      }) */
      this.setData({
        playingId: id
      })
			wx.navigateTo({
				url: `../../pages/player/player?id=${id}&index=${ds.index}`,
			})
		},
	},
})
