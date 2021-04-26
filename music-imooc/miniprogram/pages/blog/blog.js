// pages/blog/blog.js
// import {getUserProfile} from "../../utils/userProfile"
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
		this.setData({
      modalShow: true,
    })
	
	},
})
