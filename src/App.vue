<template>
	<div class="app-shell">
		<el-container class="layout-container">
			<el-aside class="left-nav" width="248px">
				<div class="brand-block">
					<div class="brand-title">HR AI Assistant</div>
					<p class="brand-subtitle">智能招聘工作台</p>
				</div>
				<el-menu :default-active="activePath" class="nav-menu" router>
					<el-menu-item index="/home">首页</el-menu-item>
					<el-menu-item index="/upload">上传简历</el-menu-item>
					<el-menu-item index="/candidates">候选列表</el-menu-item>
				</el-menu>
			</el-aside>

			<el-main class="right-content">
				<div class="content-wrap">
					<router-view />
				</div>
			</el-main>
		</el-container>
	</div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const activePath = computed(() => route.path)
</script>

<style scoped>

.app-shell {
	min-height: 100vh;
	background: var(--ms-bg-canvas);
}

.layout-container {
	min-height: 100vh;
	padding: 18px;
	gap: 16px;
}

.brand-block {
	padding: 20px 18px 14px;
	border-bottom: 1px solid var(--ms-border-default);
}

.brand-title {
	font-size: 18px;
	font-weight: 600;
	color: var(--ms-text-primary);
}

.brand-subtitle {
	margin: 8px 0 0;
	font-size: 13px;
	color: var(--ms-text-secondary);
}

.left-nav {
	overflow: hidden;
	background: var(--ms-bg-surface);
	border: 1px solid var(--ms-border-default);
	border-radius: var(--ms-radius-medium);
	box-shadow: var(--ms-shadow-small);
}

.nav-menu {
	border-right: none;
	padding: 8px;
}

:deep(.nav-menu .el-menu-item) {
	height: 40px;
	margin-bottom: 6px;
	line-height: 40px;
	border-radius: var(--ms-radius-small);
	color: var(--ms-text-secondary);
	font-weight: 500;
}

:deep(.nav-menu .el-menu-item:last-child) {
	margin-bottom: 0;
}

:deep(.nav-menu .el-menu-item:hover) {
	background: var(--ms-bg-subtle);
	color: var(--ms-text-primary);
}

:deep(.nav-menu .el-menu-item.is-active) {
	background: var(--ms-accent-soft);
	color: var(--ms-accent);
}

.right-content {
	padding: 0;
	min-width: 0;
	overflow: auto;
}

.content-wrap {
	min-height: calc(100vh - 36px);
}

@media (max-width: 1024px) {
	.layout-container {
		padding: 14px;
		gap: 12px;
	}

	.left-nav {
		width: 210px !important;
	}
}

@media (max-width: 768px) {
	.layout-container {
		padding: 10px;
	}

	.left-nav {
		width: 180px !important;
	}
}
</style>
