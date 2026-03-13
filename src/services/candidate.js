import { API_ENDPOINTS } from '@/config/api'
import { request } from '@/services/http'
import { normalizeCandidateList } from '@/services/normalizers'

export async function fetchCandidates(options = {}) {
	const response = await request({
		url: API_ENDPOINTS.listCandidates,
		method: 'get',
		signal: options.signal
	})

	return normalizeCandidateList(response.data)
}