<template>
	<section class="upload-page">
		<header class="page-header">
			<h2 class="page-title">上传简历</h2>
			<p class="page-desc">上传候选人简历后，系统将自动解析基础信息。</p>
		</header>

		<div class="upload-layout">
			<el-card class="upload-card" shadow="never">
				<template #header>
					<div class="card-header">
						<span>文件上传</span>
					</div>
				</template>

				<el-upload
					ref="uploadRef"
					class="resume-upload"
					drag
					action="#"
					:auto-upload="false"
					:disabled="isBusy"
					:limit="1"
					:show-file-list="false"
					:on-change="handleFileChange"
				>
					<el-icon class="upload-icon">
						<UploadFilled />
					</el-icon>
					<div class="upload-text">将简历文件拖到此处，或 <em>点击选择文件</em></div>
					<div class="upload-tip">上传前请先配置 VITE_API_BASE_URL，文件会提交到 FastAPI 后端处理</div>
				</el-upload>
			</el-card>

			<el-card class="status-card" shadow="never">
				<template #header>
					<div class="card-header">
						<span>当前任务状态</span>
						<el-tag :type="statusMeta.tagType">{{ statusMeta.label }}</el-tag>
					</div>
				</template>

				<div class="status-row">
					<span class="label">任务 ID</span>
					<span class="value">{{ taskId || '-' }}</span>
				</div>

				<div v-if="currentStatus === 'uploading'" class="status-row status-progress">
					<span class="label">上传进度</span>
					<el-progress :percentage="uploadProgress" :stroke-width="10" />
				</div>

				<div v-if="currentStatus === 'processing'" class="status-row">
					<span class="label">处理进度</span>
					<span class="value processing-text">
						<el-icon class="is-loading">
							<Loading />
						</el-icon>
						正在等待后端返回解析结果...
					</span>
				</div>

				<div class="status-row">
					<span class="label">姓名</span>
					<span class="value">{{ resultData.name || '-' }}</span>
				</div>

				<div class="status-row">
					<span class="label">邮箱</span>
					<span class="value">{{ resultData.email || '-' }}</span>
				</div>

				<div v-if="currentStatus === 'failed'" class="error-text">
					{{ errorMessage || '处理失败，请点击“重新上传”后重试。' }}
				</div>
			</el-card>
		</div>

		<div class="actions">
			<el-button class="reset-btn" plain @click="reset">重新上传</el-button>
		</div>
	</section>
</template>

<script setup>
import { computed, onBeforeUnmount, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Loading, UploadFilled } from '@element-plus/icons-vue'
import { fetchResumeTask, uploadResume } from '@/services/resume'

const uploadRef = ref(null)

const currentStatus = ref('pending')
const taskId = ref('')
const uploadProgress = ref(0)
const errorMessage = ref('')
const resultData = reactive({
	name: '',
	email: ''
})

const POLL_INTERVAL = 2000

const statusConfig = {
	pending: { label: '待上传', tagType: 'info' },
	uploading: { label: '上传中', tagType: 'primary' },
	processing: { label: '处理中', tagType: 'primary' },
	completed: { label: '已完成', tagType: 'success' },
	failed: { label: '失败', tagType: 'danger' }
}

const statusMeta = computed(() => statusConfig[currentStatus.value])
const isBusy = computed(
	() => currentStatus.value === 'uploading' || currentStatus.value === 'processing'
)

let pollTimer = null
let activeRequestController = null

function resetResultData() {
	resultData.name = ''
	resultData.email = ''
}

function clearPollTimer() {
	if (!pollTimer) {
		return
	}

	clearTimeout(pollTimer)
	pollTimer = null
}

function abortActiveRequest() {
	if (!activeRequestController) {
		return
	}

	activeRequestController.abort()
	activeRequestController = null
}

function createRequestController() {
	abortActiveRequest()
	activeRequestController = new AbortController()
	return activeRequestController
}

function releaseRequestController(controller) {
	if (activeRequestController === controller) {
		activeRequestController = null
	}
}

function isRequestCanceled(error) {
	return error?.code === 'ERR_CANCELED' || error?.name === 'CanceledError'
}

function clearAsyncState() {
	clearPollTimer()
	abortActiveRequest()
}

function updateUploadProgress(event) {
	if (!event?.total) {
		return
	}

	uploadProgress.value = Math.min(99, Math.round((event.loaded / event.total) * 100))
}

function applyCompletedState(candidate = {}) {
	clearPollTimer()
	currentStatus.value = 'completed'
	resultData.name = candidate.name || ''
	resultData.email = candidate.email || ''
	errorMessage.value = ''

	ElMessage.success('简历解析完成')
}

function applyFailedState(message) {
	clearAsyncState()
	currentStatus.value = 'failed'
	uploadProgress.value = 0
	resetResultData()
	errorMessage.value = message || '处理失败，请点击“重新上传”后重试。'

	ElMessage.error(errorMessage.value)
}

function scheduleTaskPolling(nextTaskId) {
	clearPollTimer()
	pollTimer = setTimeout(() => {
		pollResumeTask(nextTaskId)
	}, POLL_INTERVAL)
}

async function resolveUploadResult(taskResult) {
	taskId.value = taskResult.taskId || ''

	if (taskResult.status === 'completed') {
		applyCompletedState(taskResult.candidate)
		return
	}

	if (taskResult.status === 'failed') {
		applyFailedState(taskResult.message || '简历解析失败')
		return
	}

	if (!taskResult.taskId) {
		applyFailedState('后端未返回解析结果或任务 ID')
		return
	}

	currentStatus.value = 'processing'
	errorMessage.value = ''

	ElMessage.info('上传完成，正在等待后端解析结果')
	scheduleTaskPolling(taskResult.taskId)
}

async function pollResumeTask(nextTaskId) {
	const controller = createRequestController()

	try {
		const taskResult = await fetchResumeTask(nextTaskId, {
			signal: controller.signal
		})

		if (taskResult.status === 'completed') {
			applyCompletedState(taskResult.candidate)
			return
		}

		if (taskResult.status === 'failed') {
			applyFailedState(taskResult.message || '简历解析失败')
			return
		}

		currentStatus.value = 'processing'
		scheduleTaskPolling(nextTaskId)
	} catch (error) {
		if (isRequestCanceled(error)) {
			return
		}

		applyFailedState(error.message || '获取解析结果失败')
	} finally {
		releaseRequestController(controller)
	}
}

async function handleFileChange(file) {
	if (!file?.raw) {
		return
	}

	if (isBusy.value) {
		ElMessage.warning('当前任务仍在执行中，请稍后再试')
		return
	}

	const controller = createRequestController()
	uploadRef.value?.clearFiles()
	clearPollTimer()
	currentStatus.value = 'uploading'
	taskId.value = ''
	uploadProgress.value = 1
	errorMessage.value = ''
	resetResultData()

	try {
		ElMessage.info('开始上传')

		const taskResult = await uploadResume(file.raw, {
			signal: controller.signal,
			onUploadProgress: updateUploadProgress
		})

		uploadProgress.value = 100
		await resolveUploadResult(taskResult)
	} catch (error) {
		if (isRequestCanceled(error)) {
			return
		}

		applyFailedState(error.message || '上传失败')
	} finally {
		releaseRequestController(controller)
	}
}

function reset() {
	clearAsyncState()
	uploadRef.value?.clearFiles()
	currentStatus.value = 'pending'
	taskId.value = ''
	uploadProgress.value = 0
	errorMessage.value = ''
	resetResultData()

	ElMessage.info('已重置为待上传状态')
}

onBeforeUnmount(() => {
	clearAsyncState()
})
</script>

<style scoped>
.upload-page {
	min-height: 100%;
	padding: 24px;
	background: var(--ms-bg-surface);
	border: 1px solid var(--ms-border-default);
	border-radius: var(--ms-radius-medium);
	box-shadow: var(--ms-shadow-small);
}

.page-header {
	margin-bottom: 16px;
}

.page-title {
	margin: 0;
	font-size: 22px;
	font-weight: 600;
	color: var(--ms-text-primary);
}

.page-desc {
	margin: 10px 0 0;
	font-size: 14px;
	color: var(--ms-text-secondary);
}

.upload-layout {
	display: grid;
	grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
	gap: 14px;
}

.upload-card,
.status-card {
	border: 1px solid var(--ms-border-default);
	border-radius: var(--ms-radius-medium);
}

:deep(.upload-card .el-card__body),
:deep(.status-card .el-card__body) {
	padding: 16px;
}

.resume-upload {
	width: 100%;
}

:deep(.resume-upload .el-upload),
:deep(.resume-upload .el-upload-dragger) {
	width: 100%;
}

:deep(.resume-upload .el-upload-dragger) {
	border: 1px dashed var(--ms-border-strong);
	border-radius: var(--ms-radius-medium);
	background-color: var(--ms-bg-subtle);
	padding: 36px 16px;
	transition: border-color 0.2s ease, background-color 0.2s ease;
}

:deep(.resume-upload .el-upload-dragger:hover),
:deep(.resume-upload .el-upload-dragger.is-dragover) {
	border-color: var(--ms-accent);
	background: var(--ms-accent-soft);
}

.upload-icon {
	font-size: 48px;
	color: var(--ms-text-secondary);
	margin-bottom: 8px;
}

.upload-text {
	font-size: 15px;
	color: var(--ms-text-secondary);
}

.upload-text em {
	color: var(--ms-accent);
	font-style: normal;
}

.upload-tip {
	margin-top: 8px;
	font-size: 12px;
	color: var(--ms-text-secondary);
}

.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-weight: 600;
	color: var(--ms-text-primary);
}

.status-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 10px 0;
	border-bottom: 1px solid var(--ms-border-default);
}

.status-row:last-of-type {
	border-bottom: none;
}

.status-progress {
	display: block;
}

.status-progress .label {
	display: block;
	margin-bottom: 8px;
}

.label {
	color: var(--ms-text-secondary);
	font-size: 14px;
}

.value {
	color: var(--ms-text-primary);
	font-size: 14px;
	font-weight: 500;
}

.processing-text {
	display: inline-flex;
	align-items: center;
	gap: 6px;
	color: var(--ms-accent);
}

.error-text {
	margin-top: 8px;
	color: var(--ms-danger);
	font-size: 13px;
}

.actions {
	margin-top: 12px;
	display: flex;
	justify-content: flex-end;
}

.reset-btn {
	border-color: var(--ms-border-strong);
	color: var(--ms-text-secondary);
}

@media (max-width: 1024px) {
	.upload-layout {
		grid-template-columns: 1fr;
	}

	.actions {
		justify-content: flex-start;
	}
}

@media (max-width: 768px) {
	.upload-page {
		padding: 16px;
	}

	.page-title {
		font-size: 20px;
	}
}
</style>
