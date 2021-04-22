// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const axios=require('axios')
const URL='https://apis.imocc.com/personalized?icode=078B30EF9E572491'
// 云函数入口函数
exports.main = async (event, context) => {
  const plRes=await axios.get(URL)
}