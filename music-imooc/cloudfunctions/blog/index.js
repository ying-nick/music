// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const TcbRouter = require('tcb-router')
const db = cloud.database()
const blog = db.collection('blog')
// 云函数入口函数
exports.main = async (event, context) => {
	const app = new TcbRouter({
		event,
	})
	app.router('list', async (ctx, next) => {
		//?分页,每次从第几条开始查询,并排序
		ctx.body = await blog
			.skip(event.start)
			.limit(event.count)
			.orderBy('creatTime', 'desc')
			.get()
			.then((res) => {
				return res.data
			})
	})

	//返回服务
	return app.serve()
}
