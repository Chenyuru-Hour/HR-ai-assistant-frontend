const processingTaskStates = new Set([
	'pending',
	'queued',
	'processing',
	'running',
	'in_progress',
	'uploading'
])

const completedTaskStates = new Set([
	'completed',
	'success',
	'done',
	'finished',
	'parsed'
])

const failedTaskStates = new Set([
	'failed',
	'error',
	'cancelled',
	'canceled'
])

const candidateStatusMap = {
	pending: '待处理',
	new: '待处理',
	contacted: '待沟通',
	screening: '待沟通',
	interview: '面试中',
	interviewing: '面试中',
	in_progress: '面试中',
	archived: '已入库',
	hired: '已入库',
	completed: '已入库'
}

function getObjectValue(source, keys) {
	return keys.reduce((value, key) => {
		if (value) {
			return value
		}

		const nextValue = source?.[key]
		return typeof nextValue === 'string' ? nextValue.trim() : nextValue
	}, '')
}

function normalizeCandidateStatus(value) {
	if (typeof value !== 'string' || !value.trim()) {
		return '待处理'
	}

	const normalizedValue = value.trim().toLowerCase()
	return candidateStatusMap[normalizedValue] || value.trim()
}

function hasCandidateInfo(candidate) {
	return Boolean(candidate.name || candidate.email)
}

export function normalizeCandidate(payload = {}) {
	const source = payload.candidate || payload.profile || payload.applicant || payload

	return {
		id: getObjectValue(source, ['id', 'candidateId', 'candidate_id', 'resumeId', 'resume_id']),
		name: getObjectValue(source, ['name', 'candidateName', 'candidate_name', 'fullName', 'full_name']),
		email: getObjectValue(source, ['email', 'candidateEmail', 'candidate_email', 'mail']),
		status: normalizeCandidateStatus(
			getObjectValue(source, ['status', 'stage', 'processStatus', 'process_status', 'state'])
		)
	}
}

export function normalizeTaskStatus(value, candidate) {
	const normalizedValue = String(value || '').trim().toLowerCase()

	if (completedTaskStates.has(normalizedValue)) {
		return 'completed'
	}

	if (failedTaskStates.has(normalizedValue)) {
		return 'failed'
	}

	if (processingTaskStates.has(normalizedValue)) {
		return 'processing'
	}

	return hasCandidateInfo(candidate) ? 'completed' : 'processing'
}

export function normalizeTaskPayload(payload = {}) {
	const data = payload?.data && typeof payload.data === 'object' && !Array.isArray(payload.data)
		? payload.data
		: payload

	const candidateSource =
		(data?.result && typeof data.result === 'object' && !Array.isArray(data.result) && data.result) ||
		(data?.candidate && typeof data.candidate === 'object' && !Array.isArray(data.candidate) && data.candidate) ||
		(data?.profile && typeof data.profile === 'object' && !Array.isArray(data.profile) && data.profile) ||
		data

	const candidate = normalizeCandidate(candidateSource)

	return {
		taskId: getObjectValue(data, ['taskId', 'task_id', 'id']),
		status: normalizeTaskStatus(
			getObjectValue(data, ['status', 'taskStatus', 'task_status', 'state']),
			candidate
		),
		candidate,
		message: getObjectValue(data, ['message', 'detail'])
	}
}

export function normalizeCandidateList(payload) {
	const list = Array.isArray(payload)
		? payload
		: Array.isArray(payload?.items)
			? payload.items
			: Array.isArray(payload?.data)
				? payload.data
				: Array.isArray(payload?.results)
					? payload.results
					: Array.isArray(payload?.candidates)
						? payload.candidates
						: []

	return list.map((item) => normalizeCandidate(item))
}