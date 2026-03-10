<template>
	<div class="upload-page">
		<h1 class="page-title">上传简历</h1>

		<div class="upload-wrapper">
			<el-upload
				ref="uploadRef"
				class="resume-upload"
				drag
				action="#"
				:auto-upload="false"
				:show-file-list="false"
				:before-upload="beforeUpload"
				:on-change="handleFileChange"
			>
				<el-icon class="upload-icon">
					<UploadFilled />
				</el-icon>
				<div class="upload-text">将简历文件拖到此处，或 <em>点击选择文件</em></div>
				<div class="upload-tip">支持任意文件（当前为前端模拟，不会发起真实上传）</div>
			</el-upload>
		</div>

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
					正在解析简历内容...
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
				处理失败，请点击“重新上传”后重试。
			</div>
		</el-card>

		<div class="actions">
			<el-button class="reset-btn" plain @click="reset">重新上传</el-button>
		</div>
	</div>
</template>

<script setup>
import { computed, onBeforeUnmount, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Loading, UploadFilled } from '@element-plus/icons-vue'

const uploadRef = ref(null)

const currentStatus = ref('pending')
const taskId = ref('')
const uploadProgress = ref(0)
const resultData = reactive({
	name: '',
	email: ''
})

const statusConfig = {
	pending: { label: '待上传', tagType: 'info' },
	uploading: { label: '上传中', tagType: 'primary' },
	processing: { label: '处理中', tagType: 'primary' },
	completed: { label: '已完成', tagType: 'success' },
	failed: { label: '失败', tagType: 'danger' }
}

const statusMeta = computed(() => statusConfig[currentStatus.value])

// 模拟流程使用的计时器：上传进度计时 + 阶段切换计时
let progressTimer = null
let stageTimer = null

// 阻止 el-upload 发起真实请求（当前页面仅做前端交互模拟）
function beforeUpload() {
	return false
}

function generateTaskId() {
	return `TASK-${Date.now()}-${Math.floor(Math.random() * 900 + 100)}`
}

function clearSimTimers() {
	if (progressTimer) {
		clearInterval(progressTimer)
		progressTimer = null
	}

	if (stageTimer) {
		clearTimeout(stageTimer)
		stageTimer = null
	}
}

function handleFileChange(file) {
	if (!file?.raw) return

	// 选择文件后，启动“上传中 -> 处理中 -> 已完成”的模拟状态流转
	simulateUpload()
}

// 模拟上传阶段：持续更新进度条，2 秒后进入处理阶段
function simulateUpload() {
	clearSimTimers()
	uploadRef.value?.clearFiles()

	currentStatus.value = 'uploading'
	taskId.value = generateTaskId()
	uploadProgress.value = 0
	resultData.name = ''
	resultData.email = ''

	ElMessage.info('开始上传（模拟）')

	progressTimer = setInterval(() => {
		if (uploadProgress.value >= 90) return
		uploadProgress.value += 15
	}, 300)

	stageTimer = setTimeout(() => {
		if (progressTimer) {
			clearInterval(progressTimer)
			progressTimer = null
		}
		uploadProgress.value = 100
		simulateProcess()
	}, 2000)
}

// 模拟处理阶段：2 秒后返回解析结果
function simulateProcess() {
	clearSimTimers()
	currentStatus.value = 'processing'

	ElMessage.info('上传完成，开始处理（模拟）')

	stageTimer = setTimeout(() => {
		simulateComplete()
	}, 2000)
}

// 模拟完成阶段：展示固定解析结果（后续可替换为真实后端返回）
function simulateComplete() {
	clearSimTimers()
	currentStatus.value = 'completed'
	resultData.name = '张三'
	resultData.email = 'zhangsan@example.com'

	ElMessage.success('简历解析完成（模拟）')
}

// 预留失败状态模拟函数，方便后续接入真实异常处理逻辑
function simulateFail() {
	clearSimTimers()
	currentStatus.value = 'failed'
	ElMessage.error('解析失败（模拟）')
}

// 重置到初始状态（待上传）
function reset() {
	clearSimTimers()
	uploadRef.value?.clearFiles()

	currentStatus.value = 'pending'
	taskId.value = ''
	uploadProgress.value = 0
	resultData.name = ''
	resultData.email = ''

	ElMessage.info('已重置为待上传状态')
}

onBeforeUnmount(() => {
	clearSimTimers()
})

defineExpose({
	simulateUpload,
	simulateProcess,
	simulateComplete,
	simulateFail,
	reset
})
</script>

<style scoped>
.upload-page {
	min-height: 100vh;
	padding: 50px;
	box-sizing: border-box;
	background: #f5f7fa;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.page-title {
	width: 100%;
	/* max-width: 600px; */
	margin: 0 0 16px;
	font-size: 24px;
	font-weight: 600;
	color: #303133;
}

.upload-wrapper {
	width: 100%;
	/* max-width: 600px; */
	display: flex;
	justify-content: center;
}

.resume-upload {
	width: 100%;
}

:deep(.resume-upload .el-upload),
:deep(.resume-upload .el-upload-dragger) {
	width: 100%;
}

:deep(.resume-upload .el-upload-dragger) {
	border: 2px dashed #dcdfe6;
	border-radius: 12px;
	background-color: #fff;
	padding: 36px 16px;
	transition: border-color 0.2s ease;
}

:deep(.resume-upload .el-upload-dragger:hover),
:deep(.resume-upload .el-upload-dragger.is-dragover) {
	border-color: #409eff;
}

.upload-icon {
	font-size: 48px;
	color: #909399;
	margin-bottom: 8px;
}

.upload-text {
	font-size: 15px;
	color: #606266;
}

.upload-text em {
	color: #409eff;
	font-style: normal;
}

.upload-tip {
	margin-top: 8px;
	font-size: 12px;
	color: #909399;
}

.status-card {
	width: 100%;
	/* max-width: 600px; */
	margin-top: 16px;
	border-radius: 12px;
}

.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.status-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 10px 0;
	border-bottom: 1px solid #f2f6fc;
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
	color: #909399;
	font-size: 14px;
}

.value {
	color: #303133;
	font-size: 14px;
	font-weight: 500;
}

.processing-text {
	display: inline-flex;
	align-items: center;
	gap: 6px;
	color: #409eff;
}

.error-text {
	margin-top: 8px;
	color: #f56c6c;
	font-size: 13px;
}

.actions {
	width: 100%;
	/* max-width: 600px; */
	margin-top: 12px;
	display: flex;
	justify-content: flex-end;
}

.reset-btn {
	border-color: #c0c4cc;
	color: #606266;
}

@media (max-width: 2000px) {
	.page-title {
		font-size: 20px;
	}

	.actions {
		justify-content: center;
	}
}
</style>
