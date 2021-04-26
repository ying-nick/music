// components/login/login.js
import { getUserProfile } from '../../utils/userProfile'
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		modalShow: Boolean,
	},

	/**
	 * 组件的初始数据
	 */
	data: {},

	/**
	 * 组件的方法列表
	 */
	methods: {
    onGotUserInfo () {
      let _this=this
			getUserProfile(_this)
		},
	},
})
