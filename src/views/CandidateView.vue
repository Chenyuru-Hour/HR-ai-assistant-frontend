<template>
	<section class="content-panel">
		<h2 class="panel-title">候选列表</h2>
		<el-table :data="candidateList" border stripe>
			<el-table-column prop="name" label="姓名" min-width="120" />
			<el-table-column prop="email" label="邮箱" min-width="220" />
			<el-table-column prop="status" label="状态" min-width="120" />
		</el-table>
	</section>
</template>

<script setup>
const candidateList = [
	{ name: '张三', email: 'zhangsan@example.com', status: '待沟通' },
	{ name: '李四', email: 'lisi@example.com', status: '面试中' },
	{ name: '王五', email: 'wangwu@example.com', status: '已入库' }
]
</script>

<style scoped>
.content-panel {
	min-height: calc(100vh - 40px);
	padding: 20px;
	background: #ffffff;
	border-radius: 8px;
	box-sizing: border-box;
}

.panel-title {
	margin: 0 0 12px;
	font-size: 22px;
	color: #303133;
}
</style>
