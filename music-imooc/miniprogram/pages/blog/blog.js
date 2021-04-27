// pages/blog/blog.js
// import {getUserProfile} from "../../utils/userProfile"
let key=''
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		modalShow: false,
		blogList: [],
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.loadBlogList()
	},
	//发布功能
	onPublish() {
		this.setData({
			modalShow: true,
		})
	},
	//加载博客列表
	loadBlogList(start = 0, count = 10) {
		wx.showLoading({
			title: 'がんばって',
			mask: true,
		})
		wx.cloud
			.callFunction({
				name: 'blog',
        data: {
          key,
					start,
					count,
					$url: 'list',
				},
			})
			.then((res) => {
				this.setData({
					blogList: this.data.blogList.concat(res.result),
				})
				wx.hideLoading()
				wx.stopPullDownRefresh()
			})
	},
	//进入评论区
	goComment(e) {
		wx.navigateTo({
			url: `../../pages/blog-comment/blog-comment?blogid=${e.target.dataset.blogid}`,
		})
	},
	//下拉
	onPullDownRefresh() {
		this.setData({
			blogList: [],
		})
		this.loadBlogList()
	},
	//上滑
	onReachBottom() {
		this.loadBlogList(this.data.blogList.length)
	},
//?搜索
  onSearch (e) {
    key = e.detail.key
    this.setData({
      blogList:[]
    })
    this.loadBlogList()

  },
	//?用户信息获取成功
	loginsuccess(e) {
		// console.log(e)
		const detail = e.detail
		wx.navigateTo({
			url: `../blog-edit/blog-edit?name=${detail.nickName}&avaUrl=${detail.avatarUrl}`,
		})
	},
	//?用户信息获取失败
	loginfail() {
		//?模态框提示用户
		wx.showModal({
			title: 'Warn',
			content: 'no授权，no发布',
			success: (res) => {
				if (res.confirm) {
					// console.log('用户点击确定')
					this.setData({
						modalShow: true,
					})
				} else if (res.cancel) {
					// console.log('用户点击取消')
					this.setData({
						modalShow: false,
					})
				}
			},
		})
	},
})
