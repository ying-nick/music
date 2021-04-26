function getUserProfile(_this) {
	// console.log(_this)
	wx.getUserProfile({
		desc: '用于发布信息时获取头像与昵称',
		success: (res) => {
			// console.log(res)
			_this.setData({
				modalShow: false,
			})
			_this.triggerEvent('loginsuccess', res.userInfo)
		},
		fail: (err) => {
			// console.log('用户拒绝授权')
			_this.setData({
				modalShow: false,
			})
			_this.triggerEvent('loginfail')
		},
	})
}
module.exports = {
	getUserProfile,
}
