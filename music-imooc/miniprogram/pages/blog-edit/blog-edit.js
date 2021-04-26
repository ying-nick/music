// pages/blog-edit/blog-edit.js
//输入文字最大的个数
const maxNum = 140
const maxImg = 9
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
		wx.previewImage({
			current: e.currentTarget.dataset.src,
			urls: this.data.imgs,
		})
	},
	chooseImg() {
		let max = maxImg - this.data.imgs.length
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
