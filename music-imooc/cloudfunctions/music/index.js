// 云函数入口文件
const cloud = require('wx-server-sdk')
//tcb路由
const tcbRouter = require('tcb-router')
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
	// console.log(event)
	const app = new tcbRouter({ event })
	app.router('playlist', async (ctx, next) => {
		ctx.body = await cloud
			.database()
			.collection('playlist')
			.skip(event.start)
			.limit(event.count)
			.orderBy('createTime', 'desc') //倒序排列
			.get()
			.then((res) => {
				return res
			})
	})
	app.router('musiclist', async (ctx, next) => {})
	return app.serve()
}
