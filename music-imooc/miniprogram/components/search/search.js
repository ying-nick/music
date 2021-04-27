// components/search/search.js
let key=''
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		placeholder: {
			type: String,
			value: '嘿嘿嘿',
		},
	},
	//?接收父传给子的class样式，名字为自己起的名字
	externalClasses: ['sousuo', 'ic'],

	/**
	 * 组件的初始数据
	 */
	data: {},

	/**
	 * 组件的方法列表
	 */
  methods: {
    onInput (e) {
      key=e.detail.value
    },
    onSearch () {
      this.triggerEvent('search', {
        key
      })
    }
  },
})
