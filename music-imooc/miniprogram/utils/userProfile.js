function getUserProfile() {
	wx.getUserProfile({
		desc: '用于完善个人资料',
		success: function (res) {
			var userInfo = res.userInfo
			// console.log('userInfo==>', userInfo)
			wx.setStorageSync('storage_info', 'musicOk') //本地标记
			//下面将userInfo存入服务器中的用户个人资料
			//...
		},
		fail() {
			console.log('用户拒绝授权')
		},
	})
}
module.exports = {
	getUserProfile,
}
