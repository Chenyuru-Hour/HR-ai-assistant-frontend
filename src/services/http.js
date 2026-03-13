import axios from 'axios'
import { API_BASE_URL, ensureApiBaseUrl } from '@/config/api'

const http = axios.create({
	baseURL: API_BASE_URL,
	timeout: 30000
})

function getErrorMessage(data) {
	if (typeof data === 'string' && data.trim()) {
		return data
	}

	if (typeof data?.detail === 'string' && data.detail.trim()) {
		return data.detail
	}

	if (Array.isArray(data?.detail)) {
		const detailText = data.detail
			.map((item) => {
				if (typeof item === 'string') {
					return item
				}

				return item?.msg || ''
			})
			.filter(Boolean)
			.join('；')

		if (detailText) {
			return detailText
		}
	}

	if (typeof data?.message === 'string' && data.message.trim()) {
		return data.message
	}

	return ''
}

function normalizeError(error) {
	if (error?.code === 'ERR_CANCELED') {
		return error
	}

	const responseData = error?.response?.data
	const normalizedError = new Error(
		getErrorMessage(responseData) || error?.message || '请求失败'
	)

	normalizedError.name = error?.name || 'ApiError'
	normalizedError.status = error?.response?.status ?? null
	normalizedError.data = responseData ?? null
	normalizedError.code = error?.code ?? null

	return normalizedError
}

http.interceptors.response.use(
	(response) => response,
	(error) => Promise.reject(normalizeError(error))
)

export async function request(config) {
	ensureApiBaseUrl()
	return http.request(config)
}

export default http