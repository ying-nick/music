// pages/blog-comment/blog-comment.js
import formatTime from '../../utils/formatTime'
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		blog: {},
		commentList: [],
		blogId: '',
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.setData({
			blogId: options.blogId,
		})
		// console.log(options)
		this.getBlogDetail()
	},
	getBlogDetail() {
		wx.showLoading({
			title: '客官请耐心等待',
			mask: true,
		})
		wx.cloud
			.callFunction({
				name: 'blog',
				data: {
					blogId: this.data.blogId,
					$url: 'detail',
				},
			})
			.then((res) => {
				//方式一
				/* 	let commentList = res.result.commentList.data
				for (let i = 0; i < commentList.length; i++) {
					commentList[i].creatTime = formatTime(
						new Date(commentList[i].creatTime)
					)
				}
				this.setData({
					blog: res.result.detail[0],
					commentList,
				})
				wx.hideLoading()
        // console.log(res) */
				//?方式二聚合
				const blog = res.result.list[0]
				let commentList = blog.commentList
				for (let i = 0, len = commentList.length; i < len; i++) {
					commentList[i].createTime = formatTime(
						new Date(commentList[i].createTime)
					)
				}

				this.setData({
					commentList,
					blog,
				})

				wx.hideLoading()
			})
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {
		return {
			title: this.data.blog.content,
			path: `/pages/blog-comment/blog-comment?blogId=${this.data.blog._id}`,
		}
	},
})
