// pages/blog-edit/blog-edit.js
//输入文字最大的个数
const maxNum = 140
const maxImg = 9
let content = ''
let userInfo = {}
//初始化云数据库
const db = wx.cloud.database()
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		//输入的文字个数
		wordsNum: 0,
		foot: 0,
		imgs: [],
		photo: true,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		// console.log(options)
		userInfo = options
	},
	onInput(e) {
		// console.log(e.detail.value)
		let wordsNum = e.detail.value.length
		if (wordsNum >= maxNum) {
			wordsNum = `最大字数为${maxNum}`
		}
		this.setData({
			wordsNum,
		})
		content = e.detail.value
	},
	onFocus(e) {
		this.setData({
			foot: e.detail.height,
		})
	},
	onBlur() {
		this.setData({
			foot: 0,
		})
	},
	del(e) {
		this.data.imgs.splice(e.currentTarget.dataset.index, 1)
		this.setData({
			imgs: this.data.imgs,
		})
		if (this.data.imgs.length == maxImg - 1) {
			this.setData({
				photo: true,
			})
		}
	},
	big(e) {
		//?放大图片
		wx.previewImage({
			current: e.currentTarget.dataset.src,
			urls: this.data.imgs,
		})
	},
	send() {
		//?发布，云数据库
		//?数据库：内容，图片fileId，openId，昵称，头像，时间
		//?图片->云存储fileId，云文件ID
		if (content.trim() === '') {
			wx.showModal({
				title: 'Boom',
				content: '说点噻，弄啥嘞',
				showCancel: true,
				cancelText: '取消',
				cancelColor: '#000000',
				confirmText: '确定',
				confirmColor: '#3CC51F',
			})
			return
		}
		wx.showLoading({
			title: '正在努力发布中',
			mask: true,
		})
		let promiseArr = []
		//fileId
		let fileIds = []
		//图片上传
		for (let i = 0; i < this.data.imgs.length; i++) {
			let p = new Promise((rev, rej) => {
				//文件扩展名
				let item = this.data.imgs[i]
				let suffix = /\.\w+$/.exec(item)[0]
				wx.cloud.uploadFile({
					cloudPath:
						'blog/' + Date.now() + '-' + Math.random() * 1000000 + suffix,
					filePath: item,
					success: (res) => {
						console.log(res)
						fileIds = [...fileIds, ...res.fileID]
						rev()
					},
					fail: (err) => {
						console.log(err)

						rej(err)
					},
				})
			})
			promiseArr.push(p)
		}
		//存入云数据库
		Promise.all(promiseArr).then((res) => {
			db.collection('blog')
				.add({
					data: {
						...userInfo,
						content,
						img: fileIds,
						createTime: db.serverDate(), //获取服务端时间
					},
				})
				.then((res) => {
					//隐藏加载框
					wx.hideLoading()
					//发布成功提醒
					wx.showToast({
						title: '朕做到了',
						icon: 'none',
						image: '../../images/success.png',
						duration: 1500,
						mask: true,
						success: (result) => {},
						fail: () => {},
						complete: () => {
							setTimeout(() => {
								//返回博客页面并刷新
								wx.navigateBack({
									delta: 1,
								})
							}, 500)
						},
					})
				})
				.catch((err) => {
					wx.hideLoading()
					wx.showToast({
						title: '臣妾做不到,要不再试试',
						icon: 'none',
						image: '../../images/cry.png',
						duration: 1500,
						mask: true,
					})
				})
		})
	},
	chooseImg() {
		let max = maxImg - this.data.imgs.length
		//?选择图片，添加
		wx.chooseImage({
			count: max,
			sizeType: ['original', 'compressed'],
			sourceType: ['album', 'camera'],
			success: (res) => {
				this.setData({
					imgs: [...this.data.imgs, ...res.tempFilePaths],
				})
				max = maxImg - this.data.imgs.length
				this.setData({
					photo: max <= 0 ? false : true,
				})
			},
		})
	},
})
