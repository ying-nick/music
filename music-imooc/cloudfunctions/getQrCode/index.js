// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
	const wxContext = cloud.getWXContext()
	//申请小程序码，并修改样式
	const result = await cloud.openapi.wxacode.getUnlimited({
		scene: wxContext.OPENID,
		//  page:"pages/playlist/playlist",
		lineColor: {
			r: 95,
			g: 158,
			b: 160,
		},
		isHyaline: true,
	})
	//?将结果上传到云存储
	const upload = await cloud.uploadFile({
		cloudPath: 'qrcode/' + Date.now() + '-' + Math.random() + '.png',
		fileContent: result.buffer,
	})
	return upload.fileID
}
