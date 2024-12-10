// api.js

// 封装HTTP请求函数
const httpRequest = (method) => async (url, data) => {
	return new Promise((resolve, reject) => {
		uni.request({
			url: `http://admin.evidentecn.com/api${url}`, // API基础URL需加在这里
			method: method.toUpperCase(),
			data: data,
			header: {
				token: uni.getStorageSync('token') || '', // 添加token到请求头
			},
			success: (response) => {
				if (response.statusCode === 200) {
					resolve(response.data) // 返回数据
				} else {
					reject(new Error(`API错误: ${response.statusCode}`)) // 错误处理
				}
			},
			fail: (error) => {
				console.error(`请求 ${method.toUpperCase()} ${url} 时出错:`, error)
				reject(error) // 传递错误
			},
		})
	})
}

// 封装GET、POST、PUT、DELETE请求
export const get = httpRequest('get')
export const post = httpRequest('post')
export const put = httpRequest('put')
export const del = httpRequest('delete')

// 提取的存储方法
const storeData = (key, data) => {
	try {
		uni.setStorageSync(key, data)
		console.log(`${key} 存储成功`)
	} catch (err) {
		console.error(`${key} 存储失败`, err)
	}
}
export const getUrlParameter = (paramName) => {
	if (typeof window === 'undefined') return null // 确保在浏览器环境中执行
	const href = window.location.href
	const paramMatch = href.match(new RegExp(`[?&]${paramName}=([^&#]*)`))
	return paramMatch ? paramMatch[1] : null
}

// 检查用户是否登录并重定向
export const checkLoginAndRedirect = () => {
	const token = uni.getStorageSync('token')
	if (token) {
		uni.switchTab({
			url: '/pages/index/index',
		})
		console.log('已登录，跳转至主页')
	} else {
		// 用户未登录，跳转到登录页
		uni.navigateTo({
			url: '/pages/login/login',
		})
		console.log('未登录，跳转至登录页')
	}
}
// 登录函数
export const login = async (credentials) => {
	const response = await post('/user/mobilelogin', credentials)
	const {
		token,
		...userInfo
	} = response.data.userinfo || {}
	console.log(response)
	// 检查token和userInfo是否存在
	if (!token) {
		throw new Error('未能获取token') // 如果没有token，抛出错误
	}

	// 使用提取的存储方法
	storeData('token', token)
	storeData('userInfo', JSON.stringify(userInfo))
	console.log(userInfo.company)

	return {
		token, // 返回token
		company: userInfo.company, // 返回company字段
	}
}

// 其他请求函数同样可以使用 uni.request
export const sendVerificationCode = async (mobile) => {
	return await post('/sms/send', {
		mobile,
		event: 'mobilelogin',
	})
}

// 打卡接口
export const punchIn = async (params) => {
	return await post('/index/point', params)
}

// 获取打卡记录的请求
export const getPunchLogs = async () => {
	return await post('/index/record')
}

// 保存个人信息的请求
export const submitInfo = async (params) => {
	return await post('/user/profile', params)
}

// 记录列表的请求
export const getRecordList = async (params) => {
	return await post('/index/pointList', params)
}

// 奖品的请求
export const getPrizeList = async (params) => {
	return await post('/index/award', params)
}

// 我的页面的请求
export const getMyPage = async () => {
	return await post('/index/getUser')
}

// 提交感兴趣产品的请求
export const submitInterestedProduct = async (params) => {
	return await post('/index/like', params)
}

// 奖品记录的请求
export const getPrizeRecord = async () => {
	return await post('/index/getMyAward')
}

// 删除奖品记录的请求
export const deletePrizeRecord = async (params) => {
	return await post('/index/delMyAward', params)
}