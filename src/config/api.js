export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').trim()

export const API_ENDPOINTS = {
	uploadResume: '/resumes/upload',
	getResumeTask(taskId) {
		return `/resumes/tasks/${taskId}`
	},
	listCandidates: '/candidates'
}

export function ensureApiBaseUrl() {
	if (API_BASE_URL) {
		return API_BASE_URL
	}

	throw new Error('未配置 VITE_API_BASE_URL，请先填写 FastAPI 地址')
}