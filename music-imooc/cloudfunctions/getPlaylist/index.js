// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
	env: 'cloud1-8g4btmo4df7e108b',
})
//云函数数据库初始化
const db = cloud.database()

const axios = require('axios')
const URL = 'https://apis.imooc.com/personalized?icode=078B30EF9E572491'
const playlistCollection = db.collection('playlist')
const maxLimit = 10
// 云函数入口函数
exports.main = async (event, context) => {
	//get只能获取100条信息
	// const list = await playlistCollection.get()
	//获取总的数据数量
	const count = await playlistCollection.count()
	// console.log(count)
	const total = count.total
	// console.log(total)
	//获取需要取多少次数据
	const batchTime = Math.ceil(total / maxLimit)
	const tasks = []

	for (let i = 0; i < batchTime; i++) {
		//从第i*maxLimit开始获取maxLimit条数据
		let news = playlistCollection
			.skip(i * maxLimit)
			.limit(maxLimit)
			.get()
		// console.log(news)
		tasks.push(news)
	}
	// console.log(tasks)
	//tasks是个promise
	let list = {
		data: [],
	}
	//异步将tasks数据赋给list
	if (tasks.length > 0) {
		// console.log(await Promise.all(tasks))
		list = (await Promise.all(tasks)).reduce((acc, cur) => {
			return {
				data: acc.data.concat(cur.data),
			}
		})
		// console.log(list)
	}

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
