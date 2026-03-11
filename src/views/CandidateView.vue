<template>
	<section class="candidate-page">
		<header class="panel-header">
			<div>
				<h2 class="panel-title">候选列表</h2>
				<p class="panel-desc">集中查看解析后的候选人基础信息与当前状态。</p>
			</div>
			<el-tag type="info" effect="plain">共 {{ candidateList.length }} 人</el-tag>
		</header>

		<el-table :data="candidateList" class="candidate-table" border stripe>
			<el-table-column prop="name" label="姓名" min-width="120" />
			<el-table-column prop="email" label="邮箱" min-width="220" />
			<el-table-column prop="status" label="状态" min-width="120">
				<template #default="{ row }">
					<el-tag :type="statusTypeMap[row.status] || 'info'" effect="plain">{{ row.status }}</el-tag>
				</template>
			</el-table-column>
		</el-table>
	</section>
</template>

<script setup>
const candidateList = [
	{ name: '张三', email: 'zhangsan@example.com', status: '待沟通' },
	{ name: '李四', email: 'lisi@example.com', status: '面试中' },
	{ name: '王五', email: 'wangwu@example.com', status: '已入库' }
]

const statusTypeMap = {
	待沟通: 'warning',
	面试中: 'primary',
	已入库: 'success'
}
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
