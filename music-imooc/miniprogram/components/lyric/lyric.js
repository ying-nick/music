// components/lyric/lyric.js
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
    lyric (lrc) {
      // console.log(lrc)
    }
  },
	/**
	 * 组件的初始数据
	 */
	data: {},

	/**
	 * 组件的方法列表
	 */
	methods: {},
})
