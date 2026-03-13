<template>
	<section class="candidate-page">
		<header class="panel-header">
			<div>
				<h2 class="panel-title">候选列表</h2>
				<p class="panel-desc">集中查看解析后的候选人基础信息与当前状态。</p>
			</div>
			<el-tag :type="summaryTagType" effect="plain">{{ summaryLabel }}</el-tag>
		</header>

		<div v-if="loading" class="candidate-loading">
			<el-skeleton :rows="6" animated />
		</div>

		<el-result
			v-else-if="errorMessage"
			class="candidate-error"
			icon="error"
			title="候选列表加载失败"
			:sub-title="errorMessage"
		>
			<template #extra>
				<el-button type="primary" @click="loadCandidates">重新加载</el-button>
			</template>
		</el-result>

		<el-table v-else-if="candidateList.length" :data="candidateList" class="candidate-table" border stripe>
			<el-table-column prop="name" label="姓名" min-width="120" />
			<el-table-column prop="email" label="邮箱" min-width="220" />
			<el-table-column prop="status" label="状态" min-width="120">
				<template #default="{ row }">
					<el-tag :type="statusTypeMap[row.status] || 'info'" effect="plain">{{ row.status || '待处理' }}</el-tag>
				</template>
			</el-table-column>
		</el-table>

		<el-empty v-else class="candidate-empty" description="暂无候选人数据" />
	</section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { fetchCandidates } from '@/services/candidate'

const candidateList = ref([])
const loading = ref(false)
const errorMessage = ref('')

let activeRequestController = null

const statusTypeMap = {
	待处理: 'info',
	待沟通: 'warning',
	面试中: 'primary',
	已入库: 'success'
}

const summaryLabel = computed(() => {
	if (loading.value) {
		return '加载中'
	}

	if (errorMessage.value) {
		return '加载失败'
	}

	return `共 ${candidateList.value.length} 人`
})

const summaryTagType = computed(() => (errorMessage.value ? 'danger' : 'info'))

function abortActiveRequest() {
	if (!activeRequestController) {
		return
	}

	activeRequestController.abort()
	activeRequestController = null
}

function isRequestCanceled(error) {
	return error?.code === 'ERR_CANCELED' || error?.name === 'CanceledError'
}

async function loadCandidates() {
	abortActiveRequest()
	loading.value = true
	errorMessage.value = ''

	const controller = new AbortController()
	activeRequestController = controller

	try {
		candidateList.value = await fetchCandidates({
			signal: controller.signal
		})
	} catch (error) {
		if (isRequestCanceled(error)) {
			return
		}

		candidateList.value = []
		errorMessage.value = error.message || '候选列表加载失败'
	} finally {
		if (activeRequestController === controller) {
			activeRequestController = null
		}

		loading.value = false
	}
}

onMounted(() => {
	loadCandidates()
})

onBeforeUnmount(() => {
	abortActiveRequest()
})
</script>

<style scoped>
.candidate-page {
	min-height: 100%;
	padding: 24px;
	background: var(--ms-bg-surface);
	border: 1px solid var(--ms-border-default);
	border-radius: var(--ms-radius-medium);
	box-shadow: var(--ms-shadow-small);
}

.panel-header {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: 12px;
}

.panel-title {
	margin: 0;
	font-size: 22px;
	font-weight: 600;
	color: var(--ms-text-primary);
}

.panel-desc {
	margin: 10px 0 0;
	font-size: 14px;
	color: var(--ms-text-secondary);
}

.candidate-table {
	margin-top: 18px;
}

.candidate-loading,
.candidate-empty,
.candidate-error {
	margin-top: 18px;
}

:deep(.candidate-table .el-table__header th) {
	background: var(--ms-bg-subtle);
	color: var(--ms-text-primary);
	font-weight: 600;
}

:deep(.candidate-table .el-table__row:hover td) {
	background: var(--ms-accent-soft);
}

@media (max-width: 768px) {
	.candidate-page {
		padding: 16px;
	}

	.panel-header {
		flex-direction: column;
	}
}
</style>
