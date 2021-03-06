// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) 
const TcbRouter = require('tcb-router')
const db = cloud.database()
const blog = db.collection('blog')
const MAX_LIMIT = 100
// 云函数入口函数
exports.main = async (event, context) => {
	const app = new TcbRouter({
		event,
	})
	app.router('list', async (ctx, next) => {
		//?分页,每次从第几条开始查询,并排序,模糊查询
		let w = {}
		if (event.key.trim() != '') {
			//?模糊搜索,正则表达式
			w = {
				content: db.RegExp({
					regexp: event.key,
					options: 'i',
				}),
			}
		}
		//?分页,每次从第几条开始查询,并排序,模糊查询
		ctx.body = await blog
			.where(w)
			.skip(event.start)
			.limit(event.count)
			.orderBy('createTime', 'desc')
			.get()
			.then((res) => {
				return res.data
			})
	})
	app.router('detail', async (ctx, next) => {
		let blogId = event.blogId
		/* //通过博客ID查询详情方法一
		let detail = await blog
			.where({
				_id: blogId,
			})
			.get()
			.then((res) => {
				return res.data
			})
		//评论查询
		const countResult = await db.collection('blog-comment').count()
		const total = countResult.total
		let commentList = {
			data: [],
		}
		if (total > 0) {
			const bachTime = Math.ceil(total / MAX_LIMIT)
			const tasks = []
			for (let i = 0; i < bachTime; i++) {
				let promise = db
					.collection('blog-comment')
					.skip(i * MAX_LIMIT)
					.limit(MAX_LIMIT)
					.where({
						blogId,
					})
					.orderBy('creatTime', 'desc')
					.get()
				tasks.push(promise)
			}
			if (tasks.length > 0) {
				commentList = (await Promise.all(tasks)).reduce((acc, cur) => {
					return {
						data: acc.data.concat(cur.data),
					}
				})
			}
		}
		ctx.body = {
			commentList,
			detail,
    } */

    //?方法二聚合
    const blog = await db.collection('blog').aggregate().match({
      _id: blogId
    }).lookup({
      from: 'blog-comment',
      localField: '_id',
      foreignField: 'blogId',
      as: 'commentList'
		}).end()
		// console.log(blog)
    ctx.body = blog
	})
	const wxContext = cloud.getWXContext()
	app.router('getListByOpenid', async (ctx, next) => {
		ctx.body = await blog
			.where({
				_openid: wxContext.OPENID,
			})
			.skip(event.start)
			.limit(event.count)
			.orderBy('createTime', 'desc')
			.get()
			.then((res) => {
				return res.data
			})
	})
	//返回服务
	return app.serve()
}
