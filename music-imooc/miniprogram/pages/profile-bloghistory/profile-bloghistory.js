// pages/profile-bloghistory/profile-bloghistory.js
const max_limit = 10
// const db=wx.cloud.database()
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		blogList: [],
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.getListByCloudFn()
	},
	//?获取自己的博客列表
	getListByCloudFn() {
		wx.showLoading({
			title: '不要急，休息休息一下',
			mask: true,
		})
		wx.cloud
			.callFunction({
				name: 'blog',
				data: {
					$url: 'getListByOpenid',
					start: this.data.blogList.length,
					count: max_limit,
				},
			})
			.then((res) => {
				// console.log(res)
				this.setData({
					blogList: this.data.blogList.concat(res.result),
				})
				wx.hideLoading()
			})
	},
	//?通过小程序端去请求数据
	/* _getListByMiniprogram() {
  wx.showLoading({
    title: '加载中',
  })
  db.collection('blog').skip(this.data.blogList.length)
    .limit(MAX_LIMIT).orderBy('createTime', 'desc').get().then((res) => {
      console.log(res)
      let _bloglist = res.data
      for (let i = 0, len = _bloglist.length; i < len; i++) {
        _bloglist[i].createTime = _bloglist[i].createTime.toString()
      }


      this.setData({
        blogList: this.data.blogList.concat(_bloglist)
      })

      wx.hideLoading()
    })

},
 */
	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {
		this.getListByCloudFn()
	},
})
