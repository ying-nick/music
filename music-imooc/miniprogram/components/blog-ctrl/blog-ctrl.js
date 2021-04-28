// components/blog-ctrl/blog-ctrl.js
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {},
	externalClasses: ['iconfont', 'icon-pinglun', 'icon-fenxiang'],
	/**
	 * 组件的初始数据
	 */
	data: {
		// 登录组件是否显示
		loginShow: false,
		// 底部弹出层是否显示
		modalShow: false,
		content: '',
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		onComment() {
			this.setData({
				loginShow: true,
			})
		},
		onLoginsuccess() {
			this.setData({
				loginShow: false,
			})
		},
		onLoginfail() {
			wx.showModal({
				title: '动动小指',
				content: '请点授权哟~亲',
				showCancel: true,
				cancelText: '取消',
				cancelColor: '#000000',
				confirmText: '确定',
				confirmColor: '#3CC51F',
				success: (result) => {
					if (result.confirm) {
						this.onComment()
					}
				},
			})
		},
		subscribeMsg() {},
	},
})
