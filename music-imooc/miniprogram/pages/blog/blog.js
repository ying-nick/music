// pages/blog/blog.js
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		modalShow: false,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {},
	//发布功能
	onPublish() {
		wx.getUserProfile({
			desc: '获取信息',
			success: (res) => {
				console.log(res)
			},
		})
	
	},
})
