// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
//云函数数据库初始化
const db = cloud.database()

const axios = require('axios')
const URL = 'https://apis.imooc.com/personalized?icode=078B30EF9E572491'
const playlistCollection = db.collection('playlist')
// 云函数入口函数
exports.main = async (event, context) => {
	const list = await playlistCollection.get()
	const { data } = await axios.get(URL)
	if (data.code >= 1000) {
		console.log(data.msg)
		return 0
	}
	const playlist = data.result
	//数据库去重
	const newData = []
	for (let i = 0, len1 = playlist.length; i < len1; i++) {
		let flg = true
		for (let j = 0, len2 = list.data.length; j < len2; j++) {
			if (playlist[i].id === list.data[j].id) {
				flg = false
				break
			}
		}
		if (flg) {
			let pl = playlist[i]
			pl.createTime = db.serverDate()
			// newData.push(playlist[i])
			newData.push(pl)
		}
	}

	if (newData.length > 0) {
		await playlistCollection
			.add({
				data: newData,
			})
			.then((res) => {
				console.log('插入成功')
			})
			.catch((err) => {
				console.log(err)
				console.log('插入失败')
			})
	}
}
