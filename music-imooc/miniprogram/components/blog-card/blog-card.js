// components/blog-card/blog-card.js
import formatTime from '../../utils/formatTime'

Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		blog: Object,
	},
	//?监听发布时间
	observers: {
		['blog.createTime'](val) {
			if (val) {
				formatTime(new Date(val))
			}
		},
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
