// components/bottom-modal/bottom-modal.js
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
    modalShow: Boolean,
	},
	options: {
		//?导入外部样式方式三
		styleIsolation: 'apply-shared',
		//?多个插槽
		multipleSlots: true,
	},
	/**
	 * 组件的初始数据
	 */
	data: {},

	/**
	 * 组件的方法列表
	 */
	methods: {
		close() {
			this.setData({
				modalShow: false,
			})
		},
	},
})
