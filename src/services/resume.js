import { API_ENDPOINTS } from '@/config/api'
import { request } from '@/services/http'
import { normalizeTaskPayload } from '@/services/normalizers'

export async function uploadResume(file, options = {}) {
	const formData = new FormData()
	formData.append('file', file)

	const response = await request({
		url: API_ENDPOINTS.uploadResume,
		method: 'post',
		data: formData,
		headers: {
			'Content-Type': 'multipart/form-data'
		},
		signal: options.signal,
		onUploadProgress: options.onUploadProgress
	})

	return normalizeTaskPayload(response.data)
}

export async function fetchResumeTask(taskId, options = {}) {
	if (!taskId) {
		throw new Error('缺少任务 ID，无法查询解析结果')
	}

	const response = await request({
		url: API_ENDPOINTS.getResumeTask(taskId),
		method: 'get',
		signal: options.signal
	})

	return normalizeTaskPayload(response.data)
}