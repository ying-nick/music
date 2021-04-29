// components/blog-ctrl/blog-ctrl.js
let userInfo = {}
//?小程序端进行数据库上传
const db = wx.cloud.database()
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		blogId: String,
	},
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
		onLoginsuccess(e) {
			// console.log(e.detail)
			userInfo = e.detail
			//?setdata的回调
			this.setData(
				{
					loginShow: false,
				},
				() => {
					this.setData({
						modalShow: true,
					})
				}
			)
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
		onInput(e) {
			// console.log(e)
			this.setData({
				content: e.detail.value,
			})
		},
		onSend() {
			// console.log(e)
			let content = this.data.content
			if (content.trim() == '') {
				wx.showModal({
					title: '啥子都能说',
					content: '麻溜滴',
					showCancel: true,
					cancelText: '取消',
					cancelColor: '#000000',
					confirmText: '确定',
					confirmColor: '#3CC51F',
					success: (result) => {
						if (!result.confirm) {
							this.setData({
								modalShow: false,
							})
						}
					},
				})
				return
			}
			wx.showLoading({
				title: 'Let the world hear you!',
				mask: true,
			})
			//?小程序端将评论插入云数据库
			db.collection('blog-comment')
				.add({
					data: {
						content,
						creatTime: db.serverDate(),
						blogId: this.properties.blogId,
						nickName: userInfo.nickName,
						avatarUrl: userInfo.avatarUrl,
					},
				})
				.then((res) => {
					wx.hideLoading()
					wx.showToast({
						title: 'WlWlRkU',
						icon: 'none',
						image: '../../images/super.png',
						duration: 1500,
						mask: true,
						success: (result) => {},
						fail: () => {},
						complete: () => {
							this.setData({
                modalShow: false,
                content:''
							})
						},
					})
				})
		},
		subscribeMsg() {},
	},
})
